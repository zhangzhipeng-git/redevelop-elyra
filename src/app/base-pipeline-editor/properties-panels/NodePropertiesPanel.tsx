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

import Form, { UiSchema, Widget, FormValidation } from '@rjsf/core';
import { produce } from 'immer';
import styled from 'styled-components';

import {
  FileWidget,
  CustomFieldTemplate,
  ArrayTemplate
} from '../CustomFormControls';

import { JSONSchema7 } from 'json-schema';

import { PathExt } from '@jupyterlab/coreutils';

import { TYPE_MAP } from '@src/app/const';
import { ERROR_TYPE_MAP, genUISchemaFromSchema, transformErrors } from './util';
import { useState } from 'react';

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
  schema?: JSONSchema7 | any;
  onChange?: (data: any) => any;
  onFileRequested?: (options: any) => any;
  noValidate?: boolean;
  id?: string;
  handleAfterSelectFileUploadFile?: (
    paths: string[]
  ) => Promise<{ paths: string[] }>;
  handleAfterSelectFileRemoveOldFile?: (prePath: string) => void;
}

/**
 * @param {object} 管道的属性对象，可应用于管道中的所有节点
 * @param {schema} 管道的属性表单配置
 */
export function NodePropertiesPanel({
  data,
  schema: _schema,
  onChange,
  onFileRequested,
  noValidate,
  id,
  handleAfterSelectFileUploadFile,
  handleAfterSelectFileRemoveOldFile
}: Props) {
  if (!_schema) return <Message>未定义属性。</Message>;
  const _uiSchema: UiSchema = {};
  genUISchemaFromSchema(_schema, _uiSchema);

  const [options, setOptions] = useState<any>({
    schema: _schema,
    uiSchema: _uiSchema
  });

  const schemas = _uiSchema.component_parameters;
  if (['java', 'scala'].includes(data?.component_parameters?.type)) {
    if (schemas.tarPath) schemas.tarPath['ui:field'] = 'hidden';
    if (schemas._pyPackages) schemas._pyPackages['ui:field'] = 'hidden';
  } else {
    if (schemas._dependencies) schemas._dependencies['ui:field'] = 'hidden';
    if (schemas._exDependencies) schemas._exDependencies['ui:field'] = 'hidden';
  }

  /**
   * 校验节点属性
   * @param {object} formData 节点属性表单
   * @param {object} errors 节点属性错误
   */
  function customValidate(formData: any, errors: FormValidation) {
    const { schema } = options;
    const nodeSchema =
      schema.properties?.component_parameters?.properties ?? {};
    const data = formData.component_parameters;
    const error: any = errors.component_parameters;

    // 1.任务类型级联启动主类校验
    const field = 'mainClass';
    if (['java', 'scala'].includes(data.type) && !data[field])
      error?.[field]?.addError(ERROR_TYPE_MAP.required);

    // 2.连接信息数据项校验（接口查回来的可能为空集合）
    if (!nodeSchema.connId?.enum[0])
      error?.connId?.addError(ERROR_TYPE_MAP.enumRequired);

    return errors;
  }

  /**
   * 节点属性改变
   * @param {object} 节点属性改变事件的参数
   */
  function onChangeFn(e: any) {
    const newFormData = e.formData;
    const nodeParams = newFormData.component_parameters;
    if (!newFormData || !nodeParams) return;

    const { uiSchema, schema } = options;
    const oldNodeParams = data.component_parameters ?? {};
    const paramSchema = e.schema.properties.component_parameters;
    const properties = paramSchema.properties;
    const { type, connId } = nodeParams;
    const { type: oldType, connId: oldConnId } = oldNodeParams;

    // 1. 任务类型更改后，置空文件路径和删除对应的文件 & 展示字段根据类型展示或隐藏
    if (type !== oldType) {
      // 删除文件 & 重置字段
      const prePath = nodeParams.mainApplicationFile;
      handleAfterSelectFileRemoveOldFile?.(prePath);
      delete nodeParams.mainApplicationFile;
      delete nodeParams._mainApplicationFile;
      const schemas = uiSchema.component_parameters;
      if (['java', 'scala'].includes(type)) {
        if (schemas.tarPath) schemas.tarPath['ui:field'] = 'hidden';
        if (schemas._pyPackages) schemas._pyPackages['ui:field'] = 'hidden';
        if (schemas._dependencies)
          schemas._dependencies['ui:field'] = 'visible';
        if (schemas._exDependencies)
          schemas._exDependencies['ui:field'] = 'visible';
      } else {
        if (schemas._dependencies) schemas._dependencies['ui:field'] = 'hidden';
        if (schemas._exDependencies)
          schemas._exDependencies['ui:field'] = 'hidden';
        if (schemas.tarPath) schemas.tarPath['ui:field'] = 'visible';
        if (schemas._pyPackages) schemas._pyPackages['ui:field'] = 'visible';
      }
      setOptions({
        uiSchema,
        schema
      });
    }

    // 2. 集群连接信息改变后，命名空间也要跟着改变
    if (connId !== oldConnId) {
      if (!connId) delete nodeParams.namespace;
      else {
        const { connId: connIdSchema } = properties;
        const index = connIdSchema.enum.indexOf(connId);
        if (index > -1) {
          nodeParams.connectionId = connIdSchema.connectionIdEnum?.[index];
          nodeParams.namespace = connIdSchema.namespaceEnum?.[index];
        }
      }
    }

    return onChange?.(newFormData);
  }

  const formContext = {
    /** 文件上传 */
    onFileRequested: async (args: any) => {
      const { propertyID } = args;
      const propValue = data.component_parameters[propertyID];

      const values = await onFileRequested?.({
        ...args,
        filename: Array.isArray(propValue) ? propValue[0] : propValue
      });

      if (!values || !values[0]) return;

      if (handleAfterSelectFileRemoveOldFile) {
        const preS3Path =
          data.component_parameters[propertyID.replace('_', '')];
        handleAfterSelectFileRemoveOldFile(preS3Path);
      }

      let s3Paths: string[] = [];
      if (handleAfterSelectFileUploadFile)
        s3Paths = (await handleAfterSelectFileUploadFile(values)).paths;

      const newFormData = produce(data, (draft: any) => {
        if (propertyID === '_mainApplicationFile') {
          draft.component_parameters._mainApplicationFile = values?.[0];
          draft.component_parameters.mainApplicationFile = s3Paths?.[0];
          draft.component_parameters.type =
            TYPE_MAP[PathExt.extname(values[0])];
        } else {
          draft.component_parameters[propertyID] = [...(values ?? [])];
          draft.component_parameters[propertyID.replace('_', '')] =
            s3Paths ?? [];
        }
      });

      onChange?.(newFormData ?? data);
    },
    formData: data
  };

  return (
    <Form
      formData={data}
      uiSchema={options.uiSchema}
      schema={options.schema}
      onChange={onChangeFn}
      validate={customValidate}
      formContext={formContext}
      id={id}
      widgets={widgets}
      liveValidate={!noValidate}
      ArrayFieldTemplate={ArrayTemplate}
      noHtml5Validate
      FieldTemplate={CustomFieldTemplate}
      className={'elyra-formEditor'}
      transformErrors={transformErrors}
    />
  );
}
