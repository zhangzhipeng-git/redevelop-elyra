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

import { Widget } from '@rjsf/core';
import { useCallback } from 'react';
import { Cron } from 'react-js-cron';
import CN_MY from './CN';

/**
 * cron 表达式组件，使用网上的插件
 * @param props
 */
export const MyReactCron: Widget = props => {
  const handleScheduleCycle = useCallback(
    v => {
      props.formContext.onPipelinePropertyChange?.({ propertyID: props.id, v });
    },
    [props]
  );

  return (
    <div id={props.id} style={{ marginTop: '10px' }}>
      <Cron
        value={props.value}
        locale={CN_MY}
        setValue={(value: any) => {
          handleScheduleCycle(value);
        }}
        allowEmpty={'never'}
        clearButton={false}
        displayError={false}
      />
    </div>
  );
};
