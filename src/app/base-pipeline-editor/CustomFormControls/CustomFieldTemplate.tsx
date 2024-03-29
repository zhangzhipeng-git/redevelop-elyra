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

import { FieldTemplateProps } from '@rjsf/core';

export const CustomFieldTemplate: React.FC<FieldTemplateProps> = props => {
  if (props.uiSchema['ui:field'] === 'hidden') return <div />;
  let children = props.children;
  const requiredError = props.required && props.formData === undefined;
  let hasError = props.rawErrors?.[0] || requiredError;
  // 选填项-字符串数组中的字符串不需要校验必填
  if (/pyPackages|dependencies|exDependencies/.test(props.id)) hasError = false;
  return (
    <div
      className={`${props.classNames} ${
        props.schema.properties?.value &&
        props.schema.properties?.widget &&
        'small-object-field'
      } ${props.schema.oneOf ? 'field-oneOf' : ''}`}
      id={props.id}
    >
      {hasError && <div className="errorIndicator" />}
      {props.schema.title !== undefined && props.schema.title !== ' ' ? (
        <div
          className={`label-header ${
            props.uiSchema['ui:field'] === 'header' ? 'category-header' : ''
          }`}
        >
          <label className="control-label" htmlFor={props.id}>
            {props.schema.title}{' '}
            {props.required ? (
              <span
                style={{
                  position: 'relative',
                  top: '3px',
                  fontSize: '18px',
                  color: 'red'
                }}
              >
                *
              </span>
            ) : null}
          </label>
          {props.schema.description && (
            <div className="description-wrapper">
              <div className="description-button">?</div>
              <p
                className={`field-description ${
                  props.schema.title.length < 10 ? 'short-title' : ''
                }`}
              >
                {props.schema.description}
              </p>
            </div>
          )}
        </div>
      ) : undefined}
      {children}
      {props.errors}
    </div>
  );
};
