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

import { PipelineEditor, ThemeProvider } from '@src/app/base-pipeline-editor';
import { validate } from '@elyra/pipeline-services';
// import { ContentParser } from '../services';
import {
  IconUtil,
  clearPipelineIcon,
  exportPipelineIcon,
  pipelineIcon,
  savePipelineIcon,
  showBrowseFileDialog,
  Dropzone,
  RequestErrors,
  showFormDialog
} from '@src/app/ui-components';
import { ILabShell } from '@jupyterlab/application';
import { Dialog, ReactWidget, showDialog } from '@jupyterlab/apputils';
import { PathExt } from '@jupyterlab/coreutils';
import {
  DocumentRegistry,
  ABCWidgetFactory,
  DocumentWidget,
  Context
} from '@jupyterlab/docregistry';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

import 'carbon-components/css/carbon-components.min.css';

import { toArray } from '@lumino/algorithm';
import { IDragEvent } from '@lumino/dragdrop';
import { Signal } from '@lumino/signaling';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  EmptyGenericPipeline,
  EmptyPlatformSpecificPipeline
} from './EmptyPipelineContent';

import { PipelineService } from './PipelineService';

import { theme } from './theme';

import { deleteNodeImage, attachNodeImage } from './node-image-transform';

import { PipelineEnum } from '@src/app/enums';
import { usePalette } from '@src/app/hooks/pipeline-hooks';
import { onBeforeAddNode_GetOp } from '@src/app/hooks/addNode';
import { onAfterSelectFile_UploadFile } from '@src/app/hooks/selectFile';
import { onAfterSelectApp } from '@src/app/hooks/editPipelineProperties';
import { onUpdateNodeStatus } from '@src/app/hooks/updateNodeStatus';

import Utils from '@src/app/util';

const PIPELINE_CLASS = 'elyra-PipelineEditor';

export const commandIDs = {
  openPipelineEditor: 'pipeline-editor:open',
  openMetadata: 'elyra-metadata:open',
  openDocManager: 'docmanager:open',
  newDocManager: 'docmanager:new-untitled',
  saveDocManager: 'docmanager:save',
  submitScript: 'script-editor:submit',
  submitNotebook: 'notebook:submit',
  addFileToPipeline: 'pipeline-editor:add-node',
  refreshPalette: 'pipeline-editor:refresh-palette',
  openViewer: 'elyra-code-viewer:open'
};

const getAllPaletteNodes = (palette: any): any[] => {
  if (palette.categories === undefined) {
    return [];
  }

  const nodes = [];
  for (const c of palette.categories) {
    if (c.node_types) {
      nodes.push(...c.node_types);
    }
  }

  return nodes;
};

class PipelineEditorWidget extends ReactWidget {
  browserFactory: IFileBrowserFactory;
  shell: ILabShell;
  commands: any;
  addFileToPipelineSignal: Signal<this, any>;
  refreshPaletteSignal: Signal<this, any>;
  context: Context;
  settings: ISettingRegistry.ISettings;

  constructor(options: any) {
    super(options);
    this.browserFactory = options.browserFactory;
    this.shell = options.shell;
    this.commands = options.commands;
    this.addFileToPipelineSignal = options.addFileToPipelineSignal;
    this.refreshPaletteSignal = options.refreshPaletteSignal;
    this.context = options.context;
    this.settings = options.settings;
  }

  // onUpdateRequest(prevProps: any) {
  //   console.log(this, prevProps, 'componentDidUpdate');
  // }

  render(): any {
    console.log(
      '==渲染编辑器（聚焦 Pipeline Editor 标签页会重新渲染编辑器）=='
    );
    return (
      <PipelineWrapper
        context={this.context}
        browserFactory={this.browserFactory}
        shell={this.shell}
        commands={this.commands}
        addFileToPipelineSignal={this.addFileToPipelineSignal}
        refreshPaletteSignal={this.refreshPaletteSignal}
        widgetId={this.parent?.id}
        settings={this.settings}
      />
    );
  }
}

