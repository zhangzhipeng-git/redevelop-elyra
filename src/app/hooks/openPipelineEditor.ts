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

import { PipelineService } from '@src/app/pipeline-editor/PipelineService';

import { SvgRequestUrl, svgMap } from '@src/assets/svgs';
import Utils from '@src/app/util';
import { DocumentRegistry } from '@jupyterlab/docregistry';

export const GENERIC_CATEGORY_ID = 'Elyra';

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
  ['execute-KubernetesPodOperator-node', '/static/elyra/k8s.svg'],
  ['execute-SparkKubernetesOperator-node', '/static/elyra/spark.svg']
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
  console.log(
    '==获取 palette 参数：节点目录、管道属性表单配置和节点属性表单配置=='
  );
  return oldData || (oldData = componentFetcher(type));
};

export async function onReadyOrRefresh(
  currentContext: DocumentRegistry.Context,
  type: string,
  setDefaultValue = false
) {
  const pipelineJson = currentContext.model.toJSON() as any;
  const palette = Utils.clone(getPalette(type)); // 有read-only问题，这里克隆一下

  // 表单数据-pipeline
  const pipeline = pipelineJson?.pipelines?.[0] ?? {};
  const pipelineProperties = pipeline.app_data?.properties ?? {};
  // 表单数据-nodes
  const nodes = pipeline.nodes ?? [];

  // 表单配置-pipeline
  const pipelineSchema = palette.properties?.properties ?? {};
  // 表单配置-nodes
  const nodeSchemas = palette.categories?.[0].node_types?.map((nt: any) => {
    return (
      nt?.app_data?.properties?.properties?.component_parameters?.properties ??
      {}
    );
  });
  const {
    applicationId: applicationIdSchema,
    applicationCode: applicationCodeSchema
  } = pipelineSchema;
  const apps = await PipelineService.apps();
  const ids = apps.map(({ applicationId }) => applicationId);
  const names = apps.map(({ applicationName }) => applicationName);
  const codes = apps.map(({ applicationCode }) => applicationCode);
  applicationIdSchema.enum = ids;
  applicationIdSchema.enumNames = names;
  applicationCodeSchema.enum = codes;

  applicationIdSchema.default = ids[0];
  applicationCodeSchema.default = codes[0];

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

  const conn = await PipelineService.conn({
    type: 'kubernetes',
    applicationId: id
  });
  const connIds = conn.map(({ connId }) => connId);
  const connNames = conn.map(({ connName }) => connName);
  nodeSchemas?.forEach((ns: any) => {
    ns.connection.enum = connIds;
    ns.namespace.enumValues = connNames;

    ns.connection.default = connIds[0];
    ns.namespace.default = connNames[0];
  });

  nodes?.forEach((n: any) => {
    const { connection, namespace } = n?.app_data?.component_parameters ?? {};
    if (!connIds.includes(connection) || !connNames.includes(namespace)) {
      if (n?.app_data?.component_parameters?.connection)
        n.app_data.component_parameters.connection = connIds[0];
      if (n?.app_data?.component_parameters?.namespace)
        n.app_data.component_parameters.namespace = connNames[0];
      changeFlag = true;
    }
  });

  if (!pipelineJson?.uuid) {
    pipelineJson.uuid = Utils.shortUUID();
    changeFlag = true;
  }

  if (changeFlag)
    currentContext.model.fromString(JSON.stringify(pipelineJson, null, 2));
  return palette;
}
