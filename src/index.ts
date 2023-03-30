import 'core-js';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { ILauncher } from '@jupyterlab/launcher';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

import userIdentify from '@src/app/user';
import activatePipeline from '@src/app/pipeline-editor';

userIdentify.then((identify: any) => {
  console.log(identify?.username, 'username');
});

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
    ISettingRegistry
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
