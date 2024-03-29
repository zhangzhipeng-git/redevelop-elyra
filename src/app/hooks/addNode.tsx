import { Dialog } from '@jupyterlab/apputils';

import { PipelineEnum, Types } from '@src/app/enums';
import { showFormDialog } from '@src/app/ui-components';

import { formDialogWidget } from '@src/app/pipeline-editor/formDialogWidget';
import { OperatorSelect } from '@src/app/pipeline-editor/PipelineAddFileDialog';
import { PipelineService } from '@src/app/pipeline-editor/PipelineService';
import PipelineController from '@src/app/base-pipeline-editor/PipelineController';
import Utils from '../util';
/**
 * 在添加节点前，获取节点的 op ，如：
 * ```
 * KubernetesPodOperator
 * SparkKubernetesOperator
 * ```
 * 用于查询对应的节点模板配置
 * @param type pipeline 类型
 * @param defaultOp 默认的 op
 */
export async function onBeforeAddNode_GetOp(
  type = PipelineEnum.APACHE_AIRFLOW as Types,
  op: string = ''
) {
  switch (type) {
    case PipelineEnum.APACHE_AIRFLOW:
      const ret = await showFormDialog({
        title: '请选择文件要关联的 Operator',
        body: formDialogWidget(
          <OperatorSelect
            operators={PipelineService.getAirflowAllOperators()}
          />
        ),
        buttons: [
          Dialog.cancelButton({ label: '取消' }),
          Dialog.okButton({ label: '确定' })
        ],
        defaultButton: 1,
        focusNodeSelector: '#file_select_operator'
      });
      return ret.value.file_select_operator;

    case PipelineEnum.KUBEFLOW_PIPELINES:
    case PipelineEnum.Local:
    default:
      return op;
  }
}

/**
 * 1. 粘贴节点时，如果连接信息和当前pipeline的连接信息不匹配时
 * 需要重置连接信息并重置为默认值
 * 2. 需要重新生成 taskId
 * @param {string} type pipeline 类型
 * @param {PipelineController} controller pipeline控制器
 */
export function onPasteValidateNodeProperties(
  { type, payload, controller } = {} as {
    type: string;
    controller: PipelineController;
    payload: string[];
  }
) {
  if (type !== PipelineEnum.APACHE_AIRFLOW) return;
  if (!controller) return;
  const pipelineJson = controller.getPipelineFlow() ?? {};
  const pipelineObj = pipelineJson?.pipelines?.[0] ?? {};
  const nodeSchemas = controller.getAllPaletteNodes();
  let changeFlag = false;
  pipelineObj.nodes?.forEach((nodeData: any) => {
    const nodeParams = nodeData.app_data?.component_parameters ?? {};
    const nodeSchema =
      nodeSchemas.find(n => n.op === nodeData.op)?.app_data?.properties
        ?.properties?.component_parameters?.properties ?? {};
    const { connId, connectionId, namespace } = nodeParams;
    const connectionIds = nodeSchema?.connId?.connectionIdEnum ?? [];
    const namespaces = nodeSchema?.connId.namespaceEnum ?? [];
    const connIds = nodeSchema?.connId.enum ?? [];
    const params = nodeData.app_data.component_parameters;

    // 如果连接资源不匹配，则重新赋默认值
    if (
      !connectionIds.includes(connectionId) ||
      !namespaces.includes(namespace) ||
      !connIds.includes(connId)
    ) {
      nodeParams.connectionId = connectionIds[0] ?? '';
      nodeParams.namespace = namespaces[0] ?? '';
      nodeParams.connId = connIds[0] ?? '';
      changeFlag = true;
    }

    // 重新生成 taskId
    if (payload?.includes(nodeData.id) && params) {
      nodeData.app_data.component_parameters.taskId = Utils.randomUUID();
      changeFlag = true;
    }
  });
  if (changeFlag) controller.setPipelineFlow(pipelineJson);
}
