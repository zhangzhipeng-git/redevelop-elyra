/*
 * Copyright 2018-2022 Redevelop-Elyra Authors
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
// import { validate } from '@elyra/pipeline-services';
// import { ContentParser } from '../services';
import {
  IconUtil,
  clearPipelineIcon,
  exportPipelineIcon,
  pipelineIcon,
  savePipelineIcon,
  showBrowseFileDialog,
  Dropzone,
  showFormDialog,
  pauseIcon
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

import { PipelineEnum } from '@src/app/enums';
import {
  onBeforeAddNode_GetOp,
  onPasteValidateNodeProperties
} from '@src/app/hooks/addNode';
import { onRemoveFile, onUploadFile } from '@src/app/hooks/selectFile';
import { onAfterSelectApp } from '@src/app/hooks/editPipelineProperties';
import { onUpdateNodeStatus } from '@src/app/hooks/updateNodeStatus';
import { onReadyOrRefresh } from '@src/app/hooks/openPipelineEditor';
import {
  getTaskIdByElyraNodeId,
  onChangePipeline,
  onRenderPipeline,
  onRunOrSubmit,
  validatePipeline
} from '@src/app/hooks/handlePipeline';

import { StyleProvider } from '@ant-design/cssinjs';

import Utils from '@src/app/util';
import { useMask } from '../ui-components/loading';

const PIPELINE_CLASS = 'redevelop-elyra-PipelineEditor';

export const commandIDs = {
  openPipelineEditor: 'redevelop-pipeline-editor:open',
  openMetadata: 'redevelop-elyra-metadata:open',
  openDocManager: 'docmanager:open',
  newDocManager: 'docmanager:new-untitled',
  saveDocManager: 'docmanager:save',
  submitScript: 'script-editor:submit',
  submitNotebook: 'notebook:submit',
  addFileToPipeline: 'redevelop-pipeline-editor:add-node',
  refreshPalette: 'redevelop-pipeline-editor:refresh-palette',
  openViewer: 'redevelop-elyra-code-viewer:open'
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

  render(): any {
    return (
      <StyleProvider hashPriority="high">
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
      </StyleProvider>
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
  const ref = useRef<any>(null);
  const palette = useRef<any>(null);
  const contextRef = useRef(context);
  const defaultPosition = useRef(10);
  const runRes = useRef<any>(null);
  const editorWrapRef = useRef<any>();

  const [loading, setLoading] = useState(true);
  const [pipeline, setPipeline] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const { mask, unmask } = useMask();

  const uuid = useRef(Utils.timeUUID());
  const type: string = 'APACHE_AIRFLOW';
  const doubleClickToOpenProperties =
    settings?.composite['doubleClickToOpenProperties'] ?? true;
  const runtimeDisplayName = type;

  // 自动展开左侧面板节点目录
  useEffect(() => {
    if (!palette.current) return;
    setTimeout(() => {
      const btns = document.querySelectorAll(
        '.bx--accordion__item > button[aria-expanded=false]'
      );
      btns.forEach((btn: any) => btn.click());
    }, 2000);
  }, []);

  useEffect((): any => {
    const handleMutateSignal = async () =>
      (palette.current = await onReadyOrRefresh(contextRef.current, type));

    refreshPaletteSignal.connect(handleMutateSignal);
    return () => refreshPaletteSignal.disconnect(handleMutateSignal);
  }, [refreshPaletteSignal]);

  useEffect((): any => {
    const currentContext = contextRef.current;
    const changeHandler = (): void => {
      const pipelineJson = currentContext.model.toJSON();
      onRenderPipeline(pipelineJson);
      setPipeline(pipelineJson);
      setLoading(false);
    };
    currentContext.ready.then(async () => {
      palette.current = await onReadyOrRefresh(currentContext, type);
      changeHandler();
    });
    currentContext.model.contentChanged.connect(changeHandler);
    return () => {
      currentContext.model.contentChanged.disconnect(changeHandler);
    };
  }, []);

  const onChange = useCallback((pipelineJson: any): void => {
    pipelineJson = Utils.removeNullValues(pipelineJson);
    if (contextRef.current.isReady) {
      onChangePipeline(pipelineJson);
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

  const onFileRequested = useCallback(
    async (args: any): Promise<string[] | undefined> => {
      const filename = PipelineService.getWorkspaceRelativeNodePath(
        contextRef.current.path,
        args.filename ?? ''
      );

      const res = await showBrowseFileDialog(
        browserFactory.defaultBrowser.model.manager,
        {
          multiselect: args.canSelectMany,
          startPath: PathExt.dirname(filename),
          filter: (model: any): boolean => {
            if (!model) return false;
            if (args.filters?.File === undefined) return true;

            const { path, type } = model;
            if (type === 'directory') return true;

            const ext = PathExt.extname(path);
            // 所有文件
            if (args.filters.File[0] === '*') return true;
            // 根据类型过滤文件
            return args.filters.File.includes(ext);
          }
        }
      );

      if (res.button.accept && res.value.length) {
        let files: string[] = [];
        res.value.forEach((item: any) => {
          files.push(
            PipelineService.getPipelineRelativeNodePath(
              contextRef.current.path,
              item.path
            )
          );
        });
        return files;
      }
    },
    []
  );

  /**
   * 未设置双击打开节点属性时，双击打开文件。
   */
  const onDoubleClick = useCallback((data: any): void => {
    for (let i = 0; i < data.selectedObjectIds.length; i++) {
      const node = pipeline.pipelines[0].nodes.find(
        (node: any) => node.id === data.selectedObjectIds[i]
      );
      const nodeDef = getAllPaletteNodes(palette.current).find(
        n => n.op === node?.op
      );
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
  }, []);

  useEffect(() => {
    return () => {
      pausePipeline();
    };
  }, []);

  const handleSubmission = useCallback(
    async (actionType: 'run' | 'submit'): Promise<void> => {
      const pipelineJson: any = context.model.toJSON();
      const controllerPalette = ref.current?.controller?.current?.getPalette();
      const errorMessages = validatePipeline(pipelineJson, controllerPalette);
      const actionTypeMap = { run: '运行', submit: '提交' };
      const actionName = actionTypeMap[actionType];

      if (errorMessages && errorMessages.length > 0) {
        let msgs = errorMessages.map(({ message }: any) => message);
        toast.error(
          `${actionName}失败:\n\n ${Array.from(new Set(msgs)).join('\n')}`,
          { containerId: uuid.current, autoClose: 30000 }
        );
        return;
      }

      if (contextRef.current.model.dirty) {
        const dialogResult = await showDialog({
          title: `此pipeline包含未保存的更改，要${actionName}pipeline，需要先保存更改，是否保存？`,
          buttons: [
            Dialog.cancelButton({ label: '取消' }),
            Dialog.okButton({ label: '保存' })
          ]
        });
        if (!dialogResult.button || !dialogResult.button.accept) return;
        await contextRef.current.save();
      }

      const result = await showFormDialog({
        body: `是否确认${actionName}？`,
        buttons: [
          Dialog.cancelButton({ label: '取消' }),
          Dialog.okButton({ label: '确定' })
        ],
        defaultButton: 1
      });
      if (!result.button.accept) return;

      const isRun = actionType === 'run';
      // 重复运行会有问题，需要修改uuid
      if (isRun) pipelineJson.uuid = Utils.timeUUID();
      const newPipeline = onRunOrSubmit(pipelineJson, actionType);
      if (!newPipeline) return;

      const containerId = uuid.current;
      const runToastId = uuid.current + '_run';
      const submitToastId = uuid.current + '_submit';

      // 单次提交
      if (!isRun) {
        toast.loading(`开始提交`, { containerId, toastId: submitToastId });
        const res = await PipelineService.operator(newPipeline).catch(() =>
          toast.dismiss(submitToastId)
        );
        return toast.update(submitToastId, {
          containerId,
          type: res ? 'success' : 'error',
          render: `提交${res ? '成功' : '失败'}`,
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
          closeButton: true
        });
      }

      // 单次运行
      toast.loading(`开始运行`, { containerId, toastId: runToastId });
      setReadOnly(true);
      const res = await PipelineService.operator(newPipeline).catch(() => {
        clearTimeout(ref.current?.controller?.current?.timer);
        toast.dismiss(runToastId);
        setReadOnly(false);
      });
      if (!res) return;

      runRes.current = res;
      // 轮询节点运行状态
      onUpdateNodeStatus(
        ref?.current.controller.current,
        {
          dagId: res.dagId,
          runId: res.dagRunId
        },
        (state: boolean) => {
          toast.update(runToastId, {
            containerId,
            type: state ? 'success' : 'error',
            render: `运行${state ? '成功' : '失败'}`,
            isLoading: false,
            autoClose: 30000,
            closeButton: true,
            closeOnClick: true,
            onClose: () => setReadOnly(false)
          });
        },
        (data: any) => {
          toast.update(runToastId, { containerId, render: data });
        }
      );
    },
    []
  );

  const handleClearPipeline = useCallback(async (data: any): Promise<any> => {
    return showDialog({
      title: '清除 Pipeline',
      body: '是否确实要清除 pipeline ?',
      buttons: [
        Dialog.cancelButton({ label: '取消' }),
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

  async function pausePipeline() {
    if (!runRes.current) return;
    const { dagId, dagRunId } = runRes.current;
    await PipelineService.cancel({ dagId, dagRunId });
    const controller = ref?.current?.controller?.current ?? {};
    clearTimeout(controller.timer);
    toast.dismiss(uuid.current + '_run');
    setReadOnly(false);
  }

  const onReadOnlyAction = useCallback(async ({ type, payload }: any) => {
    if (!runRes.current) return;
    const controller = ref.current?.controller?.current ?? {};
    const { dagRunId, showTask } = controller._payload ?? {};
    const { dagId } = runRes.current;
    switch (type) {
      case 'log':
        if (!dagRunId) {
          new Dialog({
            body: '暂时没有日志',
            buttons: [Dialog.okButton({ label: '确定' })]
          }).launch();
          return;
        }
        const nodes =
          controller.getPipelineFlow?.()?.pipelines?.[0].nodes ?? [];
        const id = getTaskIdByElyraNodeId(payload, nodes);
        const task =
          runRes.current.task.find(({ taskId }: any) => taskId === id) ?? {};
        const scheduleTask =
          showTask.find(({ taskId }: any) => taskId === id) ?? {};
        const { taskId, taskReturnId } = task;
        const { tryNumber } = scheduleTask;

        mask({ selector: editorWrapRef.current });
        const res = await PipelineService.logs({
          dagId,
          dagRunId,
          taskId,
          taskReturnId,
          taskTryNumber: tryNumber
        }).catch(unmask);
        unmask();
        if (!res) return;

        new Dialog({
          title: '日志',
          body: (
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {res.replace(/\\n/g, '\r\n')}
            </div>
          ),
          buttons: [Dialog.okButton({ label: '确定' })]
        }).launch();
        break;
      case 'pause':
        pausePipeline();
        break;
      case 'submit':
        handleSubmission(type);
        break;
      default:
        break;
    }
  }, []);

  const onAction = useCallback(
    ({ type: actionType, payload }: any) => {
      switch (actionType) {
        case 'save':
          contextRef.current.save();
          break;
        case 'run':
        case 'submit':
          handleSubmission(actionType);
          break;
        case 'clear':
          handleClearPipeline(payload);
          break;
        case 'openPipelineProperties':
          setPanelOpen(true);
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
              payload
            )
          });
          break;
        case 'paste':
          onPasteValidateNodeProperties({
            type,
            payload,
            controller: ref.current?.controller?.current
          });
          break;
        default:
          break;
      }
    },
    [panelOpen, type]
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
  const readOnlyToolbar = {
    leftBar: [
      {
        action: 'pause',
        label: '暂停',
        enable: true,
        iconEnabled: IconUtil.encode(pauseIcon)
      },
      {
        action: 'submit',
        label: '提交',
        enable: true,
        iconEnabled: IconUtil.encode(exportPipelineIcon)
      }
    ],
    rightBar: [
      {
        action: '',
        label: `运行环境: ${runtimeDisplayName}`,
        incLabelWithIcon: 'before',
        enable: false,
        kind: 'tertiary'
      }
    ]
  };

  const handleBeforeAddNodeGetOp = useCallback(
    (op?: string) => onBeforeAddNode_GetOp(type as any, op),
    []
  );

  const handleAfterSelectFileUploadFile = useCallback(
    (paths: string[], prePaths = []) =>
      onUploadFile(
        type as any,
        browserFactory.defaultBrowser,
        paths,
        editorWrapRef.current,
        contextRef.current.path
      ),
    []
  );

  const handleAfterSelectFileRemoveOldFile = useCallback(
    (prePath: string) => onRemoveFile(type as any, prePath),
    []
  );

  const handleUpdateNodeProperties = useCallback(
    async (params: { type: string; applicationId: string }, key: string) => {
      switch (key) {
        case 'connId':
          return onAfterSelectApp(params, ref?.current.controller.current);
      }
    },
    []
  );

  const handleAddFileToPipeline = useCallback(
    async (location?: { x: number; y: number }) => {
      if (readOnly) return;
      const fileBrowser = browserFactory.defaultBrowser;
      // Only add file to pipeline if it is currently in focus
      if (shell.currentWidget?.id !== widgetId) {
        return;
      }

      let position = 0;
      const missingXY = !location;

      // if either x or y is undefined use the default coordinates
      if (missingXY) {
        position = defaultPosition.current;
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
      if (missingXY) defaultPosition.current = position;
    },
    []
  );

  const handleDrop = async (e: IDragEvent): Promise<void> => {
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
  }, [addFileToPipelineSignal]);

  if (loading || !palette.current) {
    return <div className="redevelop-elyra-loader"></div>;
  }

  const handleOpenSettings = (): void => {
    commands.execute('settingeditor:open', { query: 'Pipeline Editor' });
  };

  return (
    <div
      ref={editorWrapRef}
      className="redevelop-elyra-pipeline-editor"
      style={{ position: 'relative', height: '100%' }}
    >
      <ThemeProvider theme={theme}>
        <ToastContainer
          enableMultiContainer
          containerId={uuid.current}
          position="bottom-center"
          autoClose={3000}
          hideProgressBar
          closeOnClick={false}
          className="redevelop-elyra-PipelineEditor-toast"
          draggable={false}
          theme="colored"
        />
        <Dropzone onDrop={handleDrop}>
          <PipelineEditor
            ref={ref}
            palette={palette.current}
            pipelineProperties={palette.current.properties}
            toolbar={toolbar}
            readOnlyToolbar={readOnlyToolbar}
            readOnly={readOnly}
            pipeline={pipeline}
            onAction={onAction}
            onReadOnlyAction={onReadOnlyAction}
            onChange={onChange}
            onDoubleClickNode={
              doubleClickToOpenProperties ? undefined : onDoubleClick
            }
            onError={onError}
            onFileRequested={onFileRequested}
            leftPalette={true}
            handleBeforeAddNodeGetOp={handleBeforeAddNodeGetOp}
            handleUpdateNodeProperties={handleUpdateNodeProperties}
            handleAfterSelectFileUploadFile={handleAfterSelectFileUploadFile}
            handleAfterSelectFileRemoveOldFile={
              handleAfterSelectFileRemoveOldFile
            }
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

    const content = new PipelineEditorWidget(props);

    const widget = new DocumentWidget({ content, context });
    widget.addClass(PIPELINE_CLASS);
    widget.title.icon = pipelineIcon;
    return widget;
  }
}
