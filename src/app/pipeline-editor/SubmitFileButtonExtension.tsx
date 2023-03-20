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

import { /* RequestErrors, */ showFormDialog } from '@src/app/ui-components';
import { Dialog, showDialog, ToolbarButton } from '@jupyterlab/apputils';
import { PathExt } from '@jupyterlab/coreutils';
import { DocumentRegistry, DocumentWidget } from '@jupyterlab/docregistry';
import { IDisposable } from '@lumino/disposable';

// import { PipelineService } from './PipelineService';
// import { getConfigDetails } from './runtime-utils';
// import Utils from './utils';

/**
 * Submit file button extension
 *  - Attach button to editor toolbar and launch a dialog requesting
 *  information about the remote location to where submit the file
 *  for execution
 */

export class SubmitFileButtonExtension<
  T extends DocumentWidget,
  U extends DocumentRegistry.IModel
> implements DocumentRegistry.IWidgetExtension<T, U>
{
  showWidget = async (document: T): Promise<void> => {
    const { context } = document;
    if (context.model.dirty) {
      const dialogResult = await showDialog({
        title: '该文件包含未保存的更改。要将文件作为管道运行，需要保存更改',
        buttons: [
          Dialog.cancelButton({ label: '取消' }),
          Dialog.okButton({ label: '保存 & 提交' })
        ]
      });
      if (dialogResult.button.accept === false) {
        return;
      }
      await context.save();
    }

    let dependencyFileExtension = PathExt.extname(context.path);
    if (dependencyFileExtension === '.ipynb') {
      dependencyFileExtension = '.py';
    }

    const dialogOptions = {
      title: '将文件作为 pipeline 运行',
      buttons: [
        Dialog.cancelButton({ label: '取消' }),
        Dialog.okButton({ label: '确定' })
      ]
    };

    const dialogResult = await showFormDialog(dialogOptions);

    if (dialogResult.value === null) {
      // When Cancel is clicked on the dialog, just return
      return;
    }

    // const {
    //   runtime_config,
    //   framework,
    //   cpu,
    //   gpu,
    //   memory,
    //   dependency_include,
    //   dependencies,
    //   ...envObject
    // } = dialogResult.value;

    // const configDetails = getConfigDetails({} as any, runtime_config);

    // prepare file submission details
    // const pipeline = Utils.generateSingleFilePipeline(
    //   context.path,
    //   configDetails,
    //   framework,
    //   dependency_include ? dependencies.split(',') : undefined,
    //   envObject,
    //   cpu,
    //   gpu,
    //   memory
    // );
  };

  createNew(editor: T): IDisposable {
    // Create the toolbar button
    const submitFileButton = new ToolbarButton({
      label: 'Run as Pipeline',
      onClick: (): any => this.showWidget(editor),
      tooltip: 'Run file as batch'
    });

    // Add the toolbar button to the editor
    editor.toolbar.insertItem(10, 'submitFile', submitFileButton);

    // The ToolbarButton class implements `IDisposable`, so the
    // button *is* the extension for the purposes of this method.
    return submitFileButton;
  }
}
