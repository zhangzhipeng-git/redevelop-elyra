import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer,
  ILabStatus
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { ILauncher } from '@jupyterlab/launcher';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { IEditorServices } from '@jupyterlab/codeeditor';
import { ITranslator } from '@jupyterlab/translation';
import { IFormComponentRegistry } from '@jupyterlab/ui-components';

import activatePipeline from '@src/app/pipeline-editor';

import userIdentify from '@src/app/user';

userIdentify.then((identify: any) => console.log(identify, 'user.identify'));

/**
 * Initialization data for the redevelop-elyra extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'redevelop-elyra:plugin',
  autoStart: true,
  requires: [
    // pipeline-editor
    ICommandPalette,
    ILauncher,
    IFileBrowserFactory,
    ILayoutRestorer,
    IMainMenu,
    ISettingRegistry,
    // metadata-editor
    IEditorServices,
    ILabStatus,
    IFormComponentRegistry,
    ITranslator
  ],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher,
    browserFactory: IFileBrowserFactory,
    restorer: ILayoutRestorer,
    menu: IMainMenu,
    registry: ISettingRegistry
  ) => {
    activatePipeline(
      app,
      palette,
      launcher,
      browserFactory,
      restorer,
      menu,
      registry
    );
  }
};

export default plugin;
