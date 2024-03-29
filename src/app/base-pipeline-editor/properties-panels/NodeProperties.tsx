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

import { NodeType } from 'elyra-canvas-fix';
import styled from 'styled-components';

import { AirflowOperatorEnum } from '@src/app/enums';

import { Message } from './util';
import { AirflowK8sNodePanel } from './AirflowK8sNodePanel';
import { AirflowSparkNodePanel } from './AirflowSparkNodePanel';

interface Props {
  selectedNodes?: any[];
  nodes: NodeType[];
  upstreamNodes?: any[];
  onFileRequested?: (options: any) => any;
  onChange?: (nodeID: string, data: any) => any;
  parameters?: {
    name: string;
    default_value?: {
      type: 'str' | 'int' | 'float' | 'bool' | 'list' | 'dict';
      value: any;
    };
    type?: string;
    required?: boolean;
  }[];
  handleAfterSelectFileUploadFile?: (
    paths: string[]
  ) => Promise<{ paths: string[] }>;
  handleAfterSelectFileRemoveOldFile?: (prePath: string) => void;
}

const Heading = styled.div`
  margin-top: 14px;
  padding: 0 20px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: 16px;
  color: ${({ theme }) => theme.palette.text.primary};
  opacity: 0.5;
`;

function NodeProperties({
  selectedNodes,
  nodes,
  onFileRequested,
  onChange,
  handleAfterSelectFileUploadFile,
  handleAfterSelectFileRemoveOldFile
}: Props) {
  if (selectedNodes === undefined || selectedNodes.length === 0) {
    return <Message>请选择节点编辑它的属性。</Message>;
  }

  if (selectedNodes.length > 1) {
    return <Message>选择了多个节点，选择单个节点以编辑它的属性。</Message>;
  }

  const selectedNode = selectedNodes[0];

  if (!selectedNode) {
    return <Message>请选择节点编辑它的属性。</Message>;
  }

  if (selectedNode.type !== 'execution_node') {
    return <Message>该类型的节点没有可编辑的属性。</Message>;
  }

  const nodePropertiesSchema = nodes.find(n => n.op === selectedNode.op);

  if (nodePropertiesSchema?.app_data.properties === undefined) {
    return <Message>该类型的节点没有可编辑的属性。</Message>;
  }

  const schema = nodePropertiesSchema?.app_data?.properties ?? {};
  const { id, op, app_data } = selectedNode;

  let nodePropertiesPanel = <>{/**/}</>;
  switch (op) {
    case AirflowOperatorEnum.K8S:
      nodePropertiesPanel = (
        <AirflowK8sNodePanel
          key={id}
          nodeOp={op}
          schema={schema}
          data={app_data}
          onChange={(data: any) => {
            onChange?.(id, data);
          }}
          onFileRequested={onFileRequested}
          handleAfterSelectFileUploadFile={handleAfterSelectFileUploadFile}
          handleAfterSelectFileRemoveOldFile={
            handleAfterSelectFileRemoveOldFile
          }
        />
      );
      break;
    case AirflowOperatorEnum.SPARK:
      nodePropertiesPanel = (
        <AirflowSparkNodePanel
          key={id}
          nodeOp={op}
          schema={schema}
          data={app_data}
          onChange={(data: any) => {
            onChange?.(id, data);
          }}
          onFileRequested={onFileRequested}
          handleAfterSelectFileUploadFile={handleAfterSelectFileUploadFile}
          handleAfterSelectFileRemoveOldFile={
            handleAfterSelectFileRemoveOldFile
          }
        />
      );
  }

  return (
    <div>
      <Heading>{nodePropertiesSchema.label}</Heading>
      <span className="nodeDescription">
        {nodePropertiesSchema.description}
      </span>
      {nodePropertiesPanel}
    </div>
  );
}

export default NodeProperties;
