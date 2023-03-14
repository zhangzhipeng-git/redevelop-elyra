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

import * as React from 'react';

interface IOperatorSelectProps {
  operators: { label: string; value: string }[];
}

const OperatorSelect: React.FC<IOperatorSelectProps> = ({ operators }) => {
  return (
    <form className="elyra-dialog-form">
      <label htmlFor="file_select_operator">文件关联 Operator 类型:</label>
      <br />
      <select
        id="file_select_operator"
        name="file_select_operator"
        className="elyra-form-export-filetype"
        data-form-required
      >
        {operators.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </form>
  );
};
export { OperatorSelect };
