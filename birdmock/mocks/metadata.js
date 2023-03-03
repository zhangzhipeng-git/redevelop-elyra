module.exports = {
  '/elyra/metadata/runtime-images': () => {
    return {
      'runtime-images': [
        {
          name: 'anaconda',
          display_name: 'Anaconda (2021.11) with Python 3.x',
          metadata: {
            description: 'Anaconda 2021.11',
            image_name:
              'continuumio/anaconda3@sha256:a2816acd3acda208d92e0bf6c11eb41fda9009ea20f24e123dbf84bb4bd4c4b8',
            tags: ['anaconda']
          },
          schema_name: 'runtime-image'
        },
        {
          name: 'pandas',
          display_name: 'Pandas 1.4.1',
          metadata: {
            description: 'Pandas 1.4.1',
            image_name:
              'amancevice/pandas@sha256:f74bef70689b19d3cd610ef67227fce1c9a6ed8fa950ac2aff39ce72310d5520',
            tags: ['pandas']
          },
          schema_name: 'runtime-image'
        },
        {
          name: 'pytorch-devel',
          display_name: 'Pytorch 1.4 with CUDA-devel',
          metadata: {
            description: 'PyTorch 1.4 (with GPU support)',
            image_name:
              'pytorch/pytorch@sha256:c612782acc39256aac0637d58d297644066c62f6f84f0b88cfdc335bb25d0d22',
            tags: ['gpu', 'pytorch']
          },
          schema_name: 'runtime-image'
        },
        {
          name: 'pytorch-runtime',
          display_name: 'Pytorch 1.4 with CUDA-runtime',
          metadata: {
            description: 'PyTorch 1.4 (with GPU support)',
            image_name:
              'pytorch/pytorch@sha256:ee783a4c0fccc7317c150450e84579544e171dd01a3f76cf2711262aced85bf7',
            tags: ['gpu', 'pytorch']
          },
          schema_name: 'runtime-image'
        },
        {
          name: 'r',
          display_name: 'R Script',
          metadata: {
            description: 'R Script',
            image_name:
              'jupyter/r-notebook@sha256:08b7c3a1be31deac36cd9d65db6f6a4d58dc0cba32087101f3166d093c1a9c82',
            tags: ['R']
          },
          schema_name: 'runtime-image'
        },
        {
          name: 'tensorflow_2x_gpu_py3',
          display_name: 'Tensorflow 2.8.0 with GPU',
          metadata: {
            description: 'TensorFlow 2.8 (with GPU support)',
            image_name:
              'tensorflow/tensorflow@sha256:1e03623e335aac1610b1a3cfa6a96cf10156acb095287f9d6031df3980148663',
            tags: ['gpu', 'tensorflow']
          },
          schema_name: 'runtime-image'
        },
        {
          name: 'tensorflow_2x_py3',
          display_name: 'Tensorflow 2.8.0',
          metadata: {
            description: 'TensorFlow 2.8',
            image_name:
              'tensorflow/tensorflow@sha256:7c01f75d58fadc2cd1109d5baac1925ed131e05925d840b1b49363c794d1c4db',
            tags: ['tensorflow']
          },
          schema_name: 'runtime-image'
        }
      ]
    };
  },
  '/elyra/metadata/runtime-images/*': () => {},
  '/elyra/metadata/runtimes': () => {
    return {
      runtimes: [
        {
          name: 'apache_airflow_runtime_configuration',
          display_name: 'Apache Airflow runtime configuration',
          metadata: {
            tags: ['tag1', 'tag2'],
            description: 'Description',
            display_name: 'Apache Airflow runtime configuration',
            user_namespace: 'apache-airflow-user-namespace',
            git_type: 'GITHUB',
            github_api_endpoint: 'https://api.github.com',
            api_endpoint: 'https://your-airflow-webserver',
            github_repo: 'user-or-org/dag-repo-name',
            github_branch: 'GitHub or GitLab DAG Repository Branch',
            github_repo_token: 'Personal Access Token',
            cos_auth_type: 'KUBERNETES_SECRET',
            cos_endpoint: 'https://your-cos-service',
            public_cos_endpoint: 'https://your-public-cos-endpoint',
            cos_bucket: 'cloud-object-storage-bucket-name',
            cos_secret: 'Cloud Object Storage Credentials Secret',
            cos_username: 'cloud-object-storage-username',
            cos_password: 'Cloud Object Storage Password',
            runtime_type: 'APACHE_AIRFLOW'
          },
          schema_name: 'airflow'
        },
        {
          name: 'kubeflow_pipelines_runtime_display_name',
          display_name: 'kubeflow_pipelines_runtime_display_name',
          metadata: {
            tags: [],
            description: 'Description',
            display_name: 'kubeflow_pipelines_runtime_display_name',
            engine: 'Tekton',
            auth_type: 'NO_AUTHENTICATION',
            api_endpoint: 'https://your-kubeflow-service/pipeline',
            public_api_endpoint: 'https://your-kubeflow-service/pipeline',
            user_namespace: 'kubeflow-pipelines-user-uamespace',
            cos_auth_type: 'KUBERNETES_SECRET',
            cos_endpoint: 'https://your-cos-service',
            public_cos_endpoint: 'https://your-public-cos-endpoint',
            cos_bucket: 'cloud-object-storage-bucket-name',
            cos_secret: 'Cloud Object Storage Credentials Secret',
            cos_username: 'cloud-object-storage-username',
            cos_password: 'Cloud Object Storage Password',
            runtime_type: 'KUBEFLOW_PIPELINES'
          },
          schema_name: 'kfp'
        }
      ]
    };
  },
  '/elyra/metadata/runtimes/*': () => {},
  '/elyra/metadata/component-catalogs': () => {
    return {
      'component-catalogs': [
        {
          name: 'apache_airflow_package_operator_catalog_component_catalog',
          display_name: 'Apache Airflow 包的算子目录 component catalog',
          metadata: {
            description: 'Airflow 包的算子目录',
            runtime_type: 'APACHE_AIRFLOW',
            display_name: 'Apache Airflow 包的算子目录 component catalog',
            categories: ['Core packages'],
            airflow_package_download_url:
              'https://hostport/path/apache_airflow.whl',
            search_contrib: true,
            auth_id: 'zzp',
            auth_password: '12345678'
          },
          schema_name: 'airflow-package-catalog'
        },
        {
          name: 'apache_airflow_provider_package_operator_catalog_component_catalog_display_name',
          display_name:
            'Apache Airflow provider package operator catalog component catalog display name',
          metadata: {
            description: 'Apache Airflow provider package operator catalog',
            runtime_type: 'APACHE_AIRFLOW',
            display_name:
              'Apache Airflow provider package operator catalog component catalog display name',
            categories: ['provider packages'],
            airflow_provider_package_download_url:
              'https://host/path/provider_package.whl',
            auth_id: 'zzp',
            auth_password: '12345678'
          },
          schema_name: 'airflow-provider-package-catalog'
        },
        {
          name: 'directory_component_catalog_component_catalog_display_name',
          display_name:
            'Directory Component Catalog component catalog display name',
          metadata: {
            description: 'Description',
            display_name:
              'Directory Component Catalog component catalog display name',
            runtime_type: 'APACHE_AIRFLOW',
            categories: ['category name1', 'category name2'],
            paths: ['./src/dir1', './src/dir2'],
            include_subdirs: true
          },
          schema_name: 'local-directory-catalog'
        },
        {
          name: 'filesystem_component_catalog_component_catalog_display_name',
          display_name:
            'Filesystem Component Catalog component catalog display name',
          metadata: {
            description: 'Description',
            display_name:
              'Filesystem Component Catalog component catalog display name',
            runtime_type: 'APACHE_AIRFLOW',
            categories: ['category name1', 'category name2'],
            base_path: './src',
            paths: ['./src/dir1', './src/dir2']
          },
          schema_name: 'local-file-catalog'
        },
        {
          name: 'kubeflow_pipelines_example_components_catalog_component_catalog_display_name',
          display_name:
            'Kubeflow Pipelines example components catalog component catalog display name',
          metadata: {
            description: 'Example pipeline components for Kubeflow Pipelines',
            runtime_type: 'KUBEFLOW_PIPELINES',
            display_name:
              'Kubeflow Pipelines example components catalog component catalog display name',
            categories: ['examples']
          },
          schema_name: 'elyra-kfp-examples-catalog'
        },
        {
          name: 'url_component_catalog_component_catalog',
          display_name: 'URL Component Catalog component catalog',
          metadata: {
            description: 'Description',
            display_name: 'URL Component Catalog component catalog',
            runtime_type: 'APACHE_AIRFLOW',
            categories: ['category name1', 'category name2'],
            paths: ['https://host/path/component_file'],
            auth_id: 'zzp',
            auth_password: '12345678'
          },
          schema_name: 'url-catalog'
        }
      ]
    };
  },
  '/elyra/metadata/component-catalogs/*': () => {},
  '/elyra/pipeline/components/APACHE_AIRFLOW': () => {
    return {
      version: '3.0',
      categories: [
        {
          id: 'Elyra',
          label: 'Elyra',
          node_types: [
            {
              op: 'execute-notebook-node',
              description: 'Run notebook file',
              id: 'notebook',
              image: '',
              label: 'Notebook',
              type: 'execution_node',
              inputs: [
                {
                  id: 'inPort',
                  app_data: {
                    ui_data: {
                      cardinality: {
                        min: 0,
                        max: -1
                      },
                      label: 'Input Port'
                    }
                  }
                }
              ],
              outputs: [
                {
                  id: 'outPort',
                  app_data: {
                    ui_data: {
                      cardinality: {
                        min: 0,
                        max: -1
                      },
                      label: 'Output Port'
                    }
                  }
                }
              ],
              parameters: {},
              app_data: {
                extensions: ['.ipynb'],
                parameter_refs: {
                  filehandler: 'filename'
                },
                image: '',
                ui_data: {
                  description: 'Run notebook file',
                  label: 'Notebook',
                  image: '',
                  x_pos: 0,
                  y_pos: 0
                }
              }
            },
            {
              op: 'execute-python-node',
              description: 'Run Python script',
              id: 'python-script',
              image: '',
              label: 'Python Script',
              type: 'execution_node',
              inputs: [
                {
                  id: 'inPort',
                  app_data: {
                    ui_data: {
                      cardinality: {
                        min: 0,
                        max: -1
                      },
                      label: 'Input Port'
                    }
                  }
                }
              ],
              outputs: [
                {
                  id: 'outPort',
                  app_data: {
                    ui_data: {
                      cardinality: {
                        min: 0,
                        max: -1
                      },
                      label: 'Output Port'
                    }
                  }
                }
              ],
              parameters: {},
              app_data: {
                extensions: ['.py'],
                parameter_refs: {
                  filehandler: 'filename'
                },
                image: '',
                ui_data: {
                  description: 'Run Python script',
                  label: 'Python Script',
                  image: '',
                  x_pos: 0,
                  y_pos: 0
                }
              }
            },
            {
              op: 'execute-r-node',
              description: 'Run R script',
              id: 'r-script',
              image: '',
              label: 'R Script',
              type: 'execution_node',
              inputs: [
                {
                  id: 'inPort',
                  app_data: {
                    ui_data: {
                      cardinality: {
                        min: 0,
                        max: -1
                      },
                      label: 'Input Port'
                    }
                  }
                }
              ],
              outputs: [
                {
                  id: 'outPort',
                  app_data: {
                    ui_data: {
                      cardinality: {
                        min: 0,
                        max: -1
                      },
                      label: 'Output Port'
                    }
                  }
                }
              ],
              parameters: {},
              app_data: {
                extensions: ['.r'],
                parameter_refs: {
                  filehandler: 'filename'
                },
                image: '',
                ui_data: {
                  description: 'Run R script',
                  label: 'R Script',
                  image: '',
                  x_pos: 0,
                  y_pos: 0
                }
              }
            }
          ]
        }
      ]
    };
  },
  '/elyra/pipeline/components/cache': () => {},
  '/elyra/pipeline/components/cache/*': () => {}
};