interface IProps {
  context: DocumentRegistry.Context;
  browserFactory: IFileBrowserFactory;
  shell: ILabShell;
  commands: any;
  addFileToPipelineSignal: Signal<PipelineEditorWidget, any>;
  refreshPaletteSignal: Signal<PipelineEditorWidget, any>;
  settings?: ISettingRegistry.ISettings;
  widgetId?: string;
}

const PipelineWrapper: React.FC<IProps> = ({
  context,
  browserFactory,
  shell,
  commands,
  addFileToPipelineSignal,
  refreshPaletteSignal,
  settings,
  widgetId
}) => {
  console.log('==编辑器初始化==');

  const ref = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [pipeline, setPipeline] = useState<any>(null);
  const [panelOpen, setPanelOpen] = React.useState(false);

  const type: string = 'APACHE_AIRFLOW';

  const doubleClickToOpenProperties =
    settings?.composite['doubleClickToOpenProperties'] ?? true;

  const runtimeDisplayName = type;

  const {
    data: palette, // 编辑器面板参数，左侧是palette.catagories, 右侧是palette.pipelineProperties
    error: paletteError,
    mutate: mutatePalette
  } = usePalette(type);

  // 自动展开左侧面板节点目录
  useEffect(() => {
    if (!palette) return;
    setTimeout(() => {
      const btns = document.querySelectorAll(
        '.bx--accordion__item > button[aria-expanded=false]'
      );
      btns.forEach((btn: any) => btn.click());
    }, 1500);
  }, [palette]);

  useEffect(() => {
    const handleMutateSignal = (): void => {
      mutatePalette();
    };
    refreshPaletteSignal.connect(handleMutateSignal);
    return (): void => {
      refreshPaletteSignal.disconnect(handleMutateSignal);
    };
  }, [refreshPaletteSignal, mutatePalette]);

  useEffect(() => {
    if (paletteError) {
      RequestErrors.serverError(paletteError);
    }
  }, [paletteError]);

  const contextRef = useRef(context);

  useEffect(() => {
    const currentContext = contextRef.current;
    const changeHandler = (): void => {
      console.log('==监听到 pipeline 数据被改变==');
      const pipelineJson: any = currentContext.model.toJSON();
      attachNodeImage(pipelineJson);
      setPipeline(pipelineJson);
      setLoading(false);
    };
    currentContext.ready.then(changeHandler);
    currentContext.model.contentChanged.connect(changeHandler);
    return (): void => {
      currentContext.model.contentChanged.disconnect(changeHandler);
    };
  }, []);

  const onChange = useCallback((pipelineJson: any): void => {
    console.log('==改变 Pipeline 数据，会重新设置画布的 pipeline 数据==');
    pipelineJson = Utils.removeNullValues(pipelineJson);
    if (contextRef.current.isReady) {
      deleteNodeImage(pipelineJson);
      contextRef.current.model.fromString(
        JSON.stringify(pipelineJson, null, 2)
      );
    }
  }, []);

  const isDialogAlreadyShowing = useRef(false);
  const onError = useCallback(
    (error?: Error): void => {
      if (isDialogAlreadyShowing.current) {
        return; // bail, we are already showing a dialog.
      }
      isDialogAlreadyShowing.current = true;
      showDialog({
        title: '加载 pipeline 文件失败!',
        body: <p> {error?.message || ''} </p>,
        buttons: [Dialog.okButton()]
      }).then(() => {
        isDialogAlreadyShowing.current = false;
        shell.currentWidget?.close();
      });
    },
    [shell.currentWidget]
  );

  const onFileRequested = async (args: any): Promise<string[] | undefined> => {
    const filename = PipelineService.getWorkspaceRelativeNodePath(
      contextRef.current.path,
      args.filename ?? ''
    );

    const res = await showBrowseFileDialog(
      browserFactory.defaultBrowser.model.manager,
      {
        startPath: PathExt.dirname(filename),
        filter: (model: any): boolean => {
          if (!model) return false;
          if (args.filters?.File === undefined) return true;

          const { path, type } = model;
          if (type === 'directory') return true;

          const ext = PathExt.extname(path);
          return args.filters.File.includes(ext);
        }
      }
    );

    if (res.button.accept && res.value.length) {
      const file = PipelineService.getPipelineRelativeNodePath(
        contextRef.current.path,
        res.value[0].path
      );

      return [file];
    }
  };

  /**
   * 未设置双击打开节点属性时，双击打开文件。
   */
  const onDoubleClick = (data: any): void => {
    console.log('==双击节点打开文件==');
    for (let i = 0; i < data.selectedObjectIds.length; i++) {
      const node = pipeline.pipelines[0].nodes.find(
        (node: any) => node.id === data.selectedObjectIds[i]
      );
      const nodeDef = getAllPaletteNodes(palette).find(n => n.op === node?.op);
      const filenameRef = nodeDef?.app_data?.parameter_refs?.['filehandler'];
      if (!filenameRef) {
        console.warn(
          '该节点没有文件引用字段: parameter_refs.filehandler ，节点属性表单需要使用该字段！'
        );
        return;
      }
      if (!node?.app_data?.component_parameters?.[filenameRef]) {
        console.warn('未设置文件路径，无法打开文件！');
        return;
      }
      // 打开文件
      commands.execute(commandIDs.openDocManager, {
        path: PipelineService.getWorkspaceRelativeNodePath(
          contextRef.current.path,
          node.app_data.component_parameters[filenameRef]
        )
      });
    }
  };

  const timerRef = useRef<number>();

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubmission = useCallback(
    async (actionType: 'run' | 'submit'): Promise<void> => {
      const pipelineJson: any = context.model.toJSON();
      // Check that all nodes are valid
      const errorMessages = validate(
        JSON.stringify(pipelineJson),
        getAllPaletteNodes(palette),
        palette.properties
      );
      if (errorMessages && errorMessages.length > 0) {
        const chMsgType = {
          run: '运行',
          submit: '提交'
        };
        let msgs = [];
        for (const error of errorMessages) {
          let msg = error.message;
          if (msg.indexOf('circular reference') > -1) msg = 'DAG 图存在环路.';
          msgs.push(msg);
        }
        toast.error(
          `${chMsgType[actionType]}失败:\n\n ${Array.from(new Set(msgs))
            .join('\n')
            .replace(/The property/g, '属性')
            .replace(/on node/g, '在节点')
            .replace(/is required/g, '上是必填的')}`
        );
        return;
      }

      if (contextRef.current.model.dirty) {
        const dialogResult = await showDialog({
          title: '此管道包含未保存的更改。要提交管道，需要保存更改？',
          buttons: [
            Dialog.cancelButton({ label: '取消' }),
            Dialog.okButton({ label: '保存 & 提交' })
          ]
        });
        if (dialogResult.button && dialogResult.button.accept === true) {
          await contextRef.current.save();
        } else {
          // Don't proceed if cancel button pressed
          return;
        }
      }

      timerRef.current = onUpdateNodeStatus(
        ref?.current.controller.current,
        ''
      );

      let title =
        type !== undefined
          ? `${actionType} pipeline for ${runtimeDisplayName}`
          : `${actionType} pipeline`;

      // Capitalize
      title = title.charAt(0).toUpperCase() + title.slice(1);

      let dialogOptions: Partial<Dialog.IOptions<any>>;
      switch (actionType) {
        case 'run':
          dialogOptions = {
            title,
            body: '是否确认单次运行？',
            buttons: [
              Dialog.cancelButton({ label: '取消' }),
              Dialog.okButton({ label: '确定' })
            ],
            defaultButton: 1,
            focusNodeSelector: '#pipeline_name'
          };
          break;
        case 'submit':
          dialogOptions = {
            title,
            body: '是否确认提交',
            buttons: [
              Dialog.cancelButton({ label: '取消' }),
              Dialog.okButton({ label: '确定' })
            ],
            defaultButton: 1,
            focusNodeSelector: '#runtime_config'
          };
          break;
      }

      const dialogResult = await showFormDialog(dialogOptions);

      if (dialogResult.value === null) {
        // When Cancel is clicked on the dialog, just return
        return;
      }
    },
    [context.model, palette, runtimeDisplayName, type, shell]
  );

  const handleClearPipeline = useCallback(async (data: any): Promise<any> => {
    return showDialog({
      title: '清除 Pipeline',
      body: '是否确实要清除 pipeline ?',
      buttons: [
        Dialog.cancelButton({ label: '取消' }),
        Dialog.okButton({ label: '全部清除' }),
        Dialog.okButton({ label: '清除画布' })
      ]
    }).then(result => {
      if (result.button.accept) {
        const newPipeline: any = contextRef.current.model.toJSON();
        if (newPipeline?.pipelines?.[0]?.nodes?.length > 0) {
          newPipeline.pipelines[0].nodes = [];
        }
        // remove supernode pipelines
        newPipeline.pipelines = [newPipeline.pipelines[0]];
        // only clear pipeline properties when "Clear All" is selected
        if (result.button.label === 'Clear All') {
          const pipelineProperties =
            newPipeline?.pipelines?.[0]?.app_data?.properties;
          if (pipelineProperties) {
            // Remove all fields of pipeline properties except for the name/runtime (readonly)
            newPipeline.pipelines[0].app_data.properties = {
              name: pipelineProperties.name,
              runtime: pipelineProperties.runtime
            };
          }
        }
        contextRef.current.model.fromJSON(newPipeline);
      }
    });
  }, []);

  const onAction = useCallback(
    (args: { type: string; payload?: any }) => {
      switch (args.type) {
        case 'save':
          contextRef.current.save();
          break;
        case 'run':
        case 'submit':
          handleSubmission(args.type);
          break;
        case 'clear':
          handleClearPipeline(args.payload);
          break;
        case 'toggleOpenPanel':
          setPanelOpen(!panelOpen);
          break;
        case 'properties':
          setPanelOpen(true);
          break;
        case 'openFile':
          commands.execute(commandIDs.openDocManager, {
            path: PipelineService.getWorkspaceRelativeNodePath(
              contextRef.current.path,
              args.payload
            ),
            readOnly: true
          });
          break;
        default:
          break;
      }
    },
    [handleSubmission, handleClearPipeline, panelOpen, shell, commands]
  );

  const toolbar = {
    leftBar: [
      {
        action: 'run',
        label: '运行',
        enable: true
      },
      {
        action: 'submit',
        label: '提交',
        enable: true,
        iconEnabled: IconUtil.encode(exportPipelineIcon),
        iconDisabled: IconUtil.encode(exportPipelineIcon)
      },
      {
        action: 'save',
        label: '保存',
        enable: true,
        iconEnabled: IconUtil.encode(savePipelineIcon),
        iconDisabled: IconUtil.encode(savePipelineIcon)
      },
      {
        action: 'clear',
        label: '清除',
        enable: true,
        iconEnabled: IconUtil.encode(clearPipelineIcon),
        iconDisabled: IconUtil.encode(clearPipelineIcon)
      },
      { action: 'undo', label: '撤销' },
      { action: 'redo', label: '还原' },
      { action: 'cut', label: '剪切' },
      { action: 'copy', label: '复制' },
      { action: 'paste', label: '粘贴' },
      { action: 'createAutoComment', label: '添加注释', enable: true },
      { action: 'deleteSelectedObjects', label: '删除' },
      {
        action: 'arrangeHorizontally',
        label: '水平排列',
        enable: true
      },
      {
        action: 'arrangeVertically',
        label: '垂直排列',
        enable: true
      }
    ],
    rightBar: [
      {
        action: '',
        label: `运行环境: ${runtimeDisplayName}`,
        incLabelWithIcon: 'before',
        enable: false,
        kind: 'tertiary'
        // TODO: re-add icon
        // iconEnabled: IconUtil.encode(ICON_MAP[type ?? ''] ?? pipelineIcon)
      },
      {
        action: 'toggleOpenPanel',
        label: panelOpen ? '关闭面板' : '打开面板',
        enable: true,
        iconTypeOverride: panelOpen ? 'paletteOpen' : 'paletteClose'
      }
    ]
  };

  const [defaultPosition, setDefaultPosition] = useState(10);

  const handleBeforeAddNodeGetOp = useCallback(
    (op?: string) => onBeforeAddNode_GetOp(type as any, op),
    [type]
  );

  const handleAfterSelectFileUploadFile = useCallback(
    (paths: string[]) =>
      onAfterSelectFile_UploadFile(
        type as any,
        browserFactory.defaultBrowser,
        paths
      ),
    [type]
  );

  const handleUpdateNodeProperties = useCallback(
    (o: { type: string; applicationId: number }) => {
      return onAfterSelectApp({
        ...o,
        controller: ref?.current.controller.current
      });
    },
    [type]
  );

  const handleAddFileToPipeline = useCallback(
    async (location?: { x: number; y: number }) => {
      const fileBrowser = browserFactory.defaultBrowser;
      // Only add file to pipeline if it is currently in focus
      if (shell.currentWidget?.id !== widgetId) {
        return;
      }

      let position = 0;
      const missingXY = !location;

      // if either x or y is undefined use the default coordinates
      if (missingXY) {
        position = defaultPosition;
        location = {
          x: 75,
          y: 85
        };
      }

      const selectedItems = toArray(fileBrowser.selectedItems()).filter(item =>
        PipelineService.isSupportedNode(item, type)
      );

      const fileTipMap: { [k: string]: string } = {
        undefined: 'Notebook、Python 和 R',
        KUBEFLOW_PIPELINES: 'Notebook、Python 和 R',
        APACHE_AIRFLOW: '.py 和 .jar'
      };
      if (!selectedItems[0]) {
        return showDialog({
          title: '不支持的文件',
          body: `只支持将 ${fileTipMap[type as any]} 文件添加${
            type ? '通用' : type
          }导管道编辑器中。`,
          buttons: [Dialog.okButton({ label: '确认' })]
        });
      }

      function addFile(item: any, op?: string) {
        item.op = op;
        item.path = PipelineService.getPipelineRelativeNodePath(
          contextRef.current.path,
          item.path
        );
        item.x = (location?.x ?? 0) + position;
        item.y = (location?.y ?? 0) + position;

        const success = ref.current?.addFile({
          nodeTemplate: {
            op: item.op
          },
          offsetX: item.x,
          offsetY: item.y,
          path: item.path,
          mainApplicationFile: item.mainApplicationFile
        });

        if (success) {
          position += 20;
        } else {
          console.warn('添加文件失败！');
          // handle error
        }
      }

      if (type === PipelineEnum.APACHE_AIRFLOW) {
        const op = await handleBeforeAddNodeGetOp();
        const paths = selectedItems.map((item: any) =>
          PipelineService.getPipelineRelativeNodePath(
            contextRef.current.path,
            item.path
          )
        );
        const { paths: s3Paths } = await handleAfterSelectFileUploadFile(paths);
        selectedItems.map((item: any, index): void => {
          item.mainApplicationFile = s3Paths[index];
          addFile(item, op);
        });
      } else {
        selectedItems.map((item: any): void => {
          addFile(item, PipelineService.getNodeType(item.path));
        });
      }

      // update position if the default coordinates were used
      if (missingXY) setDefaultPosition(position);
    },
    [browserFactory.defaultBrowser, defaultPosition, shell, widgetId, type]
  );

  const handleDrop = async (e: IDragEvent): Promise<void> => {
    console.log('handleDrop', e);
    handleAddFileToPipeline({ x: e.offsetX, y: e.offsetY });
  };

  useEffect(() => {
    const handleSignal = (): void => {
      handleAddFileToPipeline();
    };
    addFileToPipelineSignal.connect(handleSignal);
    return (): void => {
      addFileToPipelineSignal.disconnect(handleSignal);
    };
  }, [addFileToPipelineSignal, handleAddFileToPipeline]);

  if (loading || palette === undefined) {
    return <div className="elyra-loader"></div>;
  }

  const handleOpenSettings = (): void => {
    commands.execute('settingeditor:open', { query: 'Pipeline Editor' });
  };

  return (
    <div
      id="pipeline-eidtor-wrapper"
      style={{ position: 'relative', height: '100%' }}
    >
      <ThemeProvider theme={theme}>
        <ToastContainer
          position="bottom-center"
          autoClose={30000}
          hideProgressBar
          closeOnClick={false}
          className="elyra-PipelineEditor-toast"
          draggable={false}
          theme="colored"
        />
        <Dropzone onDrop={handleDrop}>
          <PipelineEditor
            ref={ref}
            palette={palette}
            pipelineProperties={palette.properties}
            toolbar={toolbar}
            pipeline={pipeline}
            onAction={onAction}
            onChange={onChange}
            onDoubleClickNode={
              doubleClickToOpenProperties ? undefined : onDoubleClick
            }
            onError={onError}
            onFileRequested={onFileRequested}
            leftPalette={true}
            handleBeforeAddNodeGetOp={handleBeforeAddNodeGetOp}
            handleAfterSelectFileUploadFile={handleAfterSelectFileUploadFile}
            handleUpdateNodeProperties={handleUpdateNodeProperties}
          >
            {type === undefined ? (
              <EmptyGenericPipeline onOpenSettings={handleOpenSettings} />
            ) : (
              <EmptyPlatformSpecificPipeline
                onOpenSettings={handleOpenSettings}
              />
            )}
          </PipelineEditor>
        </Dropzone>
      </ThemeProvider>
    </div>
  );
};

