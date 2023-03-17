import { PipelineEnum, Types } from '@app/enums';
import { FileBrowser } from '@jupyterlab/filebrowser';
import { RequestHandler } from '@app/services';
import Utils from '@app/util';
import { Dialog } from '@jupyterlab/apputils';

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
  fileBrowser.model.manager.services.contents
    .get(paths[0], { type: 'file', format: 'base64', content: true })
    .then(res => {
      const { content, mimetype, name } = res;
      const blob = Utils.base64toBlob(content, mimetype);
      const file = new File([blob], name, { type: mimetype });
      const formData = new FormData();
      formData.append('file', file);

      RequestHandler.makeServerRequest(
        '/upload/file',
        {
          body: formData,
          method: 'POST'
        },
        new Dialog({
          title: '正在上传文件',
          body: '请稍等...'
        })
      );
    })
    .catch(() => {
      throw new Error('上传文件失败');
    });
}
