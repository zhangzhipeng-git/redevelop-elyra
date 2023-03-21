/*
 * Copyright 2018-2022 Elyra Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path from '../path';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';

import {
  CanvasClickEvent,
  CanvasEditEvent,
  CanvasSelectionEvent,
  CommonCanvas,
  ContextMenu,
  ContextMenuEvent,
  DividerItem,
  NodeTypeDef,
  TipEvent,
  TipNode
} from '@elyra/canvas';
import { IntlProvider } from 'react-intl';
import styled, { useTheme } from 'styled-components';

import NodeTooltip from '../NodeTooltip';
import PipelineController from '../PipelineController';

import { NodeProperties } from '../properties-panels';
import { PipelinePropertiesPanel } from '../properties-panels/';

import SplitPanelLayout from '../SplitPanelLayout';
import TabbedPanelLayout from '../TabbedPanelLayout';
import { InternalThemeProvider } from '../ThemeProvider';
import useBlockEvents from './useBlockEvents';

interface Props {
  pipeline: any;
  toolbar?: any;
  palette?: any;
  pipelineProperties?: any;
  onAction?: (action: { type: string; payload?: any }) => any;
  onChange?: (pipeline: any) => any;
  onDoubleClickNode?: (e: CanvasClickEvent) => any;
  onError?: (error: Error) => any;
  onFileRequested?: (options: any) => any;
  readOnly?: boolean;
  children?: React.ReactNode;
  nativeKeyboardActions?: boolean;
  leftPalette?: boolean;
  handleBeforeAddNodeGetOp?: (op?: string) => Promise<string>;
  handleAfterSelectFileUploadFile: (
    paths: string[]
  ) => Promise<{ paths: string[] }>;
  handleUpdateNodeProperties: (o: {
    type: string;
    applicationId: number;
  }) => Promise<void>;
}

/** pipeline 只读时的节点路径 */
const READ_ONLY_NODE_SVG_PATH =
  'M 0 0 h 160 a 6 6 0 0 1 6 6 v 28 a 6 6 0 0 1 -6 6 h -160 a 6 6 0 0 1 -6 -6 v -28 a 6 6 0 0 1 6 -6 z';

function isCreateNodeEvent(e: CanvasEditEvent): e is {
  editType: 'createNode' | 'createAutoNode';
  nodeTemplate: { op: string };
  finalized?: boolean;
} {
  return e.editType === 'createNode' || e.editType === 'createAutoNode';
}

function isDivider(m: any): m is DividerItem {
  return (m as DividerItem).divider === true;
}

function isMenuItemEnabled(menu: ContextMenu, action: string) {
  const item = menu.find(m => {
    if (isDivider(m)) {
      return false;
    }

    if (m.menu === undefined) {
      return m.action === action;
    }
    // If there is a sub menu, search it as well.
    return m.menu.find(mm => mm.action === action);
  });

  if (item === undefined) {
    return false;
  }

  if (isDivider(item)) {
    return false;
  }

  return item.enable !== false;
}

const Container = styled.div`
  height: 100%;
  color: ${({ theme }) => theme.palette.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: ${({ theme }) => theme.typography.fontSize};
`;

function useCloseContextMenu(controller: React.MutableRefObject<any>) {
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      const el = document.getElementById('context-menu-popover');
      // Do nothing if clicking ref's element or descendent elements
      if (el === null || el.contains(e.target as Node)) {
        return;
      }
      controller.current.closeContextMenu();
    }

    function handleFocusChange() {
      if (!document.hasFocus()) {
        controller.current.closeContextMenu();
      }
    }

    document.addEventListener('visibilitychange', handleFocusChange);
    window.addEventListener('blur', handleFocusChange);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('visibilitychange', handleFocusChange);
      window.removeEventListener('blur', handleFocusChange);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [controller]);
}

