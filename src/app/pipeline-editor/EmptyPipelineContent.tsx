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

import { dragDropIcon } from '@app/ui-components';
import { settingsIcon } from '@jupyterlab/ui-components';

import React from 'react';

const HEADER_CLASS = 'empty-pipeline-header';
const BUTTON_CLASS = 'empty-pipeline-button';
const ICON_CLASS = 'empty-pipeline-icon';

export interface IEmptyGenericPipelineProps {
  onOpenSettings: () => void;
}

export const EmptyGenericPipeline: React.FC<IEmptyGenericPipelineProps> = ({
  onOpenSettings
}) => {
  return (
    <div>
      <dragDropIcon.react
        className="drag-drop-icon"
        tag="div"
        elementPosition="center"
        height="120px"
      />
      <h3 className={HEADER_CLASS}>
        通过从左侧节点列表拖动节点或拖动文件来启动新管道
      </h3>
      <br />
      <br />
      <h3 className={HEADER_CLASS}>
        点击{' '}
        <button
          title="Settings"
          className={BUTTON_CLASS}
          onClick={onOpenSettings}
        >
          <settingsIcon.react className={ICON_CLASS} tag="div" height="24px" />
        </button>{' '}
        配置管道编辑器.
      </h3>
    </div>
  );
};

export interface IEmptyPlatformSpecificPipelineProps {
  onOpenSettings: () => void;
}

export const EmptyPlatformSpecificPipeline: React.FC<
  IEmptyPlatformSpecificPipelineProps
> = ({ onOpenSettings }) => {
  return (
    <div>
      <dragDropIcon.react
        className="drag-drop-icon"
        tag="div"
        elementPosition="center"
        height="120px"
      />
      <h3 className={HEADER_CLASS}>
        通过从左侧节点列表拖动节点或拖动文件来启动新管道
      </h3>
      <br />
      <br />
      <h3 className={HEADER_CLASS}>
        点击{' '}
        <button
          title="Settings"
          className={BUTTON_CLASS}
          onClick={onOpenSettings}
        >
          <settingsIcon.react className={ICON_CLASS} tag="div" height="24px" />
        </button>{' '}
        配置管道编辑器.
      </h3>
    </div>
  );
};
