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

import Form, { UiSchema, Widget, AjvError, FormValidation } from '@rjsf/core';
import { produce } from 'immer';
import styled from 'styled-components';

import {
  FileWidget,
  CustomFieldTemplate,
  ArrayTemplate,
  CustomOneOf
} from '../CustomFormControls';
import { MyReactCron } from '../CustomFormControls/ReactCron';
import { MyDateTime } from '../CustomFormControls/DateTime';
import { JSONSchema7 } from 'json-schema';

import { PathExt } from '@jupyterlab/coreutils';
import path from '../path';

import { TYPE_MAP } from '@src/app/const';
import { ErrorEnum } from '@src/app/enums';
import Utils from '@src/app/util';

export const Message = styled.div`
  margin-top: 14px;
  padding: 0 22px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: ${({ theme }) => theme.typography.fontSize};
  color: ${({ theme }) => theme.palette.text.primary};
  opacity: 0.5;
`;

const widgets: { [id: string]: Widget } = {
  file: FileWidget,
  myReactCron: MyReactCron,
  myDateTime: MyDateTime
};

interface Props {
  data: any;
  schema?: JSONSchema7 | any;
  onChange?: (data: any) => any;
  onFileRequested?: (options: any) => any;
  noValidate?: boolean;
  id?: string;
  handleAfterSelectFileUploadFile?: (
    paths: string[]
  ) => Promise<{ paths: string[] }>;
}

/**
 * @param {object} 管道的属性对象，可应用于管道中的所有节点
 * @param {schema} 管道的属性表单配置
 */
export function PropertiesPanel({
  data,
  schema,
  onChange,
  onFileRequested,
  noValidate,
  id,
  handleAfterSelectFileUploadFile
}: Props) {
  if (!schema) return <Message>未定义属性.</Message>;

  const uiSchema: UiSchema = {};

  function genUISchemaFromSchema(schema: any, uiSchema: UiSchema) {
    if (schema.uihints) Object.assign(uiSchema, schema.uihints);
    if (!schema.properties) return;
    for (const field in schema.properties) {
      const property = schema.properties[field];
      genUISchemaFromSchema(property, (uiSchema[field] = {}));
    }
  }
  genUISchemaFromSchema(schema, uiSchema);

  function onChangeFn(e: any) {
    const newFormData = e.formData;
    const params = schema!.properties?.component_parameters?.properties ?? {};
    for (const field in params) {
      if (params[field].oneOf) {
        for (const option of params[field].oneOf) {
          if (option.widget?.const !== undefined) {
            newFormData.component_parameters[field].widget =
              option.widget.const;
          }
        }
      }
    }

    const nodeParams = e.formData.component_parameters;
    if (nodeParams) {
      const { type, localFile } = nodeParams;
      const fileType = TYPE_MAP[path.extname(localFile)];
      if (type !== fileType) {
        delete nodeParams.mainApplicationFile;
        delete nodeParams.localFile;
        // to-do 删除文件
      }
    }

    onChange && Utils.debounceExecute(onChange, [e.formData], 100);
  }

  function customValidate(formData: any, errors: FormValidation) {
    const data = formData.component_parameters;
    const error = errors.component_parameters as any;
    const needValidate = data && error;
    const field = 'priority_class_name';

    if (needValidate && ['java', 'scala'].includes(data.type) && !data[field])
      error?.[field]?.addError(ErrorEnum.REQUIRED);

    return errors;
  }

  const formContext = {
    /**
     * 自定义组件更改pipeline属性，重新加载 pipeline 数据
     * @param param0 属性字段名称拼接字符串，如 root_a_b_c
     */
    onPipelinePropertyChange: ({ propertyID, v }: any) => {
      if (!propertyID) return;
      const keys = propertyID.split('_');
      if (!keys[1] && keys[0] === 'root') return;
      const newFormData = produce(data, (draft: any) => {
        let o = draft;
        let i = 1;
        for (; i < keys.length - 1; i++) {
          o = o?.[keys[i]];
        }
        const lk = keys[i];
        if (!o) return;
        o[lk] = v;
      });
      onChange?.(newFormData ?? data);
    },

    onFileRequested: async (args: any) => {
      const values = await onFileRequested?.({
        ...args,
        filename: data.component_parameters.filename
      });

      let s3Paths: string[] = [];
      if (handleAfterSelectFileUploadFile)
        s3Paths = (await handleAfterSelectFileUploadFile(values)).paths;

      const typeMap: any = { '.py': 'python', '.jar': 'java' };
      const newFormData = produce(data, (draft: any) => {
        if (args.canSelectMany) {
          draft.component_parameters[args.propertyID] = [
            ...draft.component_parameters[args.propertyID],
            ...values
          ];
          draft.component_parameters.mainApplicationFile = s3Paths;
          draft.component_parameters.type = values.map(
            (v: string) => typeMap[PathExt.extname(v)]
          );
          return;
        }

        if (args.parentID) {
          draft.component_parameters[args.parentID].value = values?.[0];
        } else {
          draft.component_parameters[args.propertyID] = values?.[0];
        }
        draft.component_parameters.mainApplicationFile = values?.[0];
        draft.component_parameters.type =
          typeMap[PathExt.extname(values[0])] || 'java';
      });

      onChange?.(newFormData ?? data);
    },
    // 点击刷新按钮时调用
    onPropertiesUpdateRequested: async (args: any) => {
      onChange?.(args);
    },
    formData: data
  };

  function transformErrors(errors: AjvError[]) {
    return errors
      .filter(e => e.name !== 'oneOf') // oneOf 使用自定义的校验逻辑
      .map(e => ({
        ...e,
        message: e.name === 'required' ? ErrorEnum.REQUIRED : e.message
      }));
  }

  return (
    <Form
      formData={data}
      uiSchema={uiSchema}
      schema={schema}
      onChange={onChangeFn}
      validate={customValidate}
      formContext={formContext}
      id={id}
      widgets={widgets}
      fields={{
        OneOfField: CustomOneOf
      }}
      liveValidate={!noValidate}
      ArrayFieldTemplate={ArrayTemplate}
      noHtml5Validate
      FieldTemplate={CustomFieldTemplate}
      className={'elyra-formEditor'}
      transformErrors={transformErrors}
    />
  );
}
