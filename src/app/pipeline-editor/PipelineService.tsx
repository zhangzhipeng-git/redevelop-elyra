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
import { RequestHandler } from '../services';

import { Dialog } from '@jupyterlab/apputils';
import { PathExt } from '@jupyterlab/coreutils';

import Utils from '@src/app/util';

// 配置项：json数据
import componentCatalogsAirflow from './jsons/airflow-component-catalogs.json';
import airflowPipelineProperties from './jsons/airflow-pipeline-properties.json';
import propertiesAirflowKubernetesPodOperator from './jsons/airflow-KubernetesPodOperator-properties.json';
import propertiesAirflowSparkKubernetesOperator from './jsons/airflow-SparkKubernetesOperator-properties.json';
import runtimeJSON from './jsons/runtime-types.json';

import { svgMap } from '@src/assets/svgs';
import {
  AppsResponse,
  CancelRequest,
  CancelResponse,
  ConnRequest,
  ConnResponse,
  LogsRequest,
  LogsResponse,
  OperatorRequest,
  OperatorResponse,
  RemoveFileRequest,
  RemoveFileResponse,
  StatusRequest,
  StatusResponse,
  UploadFileResponse
} from '@src/app/model';

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
    return svgMap.get(key);
  }

  /**
   * 返回与每个活动运行环境对应的资源列表
   */
  static getRuntimeTypes(): IRuntimeType[] {
    const res = Utils.clone(runtimeJSON);
    res.runtime_types.sort((a: any, b: any) => a.id.localeCompare(b.id));
    return res.runtime_types;
  }

  /**
   * 获取 pipeline 的节点目录
   * @param {string} type pipeline 的类型
   */
  static getComponentCatalogs<T>(type = 'local') {
    return Utils.clone(componentCatalogsAirflow);
  }

  /**
   * 获取 pipeline 的属性配置
   * @param {string} type pipeline 的类型
   */
  static getPipelineProperties<T>(type = 'local') {
    return Utils.clone(airflowPipelineProperties);
  }

  /**
   * 获取节点属性
   * @param {string} type pipeline 运行环境类型
   * @param {string} componentID 组件节点ID
   */
  static getNodeProperties<T>(type = 'local', componentID: string) {
    const fnMap: { [k: string]: () => any } = {
      'APACHE_AIRFLOW-KubernetesPodOperator': () =>
        Utils.clone(propertiesAirflowKubernetesPodOperator),
      'APACHE_AIRFLOW-SparkKubernetesOperator': () =>
        Utils.clone(propertiesAirflowSparkKubernetesOperator)
    };
    const fn = fnMap[`${type}-${componentID}`];
    if (typeof fn == 'function') return fn();
  }

  /** 格式化请求参数，用于get等请求 */
  static _parse(params: any) {
    if (typeof params !== 'object') return params;
    let arr = [] as string[];
    Object.keys(params).forEach((k: string) => {
      let v = params[k];
      if (Array.isArray(v)) v = v.join(',');
      arr.push(`${k}=${v}`);
    });
    return arr.join('&');
  }

  /**
   * 应用查询接口
   */
  static apps() {
    return RequestHandler.makeGetRequest<AppsResponse>(`/api/v1/apps`);
  }

  /**
   * 资源信息查询接口
   * @param {ConnRequest} params
   */
  static conn(params: ConnRequest) {
    return RequestHandler.makeGetRequest<ConnResponse>(
      `/api/v1/conn?${this._parse(params)}`
    );
  }

  /**
   * 文件上传接口
   * @param {FormData} params
   */
  static uploadFile(params: FormData) {
    return RequestHandler.makePostRequest<UploadFileResponse>(
      `/api/v1/uploadFile`,
      params
    );
  }

  /**
   * 文件删除接口
   * @param {RemoveFileRequest} params
   */
  static removeFile(params: RemoveFileRequest) {
    return RequestHandler.makeGetRequest<RemoveFileResponse>(
      `/api/v1/removeFile?${this._parse(params)}`
    );
  }

  /**
   * 工作流-节点实例运行日志查询接口
   * @param {LogsRequest} params
   */
  static logs(params: LogsRequest) {
    return RequestHandler.makePostRequest<LogsResponse>(
      `/api/v1/dag/dagRuns/taskInstances/logs`,
      JSON.stringify(params)
    );
  }

  /**
   * 工作流-节点实例运行状态查询接口，该接口定时轮询
   * @param {StatusRequest} params
   */
  static status(params: StatusRequest) {
    return RequestHandler.makeGetRequest<StatusResponse>(
      `/api/v1/dag/dagRuns/taskInstances/status?${this._parse(params)}`
    );
  }

  /**
   * 工作流终止运行接口
   * @param {CancelRequest} params
   */
  static cancel(params: CancelRequest) {
    return RequestHandler.makeGetRequest<CancelResponse>(
      `/api/v1/dag/dagRuns/cancel?${this._parse(params)}`
    );
  }

  /**
   * 工作流单次运行接口
   * @param {LogsRequest} params
   */
  static operator(params: OperatorRequest) {
    return RequestHandler.makePostRequest<OperatorResponse>(
      `/api/v1/dag/operator`,
      JSON.stringify(params)
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
