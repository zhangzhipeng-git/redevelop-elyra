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
import { RequestHandler, MetadataService, IDictionary } from '../services';

import { RequestErrors } from '@app/ui-components';

import { showDialog, Dialog } from '@jupyterlab/apputils';
import { PathExt } from '@jupyterlab/coreutils';

import Utils from '@app/util';

// 配置项：json数据
import componentCatalogsAirflow from './jsons/airflow-component-catalogs.json';
import airflowPipelineProperties from './jsons/airflow-pipeline-properties.json';
import propertiesAirflowKubernetesPodOperator from './jsons/airflow-KubernetesPodOperator-properties.json';
import propertiesAirflowSparkKubernetesOperator from './jsons/airflow-SparkKubernetesOperator-properties.json';
import runtimeJSON from './jsons/runtime-types.json';

import { svgMap } from '@assets/svgs';

export const KFP_SCHEMA = 'kfp';
export const RUNTIMES_SCHEMASPACE = 'runtimes';
export const RUNTIME_IMAGES_SCHEMASPACE = 'runtime-images';
export const COMPONENT_CATALOGS_SCHEMASPACE = 'component-catalogs';

export interface IRuntime {
  name: string;
  display_name: string;
  schema_name: string;
  metadata: {
    runtime_type: string;
  };
}

export interface ISchema {
  name: string;
  title: string;
  runtime_type: string;
}

interface IComponentDef {
  content: string;
  mimeType: string;
}

enum ContentType {
  notebook = 'execute-notebook-node',
  python = 'execute-python-node',
  r = 'execute-r-node',
  other = 'other'
}

enum AirflowContentType {
  kpo = 'execute-KubernetesPodOperator-node',
  sko = 'execute-SparkKubernetesOperator-node'
}

const CONTENT_TYPE_MAPPER: Map<string, ContentType> = new Map([
  ['.py', ContentType.python],
  ['.ipynb', ContentType.notebook],
  ['.r', ContentType.r]
]);

const AIRFLOW_CONTENT_TYPE_MAPPER: Map<string, AirflowContentType[]> = new Map([
  ['.jar', [AirflowContentType.kpo, AirflowContentType.sko]],
  ['.py', [AirflowContentType.kpo, AirflowContentType.sko]],
  ['.scala', [AirflowContentType.kpo, AirflowContentType.sko]]
]);

export interface IRuntimeType {
  id: string;
  display_name: string;
  icon: string;
  export_file_types: { id: string; display_name: string }[];
}

/** 操作符 Operator 对象 */
export interface Operator {
  /** 所在目录 */
  catalog: string;
  /** operator 名称 */
  label: string;
  /** operator id */
  value: string;
}

export class PipelineService {
  /**
   * 根据 url 获取图标svg内容（非base64，如果需要base64 内联展示，需要调用 Utils.svgToBase64）
   */
  static getIcon(key: string) {
    return Promise.resolve(svgMap.get(key));
  }

  /**
   * 返回与每个活动运行环境对应的资源列表
   */
  static getRuntimeTypes(): Promise<IRuntimeType[]> {
    const res = Utils.clone(runtimeJSON);
    res.runtime_types.sort((a: any, b: any) => a.id.localeCompare(b.id));
    return Promise.resolve(res.runtime_types);
  }

  /**
   * Returns a list of external runtime configurations available as
   * `runtimes metadata`. This is used to submit the pipeline to be
   * executed on these runtimes.
   */
  static async getRuntimes(): Promise<any> {
    return MetadataService.getMetadata(RUNTIMES_SCHEMASPACE);
  }

  /**
   * Returns a list of runtime schema
   */
  static async getRuntimesSchema(showError = true): Promise<any> {
    return MetadataService.getSchema(RUNTIMES_SCHEMASPACE).then(schema => {
      if (showError && Object.keys(schema).length === 0) {
        return RequestErrors.noMetadataError('schema');
      }

      return schema;
    });
  }

