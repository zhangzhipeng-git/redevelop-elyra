/** 文件类型映射 */
export const TYPE_MAP: { [k: string]: string } = {
  '.py': 'Python',
  '.jar': 'java'
};

/** 文件后缀映射 */
export const EXT_MAP: { [k: string]: string } = {
  java: '.jar',
  scala: '.jar',
  Python: '.py'
};

/** 上传文件是页面展示用的字段是实际上传的字段+这个前缀组成 */
export const UPLOAD_VIEW_FIELD_PREFIX = 'zzp';
