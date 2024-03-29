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

import zhCH from 'antd/lib/date-picker/locale/zh_CN';
import DatePicker from 'antd/lib/date-picker';
import dayjs from 'dayjs';

/**
 * 日期时间组件，使用antd的插件
 * @param props
 */
export const MyDateTime: Widget = props => {
  const handleBackfillTime = useCallback(
    v => {
      props.formContext.onPipelinePropertyChange?.({ propertyID: props.id, v });
    },
    [props]
  );
  const format = 'YYYY/MM/DD HH:mm:ss';
  return (
    <div id={props.id} className={'my-date-time'}>
      <DatePicker
        locale={zhCH}
        format={format}
        style={{ width: '100%' }}
        value={props.value ? dayjs(props.value) : undefined}
        placeholder={`请选择${props.label}`}
        showTime
        onChange={(value: any) => {
          handleBackfillTime(value?.format(format));
        }}
        onOk={(value: any) => {
          handleBackfillTime(value?.format(format));
        }}
      />
    </div>
  );
};
