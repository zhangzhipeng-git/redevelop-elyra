import { AjvError, UiSchema } from '@rjsf/core';

/**
 * 根据表单规范的uihints生成ui配置，因为elyra的表单配置中，
 * ui配置是放到表单规范中的uihints字段里的。
 * @param {object} schema  表单字段规范配置
 * @param {object} uiSchema 表单字段ui配置
 */
export function genUISchemaFromSchema(schema: any, uiSchema: UiSchema) {
  if (schema.uihints) Object.assign(uiSchema, schema.uihints);
  if (!schema.properties) return;
  for (const field in schema.properties) {
    const property = schema.properties[field];
    genUISchemaFromSchema(property, (uiSchema[field] = {}));
  }
}

/** 错误类型 (用于适配 rjsf 表单错误提示转为中文)*/
export const RJSF_ERROR_MESSAGE =
  /string|required|object|number|integer|array|boolean/;
export const ERROR_TYPE_MAP: { [k: string]: string } = {
  string: '',
  object: '',
  number: '',
  integer: '',
  array: '',
  boolean: '',
  required: '是必填属性',
  enumRequired: '数据选项为空'
};
export const FIELD_DEFAULT_ERROR_TIP = '未通过校验';

export function transformErrors(errors: AjvError[]) {
  return errors
    .map(e => {
      let message = e.message ?? '';
      let matchResult = message.match(RJSF_ERROR_MESSAGE);
      message = matchResult
        ? `${ERROR_TYPE_MAP[matchResult[0]]}`
        : FIELD_DEFAULT_ERROR_TIP;
      if (!message) return null as any;
      return {
        ...e,
        message
      };
    })
    .filter((e: AjvError) => !!e);
}
