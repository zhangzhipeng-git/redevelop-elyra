/** pipeline 类型枚举 */
export enum PipelineEnum {
  Local = 'local',
  APACHE_AIRFLOW = 'APACHE_AIRFLOW',
  KUBEFLOW_PIPELINES = 'KUBEFLOW_PIPELINES'
}

export type Types =
  | PipelineEnum.APACHE_AIRFLOW
  | PipelineEnum.KUBEFLOW_PIPELINES
  | PipelineEnum.Local;
