/** 应用信息 */
export interface AppInfo {
  /** 应用id */
  applicationId: number;
  /** 应用名称 */
  applicationName: string;
  /** 应用编码 */
  applicationCode: string;
}

/** 应用信息集合 */
export type AppsResponse = AppInfo[];

/** 资源信息请求参数 */
export interface ConnRequest {
  /** 资源类型 */
  type: string;
  /** 应用 id */
  applicationId: number | number;
}

/** 资源信息 */
export interface ConnInfo {
  /** 资源名称 */
  connName: string;
  /** 资源标识 */
  connectionId: number;
  /** 资源编码 */
  connId: string;
  /** 租户空间 */
  nameSpace: string;
}

/** 资源信息集合 */
export type ConnResponse = ConnInfo[];

/** 文件上传请求参数 */
export interface UploadFileRequest {
  file: File;
}

/** 文件上传响应 */
export interface UploadFileResponse {
  /** 文件路径 */
  fileName: string;
  /** 下载路径 */
  url: string;
}

/** 文件删除请求参数 */
export interface RemoveFileRequest {
  /** 文件路径 */
  filePath: string;
}

/** 文件删除响应 */
export type RemoveFileResponse = null;

/** 工作流日志请求参数 */
export interface LogsRequest {
  /** Dagid,工作流的标识，运行按钮返回的数据中提取 */
  dagId: string;
  /** dag运行id，运行按钮返回的数据中提取 */
  dagRunId: string;
  /** 任务task的id，运行按钮返回的数据中提取 */
  taskId: string;
  /** 重试次数，运行按钮返回的数据中提取，默认值：1 */
  taskTryNumber: string;
  taskReturnId: string;
}
/** 工作流日志响应 */
export type LogsResponse = string;

/** 节点运行状态请求参数 */
export interface StatusRequest {
  /** DagId，通过单次运行工作流的接口返回值中获取 */
  dagId: string;
  /** runId，通过单次运行工作流的接口返回值中获取 */
  runId: string;
}

/** 节点任务状态 */
export interface TaskStatus {
  /** 内部节点的标识 */
  taskId: string;
  /** 内部节点的名称 */
  taskName: string;
  /** 内部节点的运行开始时间 */
  start_date: string;
  /** 内部节点的运行状态 */
  state: string;
}
/** 节点运行状态响应 */
export interface StatusResponse {
  /** dagId,工作流的标识 */
  dagId: string;
  /** 工作流运行时分配的标识 */
  dagRunId: string;
  /** 内部节点状态集合数据 */
  showTask: TaskStatus[];
  /** 运行状态说明 */
  state: string;
}

/** 工作流终止运行请求参数 */
export interface CancelRequest {
  /** DagId，通过单次运行工作流的接口返回值中获取 */
  dagId: string;
  /** dag运行id，运行按钮返回的数据中获取 */
  dagRunId: string;
}

/** 工作流终止运行响应 */
export type CancelResponse = null;

/** 工作流基本信息 */
export interface DAG {
  /** 工作流名称 */
  dagName: string;
  /** 归属应用Id,通过应用查询接口提取 */
  applicationId: number;
  /** 告警邮箱 */
  email: string;
  /** 是否流式任务：0否，1是 */
  isStream: number;
  /** 是否重试：0否，1是 */
  whetherRetry: number;
  /** 重试次数 */
  retry: number;
  /** 工作流描述 */
  dagDesc: string;
  /** 调度周期 */
  scheduleInterval: string;
  /** 开始时间 */
  startTime: string;
  /** 归属应用编码，通过应用查询接口提取 */
  applicationCode: string;
}

/** 节点属性 */
export interface Operator {
  /** 任务节点Operator的类型，包含：KubernetesPodOperator、SparkKubernetesOperator两种  */
  operatorType: string;
  /** 工作流任务节点的名字 */
  taskName: string;
  /** 任务类型：包括：java、Python、scala */
  type: string;
  /** 资源id，通过资源信息查询接口提取 */
  connectionId: string;
  /** 链接id，通过资源信息查询接口提取 */
  connId: string;
  /** 租户空间，通过资源信息查询接口提取 */
  namespace: string;
  /** 执行器数量，默认值：1 */
  num_executors: number;
  /** 应用程序主类(仅任务类型为：Java或Scala时需要此项) */
  mainClass: string;
  /** 应用程序的文件路径，通过文件上传接口返回值提取 */
  mainApplicationFile: string;
  /** 应用程序所需cpu：默认值：1 */
  taskCpu: number;
  /** 应用程序所需内存：默认值：2 */
  taskMemory: number;
  /** bash命令 */
  cmds: string;
}

/** 任务依赖关系 */
export interface TaskDependency {
  /** 下游节点任务名称 */
  target: string;
  /** 上游节点任务名称 */
  source: string;
}

/** 工作流单次运行请求参数 */
export interface OperatorRequest {
  /** 工作流全局唯一标识 */
  dagFileUuid: string;
  /** 操作类型：submit：提交工作流，run：运行工作流 */
  operator: string;
  /** 调用方：默认值：redevelop-elyra */
  caller: string;
  /** 工作流基本属性信息 */
  dag: DAG;
  /** 工作流任务节点信息 */
  task: Operator[];
  /** 工作流中任务节点依赖关系信息，内部每个节点连线对应改集合中一个对象 */
  taskDependency: TaskDependency[];
}

/** 运行或提交返回的节点信息 */
export interface TaskTry {
  /** 工作流中任务节点的名称 */
  taskName: string;
  /** 工作流中任务节点的标识 */
  taskId: string;
  /** 工作流中任务节点运行过程中的尝试重试次数 */
  taskTryNumber: number;
  taskReturnId: string;
}

/** 工作流单次运行响应 */
export interface OperatorResponse {
  /** dagId,工作流的id */
  dagId: string;
  /** dagRunId,工作流运行的id */
  dagRunId: string;
  /** 工作流中任务节点的信息 */
  task: TaskTry[];
}
