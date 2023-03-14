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
  file: FileWidget
};

interface Props {
  data: any;
  schema?: any;
  onChange?: (data: any) => any;
  onFileRequested?: (options: any) => any;
  onPropertiesUpdateRequested?: (options: any, filenameRef: string) => any;
  noValidate?: boolean;
  id?: string;
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
  onPropertiesUpdateRequested,
  noValidate,
  id
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
    onFileRequested: async (args: any, fieldName: string) => {
      console.log(args, data, 'onFileRequested');
      const values = await onFileRequested?.({
        ...args,
        filename: data.component_parameters.filename
      });
      const newFormData = produce(data, (draft: any) => {
        if (args.canSelectMany) {
          draft.component_parameters[args.propertyID] = [
            ...draft.component_parameters[args.propertyID],
            ...values
          ];
        } else {
          if (args.parentID) {
            draft.component_parameters[args.parentID].value = values?.[0];
          } else {
            draft.component_parameters[args.propertyID] = values?.[0];
          }
        }
      });
      onChange?.(newFormData ?? data);
    },
    onPropertiesUpdateRequested: async (args: any) => {
      console.log(args, arguments, 'onPropertiesUpdateRequested');
      const newData = await onPropertiesUpdateRequested?.(args, 'mainApplicationFile');
      onChange?.(newData);
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
