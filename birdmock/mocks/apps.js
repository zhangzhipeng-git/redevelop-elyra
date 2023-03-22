module.exports = {
  '/api/v1/apps': () => ({
    code: '0',
    msg: null,
    data: [
      {
        applicationId: 1,
        applicationName: '分布式光伏可观可测',
        applicationCode: 'SYS_FBSGFKGKC'
      },
      {
        applicationId: 2,
        applicationName: '电科院最小化推演',
        applicationCode: 'SYS_DKY_ZXHTY'
      }
    ]
  }),
  '/api/v1/conn': params => {
    const id = params.applicationId;
    return {
      code: '0',
      msg: null,
      data: [
        {
          connName: `kubernetes_default_${id}`,
          connectionId: 50,
          connId: `kubernetes_default_${id}`
        },
        {
          connName: `kubernetes_default2_${id}`,
          connectionId: 51,
          connId: `kubernetes_default2_${id}`
        }
      ]
    };
  },
  '/api/v1/uploadFile': () => ({
    code: '0',
    msg: null,
    data: {
      fileName: '%2Ftmp%2Fb3f4c3aa14f87978bab81c20ad7bbc62.jpg',
      url: 'http://xxx.xxx:xxxx/measurementcenter/task/downloadFile?path=%2Ftmp%2Fb3f4c3aa14f87978bab81c20ad7bbc62.jpg'
    }
  }),
  '/api/v1/removeFile': () => ({
    code: '0',
    msg: null,
    data: null
  }),
  '/api/v1/dag/operator': params => {
    console.log(params, params.dagFileUuid);
    return {
      code: '0',
      msg: null,
      data: {
        dagId: `${params.dagFileUuid}`,
        dagRunId: 'sys_xx_test_run_id',
        task: [
          {
            taskName: 'test_task_1',
            taskId: 'sys_xx_test_task_id',
            taskTryNumber: 1
          },
          {
            taskName: 'test_task_2',
            taskId: 'sys_xx_test_task_id_2',
            taskTryNumber: 1
          },
          {
            taskName: 'test_task_3',
            taskId: 'sys_xx_test_task_id_3',
            taskTryNumber: 1
          }
        ]
      }
    };
  },
  '/api/v1/dag/dagRuns/cancel': () => ({
    code: '0',
    msg: null,
    data: null
  }),
  '/api/v1/dag/dagRuns/taskInstances/status': params => ({
    code: '0',
    msg: null,
    data: {
      dagId: `${params.dagId}`,
      dagRunId: 'string',
      task: [
        {
          taskId: '1c10b4a9-7232-4632-8dd5-797aa495884a',
          taskName: 'string',
          start_date: 'string',
          state: ''
        },
        {
          taskId: 'bd54de82-ef99-49a2-85f3-b0c1773565f3',
          taskName: 'string1',
          start_date: 'string1',
          state: 'success'
        },
        {
          taskId: '12b6c341-5e2d-47c2-b561-2a45022286ed',
          taskName: 'string1',
          start_date: 'string1',
          state: 'success'
        },
        {
          taskId: 'cf0896a6-60eb-4c6f-8a9a-7922a16d9152',
          taskName: 'string1',
          start_date: 'string1',
          state: 'success'
        }
      ]
    }
  }),
  '/api/v1/dag/dagRuns/taskInstances/logs': () => ({
    code: '0',
    msg: null,
    data: "[('airflow-cluster-worker-0.airflow-cluster-worker.airflow.svc.cluster.local', '*** Falling back to local log\\n*** Log file does not exist: /opt/airflow/logs/SYS_FBSGFKGKC_CSSJ_746823/task1.task1_1/2023-03-10T06:54:02.830071+00:00/1.log\\n*** Fetching from: http://airflow-cluster-worker-0.airflow-cluster-worker.airflow.svc.cluster.local:8793/log/SYS_FBSGFKGKC_CSSJ_746823/task1.task1_1/2023-03-10T06:54:02.830071+00:00/1.log\\n[2023-03-10 06:54:11,209] {dagrun.py:590} INFO - DagRun Finished: dag_id=SYS_FBSGFKGKC_CSSJ_746823, execution_date=2023-03-10 06:54:02.830071+00:00, run_id=manual__2023-03-10T06:54:02.830071+00:00, run_start_date=2023-03-10 06:54:03.282258+00:00, run_end_date=2023-03-10 06:54:11.209391+00:00, run_duration=7.927133, state=failed, external_trigger=True, run_type=manual, data_interval_start=2023-03-10 06:40:00+00:00, data_interval_end=2023-03-10 06:50:00+00:00, dag_hash=cc21d228edc0b8d0617b7fd27a553931\\n')]"
  })
};