export class PipelineEditorFactory extends ABCWidgetFactory<DocumentWidget> {
  browserFactory: IFileBrowserFactory;
  shell: ILabShell;
  commands: any;
  addFileToPipelineSignal: Signal<this, any>;
  refreshPaletteSignal: Signal<this, any>;
  settings: ISettingRegistry.ISettings;

  constructor(options: any) {
    super(options);
    this.browserFactory = options.browserFactory;
    this.shell = options.shell;
    this.commands = options.commands;
    this.addFileToPipelineSignal = new Signal<this, any>(this);
    this.refreshPaletteSignal = new Signal<this, any>(this);
    this.settings = options.settings;
  }

  protected createNewWidget(context: DocumentRegistry.Context): DocumentWidget {
    // Creates a blank widget with a DocumentWidget wrapper
    const props = {
      shell: this.shell,
      commands: this.commands,
      browserFactory: this.browserFactory,
      context: context,
      addFileToPipelineSignal: this.addFileToPipelineSignal,
      refreshPaletteSignal: this.refreshPaletteSignal,
      settings: this.settings
    };

    console.log(
      '==创建新的编辑器（打开 Pipeline Editor 标签页会新建编辑器）=='
    );
    const content = new PipelineEditorWidget(props);

    const widget = new DocumentWidget({ content, context });
    widget.addClass(PIPELINE_CLASS);
    widget.title.icon = pipelineIcon;
    return widget;
  }
}
