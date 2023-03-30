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

import { Dialog } from '@jupyterlab/apputils';

export const unknownError = (message: string): any => ({
  title: '加载 Pipeline 失败!',
  body: message,
  buttons: [Dialog.okButton({ label: '确定' })]
});

export const elyraOutOfDate = {
  title: '加载 Pipeline 失败!',
  body: `该管道对应于插件的最新版本，在插件升级之前无法使用。`,
  buttons: [Dialog.okButton({ label: '确定' })]
};

export const unsupportedVersion = {
  title: '加载 Pipeline 失败!',
  body: 'pipeline 版本无法识别。',
  buttons: [Dialog.okButton({ label: '确定' })]
};

export const pipelineOutOfDate = {
  title: '迁移 Pipeline?',
  body: (
    <p>
      该管道对应于插件的旧版本，需要做迁移，
      <br />
      虽然管道可以进一步编辑和/或提交后更新，
      <br />
      但是直到在编辑器中保存了管道，迁移才会完成。
      <br />
      <br />
      继续迁移？
    </p>
  ),
  buttons: [
    Dialog.cancelButton({ label: '取消' }),
    Dialog.okButton({ label: '确定' })
  ]
};

export const unsupportedFile = {
  title: '不支持的文件',
  body: 'Pipeline 中只能添加受支持的文件。',
  buttons: [Dialog.okButton({ label: '确定' })]
};

export const clearPipeline = {
  title: '清除 Pipeline',
  body: '你确定要清除 Pipeline 吗？',
  buttons: [
    Dialog.cancelButton({ label: '取消' }),
    Dialog.okButton({ label: '确定' })
  ]
};
