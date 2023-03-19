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

import Form, { UiSchema, Widget, AjvError } from '@rjsf/core';
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
  schema?: any;
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
  if (schema === undefined) {
    return <Message>未定义属性.</Message>;
  }

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
    const params = schema.properties?.component_parameters?.properties;
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
    onChange?.(e.formData);
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

    onFileRequested: async (args: any, fieldName: string) => {
      const values = await onFileRequested?.({
        ...args,
        filename: data.component_parameters.filename
      });

      console.log(args, fieldName, 'onFileRequested');

      let s3Paths: string[] = [];
      if (handleAfterSelectFileUploadFile)
        s3Paths = (await handleAfterSelectFileUploadFile(values)).paths;

      const newFormData = produce(data, (draft: any) => {
        if (args.canSelectMany) {
          draft.component_parameters[args.propertyID] = [
            ...draft.component_parameters[args.propertyID],
            ...values
          ];
          draft.component_parameters.mainApplicationFile = s3Paths;
        } else {
          if (args.parentID) {
            draft.component_parameters[args.parentID].value = values?.[0];
          } else {
            draft.component_parameters[args.propertyID] = values?.[0];
          }
          draft.component_parameters.mainApplicationFile = values?.[0];
        }
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
        message: e.name === 'required' ? '是必填属性' : e.message
      }));
  }

  return (
    <Form
      formData={data}
      uiSchema={uiSchema}
      schema={schema as any}
      onChange={onChangeFn}
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
