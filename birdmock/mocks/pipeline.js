var fs = require('fs');
var path = require('path');
var resolve = p => path.resolve(__dirname, p);

module.exports = {
  '/elyra/pipeline/runtimes/types': () => {
    return {
      runtime_types: [
        {
          id: 'APACHE_AIRFLOW',
          display_name: 'Apache Airflow',
          icon: '/static/elyra/airflow.svg',
          export_file_types: [
            {
              id: 'py',
              display_name: 'Airflow 特定语言 Python 代码'
            }
          ]
        },
        {
          id: 'KUBEFLOW_PIPELINES',
          display_name: 'Kubeflow Pipelines',
          icon: '/static/elyra/kubeflow.svg',
          export_file_types: [
            {
              id: 'yaml',
              display_name: 'KFP 的 yaml 配置文件'
            },
            { id: 'py', display_name: 'Python DSL' }
          ]
        },
        {
          id: 'LOCAL',
          display_name: 'Local',
          icon: '/static/elyra/pipeline-flow.svg',
          export_file_types: []
        }
      ]
    };
  },
  '/elyra/contents/properties/*': () => {
    return {
      env_vars: {},
      inputs: [],
      outputs: []
    };
  },
  '/elyra/pipeline/schedule': () => {
    return {
      git_url: 'http://www.baidu.com',
      run_url: 'http://www.baidu.com',
      platform: 'APACHE_AIRFLOW',
      object_storage_path: '/outputs',
      object_storage_url: 'http://www.baidu.com'
    };
  },
  '/elyra/pipeline/export': () => {
    return {
      filename: 'python.svg',
      buffer: fs.readFileSync(resolve('./assets/python.svg'))
    };
  }
};
