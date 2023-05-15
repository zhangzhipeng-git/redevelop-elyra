/*
 * Copyright 2018-2022 Redevelop-Elyra Authors
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

import Form, { FormValidation, UiSchema, Widget } from '@rjsf/core';
import { produce } from 'immer';
import styled from 'styled-components';

import { CustomFieldTemplate } from '../CustomFormControls';
import { MyReactCron } from '../CustomFormControls/cron/ReactCron';
import { MyDateTime } from '../CustomFormControls/DateTime';
import { JSONSchema7 } from 'json-schema';

import {
  ERROR_TYPE_MAP,
  Message,
  genUISchemaFromSchema,
  transformErrors
} from './util';

import { useState } from 'react';

const Heading = styled.div`
  margin-top: 14px;
  padding: 0 20px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: 16px;
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
  handleUpdateNodeProperties?: (
    options: {
      type: string;
      applicationId: string;
    },
    key: string
  ) => Promise<void>;
  noValidate?: boolean;
  id?: string;
}

/**
 * @param {object} 管道的属性对象，可应用于管道中的所有节点
 * @param {schema} 管道的属性表单配置
 */
export default function PipelinePropertiesPanel({
  data,
  schema: _schema,
  onChange,
  handleUpdateNodeProperties,
  noValidate,
  id
}: Props) {
  if (!_schema) return <Message>未定义属性。</Message>;

  const _uiSchema: UiSchema = {};
  genUISchemaFromSchema(_schema, _uiSchema);

  // 每次都生成了新的 _uiSchema ，故对源数据无影响
  // 没有是否重试，则不需要展示重试次数和校验重试次数
  if (!data?.whetherRetry) {
    _uiSchema.retry['ui:field'] = 'hidden';
    _schema.required = _schema.required.filter((r: string) => r !== 'retry');
  }

  const [options, setOptions] = useState<any>({
    schema: _schema,
    uiSchema: _uiSchema
  });

  /**
   * 校验pipeline属性
   * @param {object} formData pipeline表单
   * @param {object} errors pipeline表单错误信息
   */
  function customValidate(formData: any, errors: FormValidation) {
    const { schema } = options;
    const propSchema = schema.properties ?? {};

    // 归属应用数据选项校验（接口查回来的可能为空集合）
    if (!propSchema.applicationId?.enum[0])
      errors?.applicationId?.addError(ERROR_TYPE_MAP.enumRequired);

    return errors;
  }

  /**
   * pipeline属性改变
   * @param {object} e pipeline属性改变事件的参数
   */
  async function onChangeFn(e: any) {
    const newFormData = e.formData;
    if (!newFormData) return;

    const { schema, uiSchema } = options;
    const { applicationId, whetherRetry } = newFormData;

    // 选择归属应用，更新节点的连接信息
    if (applicationId != null && applicationId !== data?.applicationId) {
      const { enum: enumIds } = schema.properties.applicationId;
      const { enum: enumCodes } = schema.properties.applicationCode;
      const index = enumIds.indexOf(applicationId);
      newFormData.applicationCode = enumCodes[index];
      await handleUpdateNodeProperties?.(
        { type: 'kubernetes', applicationId },
        'connId'
      );
    }

    // 不勾选是否重试，则不展示重试次数，反之则展示重试次数
    if (whetherRetry != null && whetherRetry !== data?.whetherRetry) {
      if (!whetherRetry) {
        uiSchema.retry['ui:field'] = 'hidden';
        schema.required = schema.required.filter((r: string) => r !== 'retry');
        delete newFormData.retry;
      } else {
        uiSchema.retry['ui:field'] = 'visible';
        schema.required.push('retry');
      }
      setOptions({
        uiSchema,
        schema
      });
    }

    return onChange?.(newFormData);
  }

  const formContext = {
    /**
     * 自定义组件更改pipeline属性，重新加载 pipeline 数据
     * P.s. 这里的pipeline的属性字段本身不能包含'_'，否则会出问题！
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

  return (
    <div>
      <Heading>工作流基本信息</Heading>
      <Form
        formData={data}
        uiSchema={options.uiSchema}
        schema={options.schema}
        validate={customValidate}
        onChange={onChangeFn}
        formContext={formContext}
        id={id}
        widgets={widgets}
        liveValidate={!noValidate}
        noHtml5Validate
        FieldTemplate={CustomFieldTemplate}
        className={'redevelop-elyra-formEditor'}
        transformErrors={transformErrors}
      />
    </div>
  );
}
