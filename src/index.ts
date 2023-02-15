import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the redevelop-elyra extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'redevelop-elyra:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension redevelop-elyra is activated!');
  }
};

export default plugin;
