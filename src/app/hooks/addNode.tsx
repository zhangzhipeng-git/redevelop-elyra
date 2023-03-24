import { Dialog } from '@jupyterlab/apputils';

import { PipelineEnum, Types } from '@src/app/enums';
import { showFormDialog } from '@src/app/ui-components';

import { formDialogWidget } from '@src/app/pipeline-editor/formDialogWidget';
import { OperatorSelect } from '@src/app/pipeline-editor/PipelineAddFileDialog';
import { PipelineService } from '@src/app/pipeline-editor/PipelineService';
import PipelineController from '@src/app/base-pipeline-editor/PipelineController';

/**
 * 在添加节点前，获取节点的 op ，如：
 * ```
 * execute-KubernetesPodOperator-node
 * execute-SparkKubernetesOperator-node
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

export function onCopyValidateNodeProperties(
  type: string,
  controller: PipelineController,
  payload: string[]
) {
  if (type !== PipelineEnum.APACHE_AIRFLOW) return;
  if (!controller) return;

  const pipelineObj = controller.getPipelineFlow()?.pipelines?.[0] ?? {};
  const nodes = controller.getAllPaletteNodes();
  console.log(payload, pipelineObj, nodes, 'validateNodeProperties');
}
