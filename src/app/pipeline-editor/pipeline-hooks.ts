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

import { MetadataService } from '../services';

import produce from 'immer';
import useSWR from 'swr';

import { PipelineService } from './PipelineService';

import { SvgKey, svgMap } from '@assets/svgs';
import Utils from '@app/util';

export const GENERIC_CATEGORY_ID = 'Elyra';

interface IReturn<T> {
  data?: T | undefined;
  error?: any;
  mutate?: any;
}

type IRuntimeImagesResponse = IRuntimeImage[];

interface IRuntimeImage {
  name: string;
  display_name: string;
  metadata: {
    image_name: string;
  };
}

const metadataFetcher = async <T>(key: string): Promise<T> => {
  return await MetadataService.getMetadata(key);
};

export const useRuntimeImages = (): IReturn<IRuntimeImagesResponse> => {
  console.log('==获取节点运行时镜像==');
  const { data, error } = useSWR<IRuntimeImagesResponse>(
    'runtime-images',
    metadataFetcher
  );

  data?.sort((a, b) => 0 - (a.name > b.name ? -1 : 1));

  return { data, error };
};

const schemaFetcher = async <T>(key: string): Promise<T> => {
  return await MetadataService.getSchema(key);
};

// TODO: type this
export const useRuntimesSchema = (): IReturn<any> => {
  const { data, error } = useSWR<any>('runtimes', schemaFetcher);

  return { data, error };
};

interface IRuntimeComponentsResponse {
  version: string;
  categories: IRuntimeComponent[];
  properties: IComponentPropertiesResponse;
  parameters: IComponentPropertiesResponse;
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
  group_info: {
    group_info: {
      id: string;
      parameter_refs: string[];
    }[];
  }[];
}

/**
 * Sort palette in place. Takes a list of categories each containing a list of
 * components.
 * - Categories: alphabetically by "label" (exception: "generic" always first)
 * - Components: alphabetically by "op" (where is component label stored?)
 */
export const sortPalette = (palette: {
  categories: IRuntimeComponent[];
}): void => {
  palette.categories.sort((a, b) => {
    if (a.id === GENERIC_CATEGORY_ID) {
      return -1;
    }
    if (b.id === GENERIC_CATEGORY_ID) {
      return 1;
    }
    return a.label.localeCompare(b.label, undefined, { numeric: true });
  });

  for (const components of palette.categories) {
    components.node_types.sort((a, b) =>
      a.label.localeCompare(b.label, undefined, {
        numeric: true
      })
    );
  }
};

// TODO: This should be enabled through `extensions`
const NodeIcons: Map<string, string> = new Map([
  ['execute-notebook-node', '/static/elyra/notebook.svg'],
  ['execute-python-node', '/static/elyra/python.svg'],
  ['execute-r-node', '/static/elyra/r-logo.svg'],
  ['execute-KubernetesPodOperator-node', '/static/elyra/airflow.svg'],
  ['execute-SparkKubernetesOperator-node', '/static/elyra/airflow.svg']
]);

// TODO: We should decouple components and properties to support lazy loading.
// TODO: type this
export const componentFetcher = async (type: string): Promise<any> => {
  const palettePromise =
    PipelineService.getComponentCatalogs<IRuntimeComponentsResponse>(type);

  /** 查管道属性 */
  const pipelinePropertiesPromise =
    PipelineService.getPipelineProperties<IComponentPropertiesResponse>(type);

  /** 查 pipeline 运行环境类型 */
  const typesPromise = PipelineService.getRuntimeTypes();

  const [palette, types, pipelineProperties] = await Promise.all([
    palettePromise,
    typesPromise,
    pipelinePropertiesPromise
  ]);

  palette.properties = pipelineProperties;

  // Gather list of component IDs to fetch properties for.
  const componentList: string[] = [];
  for (const category of palette.categories) {
    for (const node of category.node_types) {
      componentList.push(node.id);
    }
  }

  /** 查节点属性 */
  const propertiesPromises = componentList.map(async componentID => {
    const res =
      await PipelineService.getNodeProperties<IComponentPropertiesResponse>(
        type,
        componentID
      );
    return {
      id: componentID,
      properties: res
    };
  });

  // load all of the properties in parallel instead of serially
  const properties = await Promise.all(propertiesPromises);

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
      svgMap.get(type?.icon || SvgKey.PIPELINE)
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

  sortPalette(palette);

  return palette;
};

const updateRuntimeImages = (
  properties: any,
  runtimeImages: IRuntimeImage[] | undefined
): void => {
  const runtimeImageProperties =
    properties?.properties?.component_parameters?.properties?.runtime_image ??
    properties?.properties?.pipeline_defaults?.properties?.runtime_image;

  const imageNames = (runtimeImages ?? []).map(i => i.metadata.image_name);

  const displayNames: { [key: string]: string } = {};

  (runtimeImages ?? []).forEach((i: IRuntimeImage) => {
    displayNames[i.metadata.image_name] = i.display_name;
  });

  if (runtimeImageProperties) {
    runtimeImageProperties.enumNames = (runtimeImages ?? []).map(
      i => i.display_name
    );
    runtimeImageProperties.enum = imageNames;
  }
};

export const usePalette = (type = 'local'): IReturn<any> => {
  console.log(
    '==获取 palette 参数：节点目录、管道属性表单配置和节点属性表单配置=='
  );
  const { data: runtimeImages, error: runtimeError } = useRuntimeImages();

  const {
    data: palette,
    error: paletteError,
    mutate: mutate
  } = useSWR(type, componentFetcher);

  console.log('==设置节点表单配置的运行时镜像选项==');
  let updatedPalette;
  if (palette !== undefined) {
    updatedPalette = produce(palette, (draft: any) => {
      for (const category of draft.categories) {
        for (const node of category.node_types) {
          // update runtime images
          updateRuntimeImages(node.app_data.properties, runtimeImages);
        }
      }
      updateRuntimeImages(draft.properties, runtimeImages);
    });
  }

  return {
    data: updatedPalette,
    error: runtimeError ?? paletteError,
    mutate: mutate
  };
};
