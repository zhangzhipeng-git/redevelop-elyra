import { PipelineEnum, Types } from '@app/enums';
import { FileBrowser } from '@jupyterlab/filebrowser';
import { RequestHandler } from '@app/services';
import Utils from '@app/util';

import { RequestErrors } from '@app/ui-components';
import { Loading } from '@app/ui-components/loading';

/**
 * 获取文件并上传
 * @param type pipeline 类型
 * @param fileBrowser 文档浏览器
 * @param paths 文件路径
 */
export async function onAfterSelectFile_UploadFile(
  type = PipelineEnum.APACHE_AIRFLOW as Types,
  fileBrowser: FileBrowser,
  paths: string[]
) {
  switch (type) {
    case PipelineEnum.APACHE_AIRFLOW:
  }
  const filePromises = paths.map((p: string) =>
    fileBrowser.model.manager.services.contents.get(p, {
      type: 'file',
      content: true,
      format: 'base64'
    })
  );
  const files = await Promise.all(filePromises);
  const formData = new FormData();
  files.forEach(f => {
    const { content, mimetype, name } = f;
    const blob = Utils.base64toBlob(content, mimetype);
    const file = new File([blob], name, { type: mimetype });
    formData.append('file', file);
  });
  return RequestHandler.makeServerRequest<{ paths: string[] }>(
    '/upload/file',
    {
      body: formData,
      method: 'POST'
    },
    new Loading()
  ).catch(e => {
    RequestErrors.serverError(e);
    throw new Error('文件上次失败！');
  });
}
