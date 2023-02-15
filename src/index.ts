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

import activatePipeline from './pipeline';

/**
 * Initialization data for the redevelop-elyra extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'redevelop-elyra:plugin',
  autoStart: true,
  requires: [
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
    console.log('JupyterLab extension redevelop-elyra is activated!');
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
