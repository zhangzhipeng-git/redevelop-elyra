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
  ArrayTemplate
} from '../CustomFormControls';

import { JSONSchema7 } from 'json-schema';

import { PathExt } from '@jupyterlab/coreutils';
import path from '../path';

import { TYPE_MAP } from '@src/app/const';
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
}

/**
 * @param {object} 管道的属性对象，可应用于管道中的所有节点
 * @param {schema} 管道的属性表单配置
 */
export function NodePropertiesPanel({
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
  genUISchemaFromSchema(schema, uiSchema);

  function onChangeFn(e: any) {
    const newFormData = e.formData;

    const nodeParams = newFormData.component_parameters;
    if (nodeParams) {
      const { type, localFile } = nodeParams;
      const fileType = TYPE_MAP[path.extname(localFile)];
      if (type !== fileType) {
        delete nodeParams.mainApplicationFile;
        delete nodeParams.localFile;
        // to-do 删除文件
      }
    }

    onChange && Utils.debounceExecute(onChange, [newFormData], 100);
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
    onFileRequested: async (args: any) => {
      const values = await onFileRequested?.({
        ...args,
        filename: data.component_parameters.filename
      });

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
          draft.component_parameters.type = values.map(
            (v: string) => TYPE_MAP[PathExt.extname(v)]
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
          TYPE_MAP[PathExt.extname(values[0])] || 'java';
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