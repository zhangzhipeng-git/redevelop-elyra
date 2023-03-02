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

import { componentCatalogIcon, dragDropIcon } from '@elyra/ui-components';
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
        通过从文件浏览器窗格中拖动文件来启动新管道
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
  onOpenCatalog: () => void;
  onOpenSettings: () => void;
}

export const EmptyPlatformSpecificPipeline: React.FC<
  IEmptyPlatformSpecificPipelineProps
> = ({ onOpenCatalog, onOpenSettings }) => {
  // Note: the URL is rewritten by the release script by replacing `latest` with a
  // specific version number, e.g. https://.../en/v3.6.0/user_guide/pi...
  const customComponentsHelpTopicURL =
    'https://elyra.readthedocs.io/en/v3.14.2/user_guide/pipeline-components.html';

  return (
    <div>
      <dragDropIcon.react
        className="drag-drop-icon"
        tag="div"
        elementPosition="center"
        height="120px"
      />
      <h3 className={HEADER_CLASS}>
        通过从文件浏览器窗格或中拖动文件来启动新管道，通过单击{' '}
        <button className={BUTTON_CLASS} onClick={onOpenCatalog}>
          <componentCatalogIcon.react
            className={ICON_CLASS}
            tag="div"
            height="24px"
          />
        </button>{' '}
        添加自定义组件.
      </h3>
      <h4 className={HEADER_CLASS}>
        有关详细信息，请参阅
        <a
          href={customComponentsHelpTopicURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          &apos;管道组件&apos; 帮助主题{' '}
        </a>
      </h4>
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