  /**
   * Return a list of configured container images that are used as runtimes environments
   * to run the pipeline nodes.
   */
  static async getRuntimeImages(): Promise<any> {
    try {
      let runtimeImages = await MetadataService.getMetadata('runtime-images');

      runtimeImages = runtimeImages.sort(
        (a: any, b: any) => 0 - (a.name > b.name ? -1 : 1)
      );

      if (Object.keys(runtimeImages).length === 0) {
        return RequestErrors.noMetadataError('runtime image');
      }

      const images: IDictionary<string> = {};
      for (const image in runtimeImages) {
        const imageName: string =
          runtimeImages[image]['metadata']['image_name'];
        images[imageName] = runtimeImages[image]['display_name'];
      }
      return images;
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * 获取 pipeline 的节点目录
   * @param {string} type pipeline 的类型
   */
  static async getComponentCatalogs<T>(type = 'local') {
    const fnMap: { [k: string]: () => Promise<any> } = {
      local: () =>
        RequestHandler.makeGetRequest<T>(`elyra/pipeline/components/local`),
      APACHE_AIRFLOW: () =>
        Promise.resolve(Utils.clone(componentCatalogsAirflow)),
      KUBEFLOW_PIPELINES: () =>
        RequestHandler.makeGetRequest<T>(
          `elyra/pipeline/components/KUBEFLOW_PIPELINES`
        )
    };
    return fnMap[type]();
  }

    /**
   * 获取 pipeline 的属性配置
   * @param {string} type pipeline 的类型
   */
    static async getPipelineProperties<T>(type = 'local') {
      const fnMap: { [k: string]: () => Promise<any> } = {
        local: () =>
          RequestHandler.makeGetRequest<T>(`elyra/pipeline/local/properties`),
        APACHE_AIRFLOW: () =>
          Promise.resolve(Utils.clone(airflowPipelineProperties)),
        KUBEFLOW_PIPELINES: () =>
          RequestHandler.makeGetRequest<T>(
            `elyra/pipeline/components/KUBEFLOW_PIPELINES`
          )
      };
      return fnMap[type]();
    }
  

  /**
   * 获取节点属性
   * @param {string} type pipeline 运行环境类型
   * @param {string} componentID 组件节点ID
   */
  static async getNodeProperties<T>(type = 'local', componentID: string) {
    const fnMap: { [k: string]: () => Promise<any> } = {
      'APACHE_AIRFLOW-KubernetesPodOperator': () =>
        Promise.resolve(Utils.clone(propertiesAirflowKubernetesPodOperator)),
      'APACHE_AIRFLOW-SparkKubernetesOperator': () =>
        Promise.resolve(Utils.clone(propertiesAirflowSparkKubernetesOperator))
    };
    const fn = fnMap[`${type}-${componentID}`];
    if (typeof fn == 'function') return fn();

    /// to-do
    return RequestHandler.makeGetRequest<T>(
      `elyra/pipeline/components/${type}/${componentID}/properties`
    );
  }

  /**
   * 获取组件定义
   */
  static async getComponentDef(
    type = 'local',
    componentID: string
  ): Promise<IComponentDef> {
    return await RequestHandler.makeGetRequest<IComponentDef>(
      `elyra/pipeline/components/${type}/${componentID}`
    );
  }

  /**
   * Submit a request to refresh the component cache. If catalogName is given
   * only refreshes the given catalog
   *
   * @param catalogName
   */
  static async refreshComponentsCache(catalogName?: string): Promise<void> {
    return await RequestHandler.makePutRequest(
      `elyra/pipeline/components/cache${catalogName ? '/' + catalogName : ''}`,
      JSON.stringify({ action: 'refresh' })
    );
  }

  /**
   * Creates a Dialog for passing to makeServerRequest
   */
  static getWaitDialog(
    title = '请求服务...',
    body = '这可能需要一些时间'
  ): Dialog<any> {
    return new Dialog({
      title: title,
      body: body,
      buttons: [Dialog.okButton()]
    });
  }

  /**
   * Submit the pipeline to be executed on an external runtime (e.g. Kbeflow Pipelines)
   *
   * @param pipeline
   * @param runtimeName
   */
  static async submitPipeline(
    pipeline: any,
    runtimeName: string
  ): Promise<any> {
    return RequestHandler.makePostRequest(
      'elyra/pipeline/schedule',
      JSON.stringify(pipeline),
      this.getWaitDialog('Packaging and submitting pipeline ...')
    ).then((response: any) => {
      let dialogTitle;
      let dialogBody;
      if (response['run_url']) {
        // pipeline executed remotely in a runtime of choice
        dialogTitle = 'Job submission to ' + runtimeName + ' succeeded';
        dialogBody = (
          <p>
            {response['platform'] === 'APACHE_AIRFLOW' ? (
              <p>
                Apache Airflow DAG 已经被推送到{' '}
                <a
                  href={response['git_url']}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Git 仓库.
                </a>
                <br />
              </p>
            ) : null}
            在{' '}
            <a
              href={response['run_url']}
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              运行详情页面{' '}
            </a>
            查看任务状态。
            {response['object_storage_path'] !== null ? (
              <p>
                输出结果在 {response['object_storage_path']}{' '}
                工作目录下，该目录位于{' '}
                <a
                  href={response['object_storage_url']}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  对象存储URL
                </a>
                。
              </p>
            ) : null}
            <br />
          </p>
        );
      } else {
        // pipeline executed in-place locally
        dialogTitle = '任务执行成功';
        dialogBody = <p>任务已在本地执行。</p>;
      }

      return showDialog({
        title: dialogTitle,
        body: dialogBody,
        buttons: [Dialog.okButton()]
      });
    });
  }

  /**
   * Export a pipeline to different formats (e.g. DSL, YAML, etc). These formats
   * are understood by a given runtime.
   *
   * @param pipeline
   * @param pipeline_export_format
   * @param pipeline_export_path
   * @param overwrite
   */
  static async exportPipeline(
    pipeline: any,
    pipeline_export_format: string,
    pipeline_export_path: string,
    overwrite: boolean
  ): Promise<any> {
    /// to-do
    console.log(
      'Exporting pipeline to [' + pipeline_export_format + '] format'
    );

    console.log('Overwriting existing file: ' + overwrite);

    const body = {
      pipeline: pipeline,
      export_format: pipeline_export_format,
      export_path: pipeline_export_path,
      overwrite: overwrite
    };

    return RequestHandler.makePostRequest(
      'elyra/pipeline/export',
      JSON.stringify(body),
      this.getWaitDialog('正在生成产出文件...'),
      'blob'
    ).then(({ headers, data }: any) => {
      const filename = headers.get('Content-Disposition')?.split('=')[1];
      return showDialog({
        title: 'Pipeline 导出成功',
        body: (
          <p>
            导出文件:{' '}
            <a href={window.URL.createObjectURL(data)} download={filename}>
              {filename}{' '}
            </a>
          </p>
        ),
        buttons: [Dialog.okButton()]
      });
    });
  }

  static getNodeType(filepath: string): string {
    const extension: string = PathExt.extname(filepath);
    const type: string = CONTENT_TYPE_MAPPER.get(extension)!;

    // TODO: throw error when file extension is not supported?
    return type;
  }

  /** 获取 Airflow Pipeline 的所有 Operator */
  static getAirflowAllOperators(): Operator[] {
    let operators = [] as Operator[];
    const categories = componentCatalogsAirflow.categories;
    categories.forEach(c => {
      const nodes = c.node_types.map(({ op, id }) => ({
        catalog: c.id,
        label: id,
        value: op
      }));
      operators.push(...nodes);
    });
    return operators;
  }

  static getAirflowNodeTypes(filepath: string): string[] {
    const extension: string = PathExt.extname(filepath);
    const types: string[] = AIRFLOW_CONTENT_TYPE_MAPPER.get(extension)!;
    return types;
  }

  /**
   * Check if a given file is allowed to be added to the pipeline
   * @param item
   */
  static isSupportedNode(file: any, type = 'local'): boolean {
    // APACHE_AIRFLOW | KUBEFLOW_PIPELINES | local

    if (type === 'APACHE_AIRFLOW') {
      return !!PipelineService.getAirflowNodeTypes(file.path);
    }

    return !!PipelineService.getNodeType(file.path);
  }

  static getPipelineRelativeNodePath(
    pipelinePath: string,
    nodePath: string
  ): string {
    const relativePath: string = PathExt.relative(
      PathExt.dirname(pipelinePath),
      nodePath
    );
    return relativePath;
  }

  static getWorkspaceRelativeNodePath(
    pipelinePath: string,
    nodePath: string
  ): string {
    // since resolve returns an "absolute" path we need to strip off the leading '/'
    const workspacePath: string = PathExt.resolve(
      PathExt.dirname(pipelinePath),
      nodePath
    );
    return workspacePath;
  }

  static setNodePathsRelativeToWorkspace(
    pipeline: any,
    paletteNodes: any[],
    pipelinePath: string
  ): any {
    for (const node of pipeline.nodes) {
      const nodeDef = paletteNodes.find(n => {
        return n.op === node.op;
      });
      const parameters =
        nodeDef.app_data.properties.properties.component_parameters.properties;
      for (const param in parameters) {
        if (parameters[param].uihints?.['ui:widget'] === 'file') {
          node.app_data.component_parameters[param] =
            this.getWorkspaceRelativeNodePath(
              pipelinePath,
              node.app_data.component_parameters[param]
            );
        } else if (
          node.app_data.component_parameters[param]?.widget === 'file'
        ) {
          node.app_data.component_parameters[param].value =
            this.getWorkspaceRelativeNodePath(
              pipelinePath,
              node.app_data.component_parameters[param].value
            );
        }
      }
    }
    return pipeline;
  }
}