const PipelineEditor = forwardRef(
  (
    {
      pipeline,
      palette,
      pipelineProperties,
      toolbar,
      onAction,
      onChange,
      onDoubleClickNode,
      onError,
      onFileRequested,
      readOnly = false,
      children,
      nativeKeyboardActions,
      leftPalette = true,
      handleBeforeAddNodeGetOp,
      handleAfterSelectFileUploadFile,
      handleUpdateNodeProperties
    }: Props,
    ref
  ) => {
    const theme = useTheme();
    const controller = useRef(new PipelineController());

    const [currentTab, setCurrentTab] = useState<string | undefined>();
    const [panelOpen, setPanelOpen] = useState(false);

    useCloseContextMenu(controller);

    const blockingRef = useBlockEvents({
      wheel: true,
      contextmenu: readOnly
    });

    useEffect(() => {
      try {
        controller.current.open(pipeline);
        if (!readOnly) {
          controller.current.setPalette(palette);
          controller.current.validate({ redColor: theme.palette.error.main });
        } else {
          controller.current.resetStyles();
        }
        // don't call to persist change because it will cause an infinate loop
      } catch (e) {
        console.error(e, 'error');
        onError?.(e as any);
      }
    }, [palette, onError, pipeline, readOnly, theme.palette.error.main]);

    useImperativeHandle(
      ref,
      () => ({
        addFile: async (payload: any) => {
          controller.current.editActionHandler({
            editType: 'createNode',
            ...payload
          });
        },
        controller
      }),
      []
    );

    const handleContextMenu = useCallback(
      (e: ContextMenuEvent, defaultMenu: ContextMenu): ContextMenu => {
        const canPaste = isMenuItemEnabled(defaultMenu, 'paste');

        const canDisconnect = isMenuItemEnabled(defaultMenu, 'disconnectNode');

        if (e.selectedObjectIds.length > 1) {
          return [
            {
              action: 'cut',
              label: '剪切'
            },
            {
              action: 'copy',
              label: '复制'
            },
            {
              divider: true
            },
            {
              action: 'disconnectNode',
              label: '断开连接',
              enable: canDisconnect
            },
            {
              action: 'deleteSelectedObjects',
              label: '删除'
            }
          ];
        }

        switch (e.type) {
          case 'canvas':
            return [
              {
                action: 'openPipelineProperties',
                label: '查看 Pipeline 属性'
              },
              {
                divider: true
              },
              {
                action: 'newFileNode',
                label: '从文件中新建节点'
              },
              {
                action: 'createComment',
                label: '创建注释节点'
              },
              {
                divider: true
              },
              {
                action: 'paste',
                label: '粘贴',
                enable: canPaste
              }
            ];
          case 'node':
            if (e.targetObject.type === 'execution_node') {
              const filenameRef = controller.current.resolveParameterRef(
                e.targetObject.op,
                'filehandler'
              );
              const parameters = e.targetObject.app_data?.component_parameters;

              return [
                {
                  action: 'openFile',
                  label: '查看文件',
                  // NOTE: This only checks if the string is empty, but we
                  // should verify the file exists.
                  enable:
                    filenameRef === undefined ||
                    (parameters?.[filenameRef] !== undefined &&
                      parameters?.[filenameRef].trim() !== '')
                },
                {
                  action: 'properties',
                  label: '查看属性'
                },
                {
                  divider: true
                },
                {
                  action: 'cut',
                  label: '剪切'
                },
                {
                  action: 'copy',
                  label: '复制'
                },
                {
                  divider: true
                },
                {
                  action: 'disconnectNode',
                  label: '断开连接',
                  enable: canDisconnect
                },
                {
                  action: 'deleteSelectedObjects',
                  label: '删除'
                }
              ];
            }
            if (e.targetObject.type === 'super_node') {
              return [
                {
                  action: 'cut',
                  label: '剪切'
                },
                {
                  action: 'copy',
                  label: '复制'
                },
                {
                  divider: true
                },
                {
                  action: 'disconnectNode',
                  label: '断开连接',
                  enable: canDisconnect
                },
                {
                  action: 'deleteSelectedObjects',
                  label: '删除'
                }
              ];
            }
            break;
          case 'link':
            return [
              {
                action: 'deleteLink',
                label: '删除'
              }
            ];
          case 'comment':
            return [
              {
                action: 'cut',
                label: '剪切'
              },
              {
                action: 'copy',
                label: '复制'
              },
              {
                divider: true
              },
              {
                action: 'disconnectNode',
                label: '断开连接',
                enable: canDisconnect
              },
              {
                action: 'deleteSelectedObjects',
                label: '删除'
              }
            ];
        }

        // anything else
        return defaultMenu;
      },
      []
    );

    const handleClickAction = useCallback(
      (e: CanvasClickEvent) => {
        if (e.clickType === 'DOUBLE_CLICK' && e.objectType === 'node') {
          if (onDoubleClickNode !== undefined) {
            return onDoubleClickNode(e);
          }
          controller.current.editActionHandler({ editType: 'properties' });
        }
      },
      [onDoubleClickNode]
    );

    const [selectedNodeIDs, setSelectedNodeIDs] = useState<string[]>();
    const handleSelectionChange = useCallback(
      (e: CanvasSelectionEvent) => {
        setSelectedNodeIDs(e.selectedNodes.map((n: NodeTypeDef) => n.id));
        if (e.selectedNodes.length > 0) {
          setCurrentTab('properties');
        } else if (controller.current.getNodes().length > 0 || leftPalette) {
          setCurrentTab('pipeline-properties');
        } else {
          setCurrentTab('palette');
        }
      },
      [leftPalette]
    );

    const handleBeforeEditAction = useCallback((e: CanvasEditEvent) => {
      if (isCreateNodeEvent(e) && e.finalized === true) {
        delete e.finalized;
        return e;
      }

      if (isCreateNodeEvent(e)) {
        // the edit was created by canvas, reconstruct and pass to addNode
        console.log('==从文件新建节点或拖拽节点到 pipeline 中==');
        controller.current.addNode({
          ...e
        });

        // cancel the edit until we finalize properties.
        return null;
      }

      return e;
    }, []);

    const handleEditAction = useCallback(
      async (e: CanvasEditEvent) => {
        let payload;
        let type = e.editType;

        switch (type) {
          case 'newFileNode':
            console.log('==从文件中新建节点==');
            const nodes = controller.current.getAllPaletteNodes();
            let extensions = nodes.map(n => n.app_data.extensions).flat();
            extensions = Array.from(new Set(extensions));
            const [filepath] = await onFileRequested?.({
              canSelectMany: false,
              filters: { File: extensions }
            });
            const node = nodes.find(n =>
              n.app_data.extensions?.includes(path.extname(filepath))
            );
            if (!node) return;
            const op = await handleBeforeAddNodeGetOp?.(node.op);
            const { paths } = await handleAfterSelectFileUploadFile([filepath]);
            controller.current.editActionHandler({
              editType: 'createNode',
              nodeTemplate: { op },
              pipelineId: e.pipelineId,
              offsetX: e.mousePos.x,
              offsetY: e.mousePos.y,
              path: filepath,
              mainApplicationFile: paths[0]
            });
            break;
          case 'openFile':
            const filenameRef = controller.current.resolveParameterRef(
              e.targetObject.op,
              'filehandler'
            );
            if (!filenameRef) return;
            payload =
              e.targetObject?.app_data?.component_parameters?.[filenameRef];
            break;
          case 'openPipelineProperties':
            setCurrentTab('pipeline-properties');
            setPanelOpen(true);
            return;
          case 'properties':
            setCurrentTab('properties');
            setPanelOpen(true);
            return;
          case 'toggleOpenPanel':
            setPanelOpen(prev => !prev);
            return;
          case 'displayPreviousPipeline':
          case 'displaySubPipeline':
          case 'copy':
            return;
        }

        // save ，run，submit clean，toggleOpenPanel，properties，openFile
        onAction?.({ type, payload });

        // 设置异步任务，等待前序所有变化（比如批量插入节点）在画布中完成后，再重新设置 pipeline 数据
        Promise.resolve().then(() => {
          // Catch any events where a save isn't necessary.
          onChange?.(controller.current.getPipelineFlow());
        });
      },
      [onAction, onChange, onFileRequested]
    );

    const handlePropertiesChange = useCallback(
      (nodeID, data) => {
        controller.current.updateProperties(nodeID, data);
        onChange?.(controller.current.getPipelineFlow());
      },
      [onChange]
    );

    const handlePipelinePropertiesChange = useCallback(
      data => {
        const pipeline = controller.current.getPipelineFlow();
        if (pipeline?.pipelines?.[0]?.app_data) {
          pipeline.pipelines[0].app_data.properties = {
            ...pipeline.pipelines[0].app_data.properties,
            ...data
          };
          controller.current.setPipelineFlow(pipeline);
          onChange?.(controller.current.getPipelineFlow());
        }
      },
      [onChange]
    );

    const handleTooltip = (tipType: string, e: TipEvent) => {
      function isNodeTipEvent(type: string, _e: TipEvent): _e is TipNode {
        return type === 'tipTypeNode';
      }
      if (isNodeTipEvent(tipType, e) && e.node.type === 'execution_node') {
        const error = controller.current.errors(e.node.id);
        const properties = controller.current.properties(e.node.id);
        const node = controller.current
          .getAllPaletteNodes()
          .find(n => n.op === e.node.op);
        return (
          <NodeTooltip
            error={error}
            properties={properties}
            nodeLabel={node?.label}
          />
        );
      }
      if (isNodeTipEvent(tipType, e) && e.node.type === 'super_node') {
        // TODO: Can we can sub node errors propagated up?
        return '父节点';
      }
      return null;
    };

    if (readOnly) {
      return (
        <Container className="pipeline-read-only" ref={blockingRef}>
          <IntlProvider locale="en">
            <CommonCanvas
              canvasController={controller.current}
              contextMenuHandler={() => {}}
              editActionHandler={() => {
                controller.current.setPipelineFlow(pipeline);
                controller.current.resetStyles();
              }}
              toolbarConfig={[]}
              config={{
                enableInternalObjectModel: false,
                emptyCanvasContent: children,
                enablePaletteLayout: 'None',
                enableNodeFormatType: 'Horizontal',
                enableToolbarLayout: 'None',
                enableNodeLayout: {
                  bodyPath: READ_ONLY_NODE_SVG_PATH,
                  selectionPath: READ_ONLY_NODE_SVG_PATH,
                  dropShadow: false
                }
              }}
            />
          </IntlProvider>
        </Container>
      );
    }

    const selectedNodes = controller.current.idsToNodes(selectedNodeIDs ?? []);
    const upstreamNodes = selectedNodeIDs?.[0]
      ? controller.current.getUpstreamNodes(selectedNodeIDs[0])
      : [];

    // 有默认的应用
    if (pipeline?.pipelines?.[0]?.app_data?.properties?.applicationId) {
      // 1. 先查询是否是有效的应用标识，在查出来的
    }
    const panelTabs = [
      {
        id: 'pipeline-properties',
        label: '管道属性',
        title: '编辑管道属性',
        icon: theme.overrides?.pipelineIcon,
        content: (
          <PipelinePropertiesPanel
            data={pipeline?.pipelines?.[0]?.app_data?.properties}
            schema={pipelineProperties}
            onChange={handlePipelinePropertiesChange}
            handleUpdateNodeProperties={handleUpdateNodeProperties}
          />
        )
      },
      {
        id: 'properties',
        label: '节点属性',
        title: '编辑节点属性',
        icon: theme.overrides?.propertiesIcon,
        content: (
          <NodeProperties
            selectedNodes={selectedNodes}
            nodes={controller.current.getAllPaletteNodes()}
            upstreamNodes={upstreamNodes}
            onFileRequested={onFileRequested}
            onChange={handlePropertiesChange}
            handleAfterSelectFileUploadFile={handleAfterSelectFileUploadFile}
          />
        )
      }
    ];

    return (
      <Container ref={blockingRef}>
        <IntlProvider locale="en">
          <SplitPanelLayout
            left={
              <CommonCanvas
                canvasController={controller.current}
                contextMenuHandler={handleContextMenu}
                clickActionHandler={handleClickAction}
                beforeEditActionHandler={handleBeforeEditAction}
                editActionHandler={handleEditAction}
                selectionChangeHandler={handleSelectionChange}
                tipHandler={handleTooltip}
                toolbarConfig={toolbar ?? []}
                config={{
                  enableInternalObjectModel: true,
                  enableMarkdownInComments: true,
                  emptyCanvasContent: children,
                  enablePaletteLayout: leftPalette ? 'Flyout' : 'None', // 'Flyout', 'None', 'Modal'
                  enableNodeFormatType: 'Horizontal',
                  enableToolbarLayout: toolbar === undefined ? 'None' : 'Top',
                  enableNodeLayout: {
                    imagePosX: 10 + 2.5,
                    imagePosY: 0,
                    imageWidth: 16,
                    imageHeight: 35,
                    labelPosX: 32 + 2.5,
                    labelMaxWidth: 118 - 5,
                    labelHeight: 25,
                    defaultNodeHeight: 40,
                    defaultNodeWidth: 200,
                    inputPortLeftPosY: 17.5,
                    outputPortRightPosY: 17.5,
                    dropShadow: false,
                    labelPosY: 12 - 3
                  }
                }}
                notificationConfig={{ enable: false }}
                contextMenuConfig={{
                  enableCreateSupernodeNonContiguous: true,
                  defaultMenuEntries: {
                    saveToPalette: false,
                    createSupernode: true
                  }
                }}
                keyboardConfig={
                  nativeKeyboardActions
                    ? {
                        actions: {
                          undo: false,
                          redo: false,
                          cutToClipboard: false,
                          copyToClipboard: false,
                          pasteFromClipboard: false
                        }
                      }
                    : undefined
                }
              />
            }
            right={
              <TabbedPanelLayout
                currentTab={currentTab}
                onTabClick={id => {
                  setCurrentTab(id);
                  onAction?.({ type: 'openPanel' });
                  setPanelOpen(true);
                }}
                tabs={panelTabs}
                collapsed={panelOpen === false}
                showCloseButton={toolbar === undefined}
                onClose={() => {
                  onAction?.({ type: 'closePanel' });
                  setPanelOpen(false);
                }}
              />
            }
            mode={
              panelOpen
                ? 'open'
                : toolbar === undefined
                ? 'collapsed'
                : 'closed'
            }
          />
        </IntlProvider>
      </Container>
    );
  }
);

const ThemedPipelineEditor = forwardRef((props: Props, ref) => {
  return (
    <InternalThemeProvider>
      <PipelineEditor {...props} ref={ref} />
    </InternalThemeProvider>
  );
});

export default ThemedPipelineEditor;
