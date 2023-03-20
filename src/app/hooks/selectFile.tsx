import { PipelineEnum, Types } from '@src/app/enums';
import { FileBrowser } from '@jupyterlab/filebrowser';

import Utils from '@src/app/util';
import { UploadFileResponse } from '@src/app/model';
import { PipelineService } from '@src/app/pipeline-editor/PipelineService';
import { mask, unmask } from '../ui-components/loading';

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
  if (type !== PipelineEnum.APACHE_AIRFLOW) return { paths: [] };

  const filePromises = paths.map((p: string) =>
    fileBrowser.model.manager.services.contents.get(p, {
      type: 'file',
      content: true,
      format: 'base64'
    })
  );

  let uploadFiles: UploadFileResponse[] = [];
  mask();
  try {
    const files = await Promise.all(filePromises);
    const uploadPromises = files.map(f => {
      const { content, mimetype, name } = f;
      const blob = Utils.base64toBlob(content, mimetype);
      const file = new File([blob], name, { type: mimetype });
      const formData = new FormData();
      formData.append('file', file);
      return PipelineService.uploadFile(formData);
    });
    uploadFiles = await Promise.all(uploadPromises);
  } catch (e) {
    console.warn('上传文件失败！');
  }
  unmask();

  return { paths: uploadFiles.map(v => v.url) };
}
