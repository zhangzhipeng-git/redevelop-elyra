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

import { useCallback } from 'react';

import { Widget } from '@rjsf/core';
import { EXT_MAP } from '@src/app/const';

// TODO: Make the file clearable
// 单文件上传组件
export const FileWidget: Widget = props => {
  const handleChooseFile = useCallback(async () => {
    const propertyID = props.id.replace('root_component_parameters_', '');
    const { extensions, parentID } = props.uiSchema;

    const options = {
      canSelectMany: false,
      defaultUri: props.value,
      filters: { File: [] },
      propertyID,
      parentID
    };

    if (propertyID === '_mainApplicationFile') {
      const fileType = props.formContext.formData.component_parameters.type;
      options.filters.File = EXT_MAP[fileType]
        ? [EXT_MAP[fileType]]
        : extensions;
    } else {
      options.filters.File = extensions;
    }

    props.formContext.onFileRequested(options);
  }, [props]);

  return (
    <div id={props.id} style={{ display: 'flex' }}>
      <input
        type="text"
        className="form-control"
        style={{ flex: 1 }}
        value={props.value || ''}
        placeholder={props.uiSchema?.['ui:placeholder']}
        onChange={e => {}}
        disabled
      />
      <button
        className="form-control choose-file-btn"
        style={{ display: 'inline-block', width: '50px', marginTop: '10px' }}
        onClick={handleChooseFile}
      >
        浏览
      </button>
    </div>
  );
};
