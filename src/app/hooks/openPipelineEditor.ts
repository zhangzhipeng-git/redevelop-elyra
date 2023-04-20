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

import { DocumentRegistry } from '@jupyterlab/docregistry';

import { PipelineService } from '@src/app/pipeline-editor/PipelineService';
import { SvgRequestUrl, svgMap } from '@src/assets/svgs';
import { AirflowOperatorEnum } from '@src/app/enums';
import Utils from '@src/app/util';

export const GENERIC_CATEGORY_ID = 'Redevelop-Elyra';

interface IRuntimeComponentsResponse {
  version: string;
  categories: IRuntimeComponent[];
  properties: IComponentPropertiesResponse;
}

export interface IRuntimeComponent {
  label: string;
  image: string;
  id: string;
  description: string;
  runtime?: string;
  node_types: {
    op: string;
    id: string;
    label: string;
    image: string;
    runtime_type?: string;
    type: 'execution_node';
    inputs: { app_data: any }[];
    outputs: { app_data: any }[];
    app_data: any;
  }[];
  extensions?: string[];
}

interface IComponentPropertiesResponse {
  current_parameters: { [key: string]: any };
  parameters: { id: string }[];
  uihints: {
    parameter_info: {
      parameter_ref: string;
      control: 'custom';
      custom_control_id: string;
      label: { default: string };
      description: {
        default: string;
        placement: 'on_panel';
      };
      data: any;
    }[];
  };
}

// TODO: This should be enabled through `extensions`
const NodeIcons: Map<string, string> = new Map([
  [AirflowOperatorEnum.K8S, '/static/redevelop-elyra/k8s.svg'],
  [AirflowOperatorEnum.SPARK, '/static/redevelop-elyra/spark.svg']
]);

// TODO: We should decouple components and properties to support lazy loading.
// TODO: type this
export const componentFetcher = (type: string) => {
  /** 节点目录配置，目前就两种 */
  const palette =
    PipelineService.getComponentCatalogs<IRuntimeComponentsResponse>(type);

  /** 查管道属性 */
  const pipelineProperties =
    PipelineService.getPipelineProperties<IComponentPropertiesResponse>(type);

  /** 查 pipeline 运行环境类型 */
  const types = PipelineService.getRuntimeTypes();

  palette.properties = pipelineProperties;

  // Gather list of component IDs to fetch properties for.
  const componentList: string[] = [];
  for (const category of palette.categories) {
    for (const node of category.node_types) {
      componentList.push(node.id);
    }
  }

  /** 查节点属性 */
  const properties = componentList.map(componentID => {
    const res = PipelineService.getNodeProperties<IComponentPropertiesResponse>(
      type,
      componentID
    );
    return {
      id: componentID,
      properties: res
    };
  });

  // inject properties
  // 管线编辑器左侧展开面板节点树目录
  for (const category of palette.categories) {
    // 根节点类型默认为它的第一个子节点的类型
    const category_runtime_type =
      category.node_types?.[0]?.runtime_type ?? 'LOCAL';
    const type = types.find((t: any) => t.id === category_runtime_type);
    // 默认图标为根节点的第一个子节点的图标
    // 如果默认类型节点的图标
    const defaultIcon = Utils.svgToBase64(
      svgMap.get(type?.icon || SvgRequestUrl.Pipeline)
    );
    category.image = defaultIcon;

    for (const node of category.node_types) {
      // update icon
      const genericNodeIcon = NodeIcons.get(node.op) as string;
      const nodeIcon = Utils.svgToBase64(svgMap.get(genericNodeIcon));

      node.image = nodeIcon;
      node.app_data.image = nodeIcon;
      node.app_data.ui_data.image = nodeIcon;

      const prop = properties.find(p => p.id === node.id);
      node.app_data.properties = prop?.properties;
    }
  }

  return palette;
};

let oldData: Promise<any> | null;
export const getPalette = (type = 'local') => {
  return oldData || (oldData = componentFetcher(type));
};

