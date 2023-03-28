import { PipelineEnum, Types } from '@src/app/enums';
import { FileBrowser } from '@jupyterlab/filebrowser';

import Utils from '@src/app/util';
import { UploadFileResponse } from '@src/app/model';
import { PipelineService } from '@src/app/pipeline-editor/PipelineService';
import { useMask } from '../ui-components/loading';

/**
 * 获取文件并上传
 * @param type pipeline 类型
 * @param fileBrowser 文档浏览器
 * @param paths 文件路径
 */
export async function onUploadFile(
  type = PipelineEnum.APACHE_AIRFLOW as Types,
  fileBrowser: FileBrowser,
  paths: string[],
  maskHost?: HTMLElement
) {
  const { mask, unmask } = useMask();
  let defaultPaths = { paths: [] };
  if (type !== PipelineEnum.APACHE_AIRFLOW) return defaultPaths;
  if (!paths || !paths[0]) return defaultPaths;

  const filePromises = paths.map((p: string) =>
    fileBrowser.model.manager.services.contents.get(p, {
      type: 'file',
      content: true,
      format: 'base64'
    })
  );

  let uploadFiles: UploadFileResponse[] = [];
  mask({ selector: maskHost });
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

/**
 * 移除之前上传的文件
 * @param {string} type pipeline 运行平台类型
 * @param {string} path 之前的文件上传后的路径
 */
export function onRemoveFile(type: string, path: string | string[]) {
  if (type !== PipelineEnum.APACHE_AIRFLOW || !path) return;
  let paths = Array.isArray(path) ? path : [path];
  paths = paths.map((p: string) => p?.split('path=')[1]);
  paths.forEach(
    (filePath: string) => filePath && PipelineService.removeFile({ filePath })
  );
}
