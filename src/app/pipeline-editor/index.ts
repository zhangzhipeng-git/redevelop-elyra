/**
 * pipeline
 */

import { PIPELINE_CURRENT_VERSION } from '@app/base-pipeline-editor';
import { pipelineIcon, RequestErrors } from '@app/ui-components';

import type { JupyterFrontEnd, ILayoutRestorer } from '@jupyterlab/application';
import { ICommandPalette, WidgetTracker } from '@jupyterlab/apputils';
import { DocumentWidget } from '@jupyterlab/docregistry';
import type { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import type { ILauncher } from '@jupyterlab/launcher';
import type { IMainMenu } from '@jupyterlab/mainmenu';
import type { ISettingRegistry } from '@jupyterlab/settingregistry';
import {
  addIcon,
  IRankedMenu,
  LabIcon,
  refreshIcon
} from '@jupyterlab/ui-components';

import { PipelineEditorFactory, commandIDs } from './PipelineEditorWidget';
import { PipelineService } from './PipelineService';

// import { SubmitFileButtonExtension } from './SubmitFileButtonExtension';
import getPipelineJSON from './pipeline-json';

const PIPELINE_EDITOR = 'Pipeline Editor';
const PIPELINE = 'pipeline';
const PIPELINE_EDITOR_NAMESPACE = 'redevelop-elyra-pipeline-editor-extension';
const PLUGIN_ID = 'redevelop-elyra:plugin';

/** 获取插件在 launcher 面板的菜单图标 */
const createRemoteIcon = async ({
  name,
  url
}: {
  name: string;
  url: string;
}): Promise<LabIcon> => {
  let svgstr = await PipelineService.getIcon(url);
  return new LabIcon({ name, svgstr });
};

export default async function activatePipeline(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  launcher: ILauncher,
  browserFactory: IFileBrowserFactory,
  restorer: ILayoutRestorer,
  menu: IMainMenu,
  registry: ISettingRegistry
): Promise<void> {
  console.log('==Pipeline 插件已激活==');

  // Fetch the initial state of the settings.
  const settings = await registry
    .load(PLUGIN_ID)
    .catch((error: any) => console.log(error));

  // Set up new widget Factory for .pipeline files
  // 使用 pipeline 编辑器工厂处理 .pipeline 文件
  const pipelineEditorFactory = new PipelineEditorFactory({
    name: PIPELINE_EDITOR, // 组件工厂名称
    fileTypes: [PIPELINE],
    defaultFor: [PIPELINE],
    shell: app.shell,
    commands: app.commands,
    browserFactory: browserFactory,
    serviceManager: app.serviceManager,
    settings: settings
  });

  // Add the default behavior of opening the widget for .pipeline files
  // 添加 .pipeline 文件类型
  app.docRegistry.addFileType(
    {
      name: PIPELINE,
      displayName: 'Pipeline',
      extensions: ['.pipeline'],
      icon: pipelineIcon
    },
    ['JSON']
  );

  // 将 pipeline 编辑器工厂注册到 Jupyterlab
  app.docRegistry.addWidgetFactory(pipelineEditorFactory);

  const tracker = new WidgetTracker<DocumentWidget>({
    namespace: PIPELINE_EDITOR_NAMESPACE
  });

  pipelineEditorFactory.widgetCreated.connect((sender: any, widget: any) => {
    void tracker.add(widget);

    // Notify the widget tracker if restore data needs to update
    widget.context.pathChanged.connect(() => {
      void tracker.save(widget);
    });
  });

  // Handle state restoration
  void restorer.restore(tracker, {
    command: commandIDs.openDocManager,
    args: widget => ({
      path: widget.context.path,
      factory: PIPELINE_EDITOR
    }),
    name: widget => widget.context.path
  });

  // Add command to add file to pipeline
  const addFileToPipelineCommand: string = commandIDs.addFileToPipeline;
  app.commands.addCommand(addFileToPipelineCommand, {
    label: '添加文件到 Pipeline',
    icon: addIcon,
    execute: args => {
      pipelineEditorFactory.addFileToPipelineSignal.emit(args);
    }
  });
  const refreshPaletteCommand: string = commandIDs.refreshPalette;
  app.commands.addCommand(refreshPaletteCommand, {
    label: '刷新 Pipeline 面板',
    icon: refreshIcon,
    execute: args => {
      pipelineEditorFactory.refreshPaletteSignal.emit(args);
    }
  });

  // Add an application command
  const openPipelineEditorCommand: string = commandIDs.openPipelineEditor;
  app.commands.addCommand(openPipelineEditorCommand, {
    label: (args: any) => {
      if (args.isPalette) {
        return `New ${PIPELINE_EDITOR}`;
      }
      if (args.runtimeType?.id === 'LOCAL') {
        return `Generic ${PIPELINE_EDITOR}`;
      }
      if (args.isMenu) {
        return `${args.runtimeType?.display_name} ${PIPELINE_EDITOR}`;
      }
      return PIPELINE_EDITOR;
    },
    caption: (args: any) => {
      if (args.runtimeType?.id === 'LOCAL') {
        return `Generic ${PIPELINE_EDITOR}`;
      }
      return `${args.runtimeType?.display_name} ${PIPELINE_EDITOR}`;
    },
    iconLabel: (args: any) => {
      if (args.isPalette) {
        return '';
      }
      if (args.runtimeType?.id === 'LOCAL') {
        return `Generic ${PIPELINE_EDITOR}`;
      }
      return `${args.runtimeType?.display_name} ${PIPELINE_EDITOR}`;
    },
    icon: (args: any) => {
      if (args.isPalette) {
        return undefined;
      }
      return args.runtimeType?.icon;
    },
    execute: (args: any) => {
      // Creates blank file, then opens it in a new window
      app.commands
        .execute(commandIDs.newDocManager, {
          type: 'file',
          path: browserFactory.defaultBrowser.model.path,
          ext: '.pipeline'
        })
        .then(async model => {
          const platformId = args.runtimeType?.id;
          const runtime_type = platformId === 'LOCAL' ? undefined : platformId;
          const pipelineJson = getPipelineJSON({
            version: PIPELINE_CURRENT_VERSION,
            runtime_type
          });
          const newWidget = await app.commands.execute(
            commandIDs.openDocManager,
            {
              path: model.path,
              factory: PIPELINE_EDITOR
            }
          );
          newWidget.context.ready.then(() => {
            newWidget.context.model.fromJSON(pipelineJson);
            app.commands.execute(commandIDs.saveDocManager, {
              path: model.path
            });
          });
        });
    }
  });
  // Add the command to the palette.
  palette.addItem({
    command: openPipelineEditorCommand,
    args: { isPalette: true },
    category: 'Pipeline Editor'
  });

  const types = await PipelineService.getRuntimeTypes();

  const promises = types.map(async t => {
    return {
      ...t,
      icon: await createRemoteIcon({
        name: `elyra:platform:${t.id}`,
        url: t.icon
      })
    };
  });

  const resolvedTypes = await Promise.all(promises).catch(error =>
    RequestErrors.serverError(error)
  );

  // Add the command to the launcher
  if (launcher) {
    const fileMenuItems: IRankedMenu.IItemOptions[] = [];
    for (const t of resolvedTypes as any) {
      launcher.add({
        command: openPipelineEditorCommand,
        category: PIPELINE_EDITOR,
        args: { runtimeType: t },
        rank: t.id === 'LOCAL' ? 1 : 2
      });

      fileMenuItems.push({
        command: openPipelineEditorCommand,
        args: { runtimeType: t, isMenu: true },
        rank: t.id === 'LOCAL' ? 90 : 91
      });
    }

    menu.fileMenu.newMenu.addGroup(fileMenuItems);
  }

  const supportFileSelectors = [
    '[data-file-type="notebook"]',
    // '[data-file-type="python"]',
    '[data-file-type="r"]',
    '[title*=".jar"]',
    '[title*=".py"]',
  ];

  supportFileSelectors.forEach(selector => {
    app.contextMenu.addItem({
      selector,
      command: addFileToPipelineCommand
    });
  });

  // SubmitNotebookButtonExtension initialization code
  // const notebookButtonExtension = new SubmitFileButtonExtension();
  // app.docRegistry.addWidgetExtension('Notebook', notebookButtonExtension);
  // app.contextMenu.addItem({
  //   selector: '.jp-Notebook',
  //   command: commandIDs.submitNotebook,
  //   rank: -0.5
  // });

  // // SubmitScriptButtonExtension initialization code
  // const scriptButtonExtension = new SubmitFileButtonExtension();
  // app.docRegistry.addWidgetExtension('Python Editor', scriptButtonExtension);
  // app.contextMenu.addItem({
  //   selector: '.elyra-ScriptEditor',
  //   command: commandIDs.submitScript,
  //   rank: -0.5
  // });

  // app.docRegistry.addWidgetExtension('R Editor', scriptButtonExtension);
  // app.contextMenu.addItem({
  //   selector: '.elyra-ScriptEditor',
  //   command: commandIDs.submitScript,
  //   rank: -0.5
  // });
}