export async function onReadyOrRefresh(
  currentContext: DocumentRegistry.Context,
  type: string
) {
  const pipelineJson = currentContext.model.toJSON() as any;
  const palette = Utils.clone(getPalette(type)); // 有read-only问题，这里克隆一下

  // 工作流表单数据
  const pipeline = pipelineJson?.pipelines?.[0] ?? {};
  const pipelineProperties = pipeline.app_data?.properties ?? {};
  // 节点表单数据
  const nodes = pipeline.nodes ?? [];

  // 工作流表单配置
  const pipelineSchema = palette.properties?.properties ?? {};
  // 节点表单配置
  const nodeSchemas = palette.categories?.[0].node_types?.map((nt: any) => {
    return (
      nt?.app_data?.properties?.properties?.component_parameters?.properties ??
      {}
    );
  });

  // 打开/创建工作流文件的时候查询归属应用
  const {
    applicationId: applicationIdSchema,
    applicationCode: applicationCodeSchema
  } = pipelineSchema;
  const apps = await PipelineService.apps().catch(() => []);
  const ids = apps.map(({ applicationId }) => applicationId);
  const names = apps.map(({ applicationName }) => applicationName);
  const codes = apps.map(({ applicationCode }) => applicationCode);
  applicationIdSchema.enum = ids;
  applicationIdSchema.enumNames = names;
  applicationCodeSchema.enum = codes;
  // 设置默认的工作流归属应用
  applicationIdSchema.default = ids[0];
  applicationCodeSchema.default = codes[0];

  // 校验先前工作流的归属应用是否被包含于实时查出来的归属应用集合
  // 如果没通过校验，则将工作流的归属应用设置为实时查出来的归属应用集合的第一个
  let changeFlag;
  let id = ids[0];
  let { applicationId, applicationCode } = pipelineProperties;
  if (!ids.includes(applicationId) || !codes.includes(applicationCode)) {
    pipelineProperties.applicationId = ids[0];
    pipelineProperties.applicationCode = codes[0];
    changeFlag = true;
  } else {
    id = applicationId;
  }

  // 根据归属应用id查询连接信息
  const conn = await PipelineService.conn({
    type: 'kubernetes',
    applicationId: id
  }).catch(() => []);
  const connIds = conn.map(({ connId }) => connId);
  const connectionIds = conn.map(({ connectionId }) => connectionId);
  const nameSpaces = conn.map(({ nameSpace }) => nameSpace);
  nodeSchemas?.forEach((ns: any) => {
    ns.connId.connectionIdEnum = connectionIds;
    ns.connId.namespaceEnum = nameSpaces;
    ns.connId.enum = connIds;

    if (ns.connectionId) ns.connectionId.default = connectionIds[0];
    ns.namespace.default = nameSpaces[0];
    ns.connId.default = connIds[0];
  });

  // 校验先前的工作流节点属性的连接信息是否被包含于实时查出来的连接信息集合
  // 如果没通过校验，则将节点的连接信息设置为实时查出来的连接信息集合的第一个
  nodes?.forEach((n: any) => {
    const { connId, connectionId, namespace } =
      n?.app_data?.component_parameters ?? {};
    if (
      !connectionIds.includes(connectionId) ||
      !nameSpaces.includes(namespace) ||
      !connIds.includes(connId)
    ) {
      if (n?.app_data?.component_parameters?.connectionId)
        n.app_data.component_parameters.connectionId = connectionIds[0];
      if (n?.app_data?.component_parameters?.namespace)
        n.app_data.component_parameters.namespace = nameSpaces[0];
      if (n?.app_data?.component_parameters?.connId)
        n.app_data.component_parameters.connId = connIds[0];
      changeFlag = true;
    }
  });

  if (!pipelineJson?.uuid) {
    pipelineJson.uuid = Utils.timeUUID();
    changeFlag = true;
  }

  if (changeFlag) {
    currentContext.model.fromString(JSON.stringify(pipelineJson, null, 2));
    currentContext.save();
  }
  return palette;
}
