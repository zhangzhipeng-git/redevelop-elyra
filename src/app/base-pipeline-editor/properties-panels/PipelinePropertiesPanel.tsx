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

import { CustomFieldTemplate } from '../CustomFormControls';
import { MyReactCron } from '../CustomFormControls/ReactCron';
import { MyDateTime } from '../CustomFormControls/DateTime';
import { JSONSchema7 } from 'json-schema';

import { ErrorEnum } from '@src/app/enums';
import Utils from '@src/app/util';
import { genUISchemaFromSchema } from './util';

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
  myReactCron: MyReactCron,
  myDateTime: MyDateTime
};

interface Props {
  data: any;
  schema?: JSONSchema7 | any;
  onChange?: (data: any) => any;
  handleUpdateNodeProperties?: (options: {
    type: string;
    applicationId: number;
  }) => Promise<void>;
  noValidate?: boolean;
  id?: string;
}

/**
 * @param {object} 管道的属性对象，可应用于管道中的所有节点
 * @param {schema} 管道的属性表单配置
 */
export default function PipelinePropertiesPanel({
  data,
  schema,
  onChange,
  handleUpdateNodeProperties,
  noValidate,
  id
}: Props) {
  if (!schema) return <Message>未定义属性.</Message>;

  const uiSchema: UiSchema = {};
  genUISchemaFromSchema(schema, uiSchema);

  async function onChangeFn(e: any) {
    const newFormData = e.formData;
    const schema = e.schema;
    const applicationId = newFormData.applicationId;

    if (applicationId == null || applicationId === data.applicationId)
      return onChange && Utils.debounceExecute(onChange, [newFormData], 100);

    const { enum: enumIds } = schema.properties.applicationId;
    const { enum: enumCodes } = schema.properties.applicationCode;
    const index = enumIds.findIndex((e: number) => e === applicationId);
    newFormData.applicationCode = enumCodes[index];
    await handleUpdateNodeProperties?.({ type: 'kubernetes', applicationId });
    onChange && Utils.debounceExecute(onChange, [newFormData], 100);
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
      formContext={formContext}
      id={id}
      widgets={widgets}
      liveValidate={!noValidate}
      noHtml5Validate
      FieldTemplate={CustomFieldTemplate}
      className={'elyra-formEditor'}
      transformErrors={transformErrors}
    />
  );
}
