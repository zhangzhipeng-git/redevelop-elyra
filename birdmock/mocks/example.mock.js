module.exports = {
  '/example': params => {
    if (params.id === 1) {
      return {
        status: 200,
        data: {
          content: '我是示例mock返回的数据1'
        }
      };
    } else {
      return {
        status: 400,
        data: {
          content: '我是示例mock返回的数据2'
        }
      };
    }
  },
  '/elyra/schemaspace': () => {
    return {
      schemaspaces: [
        'code-snippets',
        'component-catalogs',
        'runtimes',
        'runtime-images'
      ]
    };
  },
  '/elyra/schema/code-snippets': () => {
    return {
      'code-snippets': [
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/code-snippet.json',
          title: 'Code Snippet',
          name: 'code-snippet',
          schemaspace: 'code-snippets',
          schemaspace_id: 'aa60988f-8f7c-4d09-a243-c54ef9c2f7fb',
          uihints: {
            title: 'Code Snippets',
            icon: 'elyra:code-snippet',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/code-snippets.html'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'code-snippet'
            },
            display_name: {
              title: 'Display Name',
              description: 'The display name of the Code Snippet',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this Code Snippet',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'Code snippet description',
                  type: 'string'
                },
                tags: {
                  title: 'Tags',
                  description: 'Tags for categorizing snippets',
                  type: 'array',
                  uniqueItems: true,
                  items: { minLength: 1, pattern: '^[^ \t]+([ \t]+[^ \t]+)*$' },
                  uihints: { 'ui:field': 'tags' }
                },
                language: {
                  title: 'Language',
                  description: 'Code snippet implementation language',
                  type: 'string',
                  uihints: {
                    'ui:field': 'dropdown',
                    default_choices: [
                      'Python',
                      'Java',
                      'R',
                      'Scala',
                      'Markdown'
                    ],
                    category: 'Source'
                  },
                  minLength: 1
                },
                code: {
                  title: 'Code',
                  description: 'Code snippet code lines',
                  type: 'array',
                  items: { type: 'string' },
                  uihints: { 'ui:field': 'code', category: 'Source' }
                }
              },
              required: ['language', 'code']
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        }
      ]
    };
  },
  '/static/elyra/airflow.svg': () => {
    return '';
  },
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
  '/elyra/pipeline/components/local': () => {
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
                      cardinality: { min: 0, max: -1 },
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
                      cardinality: { min: 0, max: -1 },
                      label: 'Output Port'
                    }
                  }
                }
              ],
              parameters: {},
              app_data: {
                extensions: ['.ipynb'],
                parameter_refs: { filehandler: 'filename' },
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
                      cardinality: { min: 0, max: -1 },
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
                      cardinality: { min: 0, max: -1 },
                      label: 'Output Port'
                    }
                  }
                }
              ],
              parameters: {},
              app_data: {
                extensions: ['.py'],
                parameter_refs: { filehandler: 'filename' },
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
                      cardinality: { min: 0, max: -1 },
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
                      cardinality: { min: 0, max: -1 },
                      label: 'Output Port'
                    }
                  }
                }
              ],
              parameters: {},
              app_data: {
                extensions: ['.r'],
                parameter_refs: { filehandler: 'filename' },
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
  '/elyra/pipeline/local/properties': () => {
    return {
      type: 'object',
      properties: {
        name: {
          title: 'Pipeline Name',
          type: 'string',
          uihints: { 'ui:readonly': true }
        },
        runtime: {
          title: 'Pipeline Runtime',
          type: 'string',
          uihints: { 'ui:readonly': true }
        },
        description: {
          title: 'Pipeline Description',
          type: 'string',
          uihints: {
            'ui:placeholder': 'Pipeline Description',
            'ui:widget': 'textarea'
          }
        },
        pipeline_defaults: {
          type: 'object',
          properties: {
            cos_object_prefix: {
              title: 'Object Storage path prefix',
              type: 'string',
              description:
                'For generic components, this path prefix is used when storing artifacts on Object Storage.',
              uihints: { 'ui:placeholder': 'project/subproject' }
            },
            node_defaults_header: {
              type: 'null',
              title: 'Node Defaults',
              description:
                'Default values are applied to all nodes in this pipeline and can be customized in each node.',
              uihints: { 'ui:field': 'header' }
            },
            kubernetes_tolerations: {
              title: 'Kubernetes Tolerations',
              description:
                'Kubernetes tolerations to apply to the pod where the node is executed.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  operator: {
                    title: 'Operator',
                    type: 'string',
                    default: 'Equal',
                    enum: ['Equal', 'Exists']
                  },
                  value: { title: 'Value', type: 'string', default: '' },
                  effect: {
                    title: 'Effect',
                    type: 'string',
                    default: '',
                    enum: ['', 'NoExecute', 'NoSchedule', 'PreferNoSchedule']
                  }
                },
                required: ['operator']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'key' },
                  value: { 'ui:placeholder': 'value' },
                  effect: { 'ui:placeholder': 'NoSchedule' }
                }
              }
            },
            mounted_volumes: {
              title: 'Data Volumes',
              description:
                'Volumes to be mounted in this node. The specified Persistent Volume Claims must exist in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  path: { title: 'Mount Path', type: 'string', default: '' },
                  pvc_name: {
                    title: 'Persistent Volume Claim Name',
                    type: 'string',
                    default: ''
                  },
                  sub_path: { title: 'Sub Path', type: 'string', default: '' },
                  read_only: {
                    title: 'Mount volume read-only',
                    type: 'boolean',
                    default: false
                  }
                },
                required: ['path', 'pvc_name']
              },
              uihints: {
                items: {
                  path: { 'ui:placeholder': '/mount/path' },
                  pvc_name: { 'ui:placeholder': 'pvc-name' },
                  sub_path: { 'ui:placeholder': 'relative/path/within/volume' },
                  read_only: { 'ui:placeholder': ' ' }
                }
              }
            },
            kubernetes_pod_annotations: {
              title: 'Kubernetes Pod Annotations',
              description:
                'Metadata to be added to this node. The metadata is exposed as annotation in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'annotation_key' },
                  value: { 'ui:placeholder': 'annotation_value' }
                }
              }
            },
            kubernetes_pod_labels: {
              title: 'Kubernetes Pod Labels',
              description:
                'Metadata to be added to this node. The metadata is exposed as label in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'label_key' },
                  value: { 'ui:placeholder': 'label_value' }
                }
              }
            },
            kubernetes_shared_mem_size: {
              title: 'Shared Memory Size',
              description:
                'Configure a custom shared memory size in gigabytes (10^9 bytes) for the pod that executes a node. A custom value is assigned if the size property value is a number greater than zero.',
              type: 'object',
              properties: {
                size: { title: 'Memory Size (GB)', type: 'integer', minimum: 0 }
              },
              required: [],
              uihints: { size: { 'ui:placeholder': 0 } }
            },
            generic_node_defaults_header: {
              type: 'null',
              title: 'Generic Node Defaults',
              description:
                'Default values are applied to all generic nodes in this pipeline and can be customized in each node.',
              uihints: { 'ui:field': 'header' }
            },
            runtime_image: {
              title: 'Runtime Image',
              description: 'Container image used as execution environment.',
              type: 'string'
            },
            env_vars: {
              title: 'Environment Variables',
              description:
                'Environment variables to be set on the execution environment.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['env_var']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  value: { 'ui:placeholder': 'value' }
                },
                canRefresh: true
              }
            },
            kubernetes_secrets: {
              title: 'Kubernetes Secrets',
              description:
                'Kubernetes secrets to make available as environment variables to this node. The secret name and key given must be present in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  name: { title: 'Secret Name', type: 'string', default: '' },
                  key: { title: 'Secret Key', type: 'string', default: '' }
                },
                required: ['env_var', 'name', 'key']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  name: { 'ui:placeholder': 'secret-name' },
                  key: { 'ui:placeholder': 'secret-key' }
                }
              }
            },
            custom_node_defaults_header: {
              type: 'null',
              title: 'Custom Node Defaults',
              description:
                'Default values are applied to all custom nodes in this pipeline and can be customized in each node.',
              uihints: { 'ui:field': 'header' }
            },
            disable_node_caching: {
              title: 'Disable node caching',
              description:
                'Disable caching to force node re-execution in the target runtime environment.',
              type: 'string',
              enum: ['True', 'False'],
              uihints: { 'ui:placeholder': 'Use runtime default' }
            }
          }
        }
      }
    };
  },
  '/elyra/pipeline/local/parameters': () => {
    return {
      message:
        "Runtime processor type 'Local' does not support pipeline parameters."
    };
  },
  '/elyra/pipeline/components/local/notebook/properties': () => {
    return {
      type: 'object',
      properties: {
        label: {
          title: 'Label',
          description: 'A custom label for the node.',
          type: 'string'
        },
        component_parameters: {
          type: 'object',
          properties: {
            inputs_header: {
              type: 'null',
              title: 'Inputs',
              description: 'Input properties for this component.',
              uihints: { 'ui:field': 'header' }
            },
            filename: {
              type: 'string',
              title: 'Filename',
              description: 'The path to the Notebook.',
              uihints: { 'ui:widget': 'file', extensions: ['.ipynb'] }
            },
            runtime_image: {
              type: 'string',
              title: 'Runtime Image',
              required: true,
              description: 'Container image used as execution environment.',
              uihints: { items: [] }
            },
            cpu: {
              type: 'integer',
              title: 'CPU',
              description:
                'For CPU-intensive workloads, you can choose more than 1 CPU (e.g. 1.5).',
              minimum: 0
            },
            memory: {
              type: 'integer',
              title: 'RAM(GB)',
              description: 'The total amount of RAM specified.',
              minimum: 0
            },
            gpu: {
              type: 'integer',
              title: 'GPU',
              description:
                'For GPU-intensive workloads, you can choose more than 1 GPU. Must be an integer.',
              minimum: 0
            },
            gpu_vendor: {
              type: 'string',
              title: 'GPU Vendor',
              description:
                "GPU Vendor, or K8s GPU resource type, default 'nvidia.com/gpu'.",
              uihints: { 'ui:placeholder': 'nvidia.com/gpu' }
            },
            dependencies: {
              title: 'File Dependencies',
              description:
                'Local file dependencies that need to be copied to remote execution environment.',
              type: 'array',
              items: { type: 'string', default: '' },
              default: [],
              uihints: { files: true, items: { 'ui:placeholder': '*.py' } }
            },
            include_subdirectories: {
              type: 'boolean',
              title: 'Include Subdirectories',
              description:
                'Recursively include subdirectories when submitting a pipeline (This may increase submission time).',
              default: false
            },
            outputs_header: {
              type: 'null',
              title: 'Outputs',
              description: 'Outputs produced by this component.',
              uihints: { 'ui:field': 'header' }
            },
            outputs: {
              title: 'Output Files',
              description:
                'Files generated during execution that will become available to all subsequent pipeline steps.',
              type: 'array',
              items: { type: 'string', default: '' },
              default: [],
              uihints: { items: { 'ui:placeholder': '*.csv' } }
            },
            additional_properties_header: {
              type: 'null',
              title: 'Additional Properties',
              description:
                'Additional properties used by Elyra that are not given in the component definition.',
              uihints: { 'ui:field': 'header' }
            },
            env_vars: {
              title: 'Environment Variables',
              description:
                'Environment variables to be set on the execution environment.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['env_var']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  value: { 'ui:placeholder': 'value' }
                },
                canRefresh: true
              }
            },
            kubernetes_pod_annotations: {
              title: 'Kubernetes Pod Annotations',
              description:
                'Metadata to be added to this node. The metadata is exposed as annotation in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'annotation_key' },
                  value: { 'ui:placeholder': 'annotation_value' }
                }
              }
            },
            kubernetes_pod_labels: {
              title: 'Kubernetes Pod Labels',
              description:
                'Metadata to be added to this node. The metadata is exposed as label in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'label_key' },
                  value: { 'ui:placeholder': 'label_value' }
                }
              }
            },
            kubernetes_secrets: {
              title: 'Kubernetes Secrets',
              description:
                'Kubernetes secrets to make available as environment variables to this node. The secret name and key given must be present in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  name: { title: 'Secret Name', type: 'string', default: '' },
                  key: { title: 'Secret Key', type: 'string', default: '' }
                },
                required: ['env_var', 'name', 'key']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  name: { 'ui:placeholder': 'secret-name' },
                  key: { 'ui:placeholder': 'secret-key' }
                }
              }
            },
            kubernetes_shared_mem_size: {
              title: 'Shared Memory Size',
              description:
                'Configure a custom shared memory size in gigabytes (10^9 bytes) for the pod that executes a node. A custom value is assigned if the size property value is a number greater than zero.',
              type: 'object',
              properties: {
                size: { title: 'Memory Size (GB)', type: 'integer', minimum: 0 }
              },
              required: [],
              uihints: { size: { 'ui:placeholder': 0 } }
            },
            kubernetes_tolerations: {
              title: 'Kubernetes Tolerations',
              description:
                'Kubernetes tolerations to apply to the pod where the node is executed.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  operator: {
                    title: 'Operator',
                    type: 'string',
                    default: 'Equal',
                    enum: ['Equal', 'Exists']
                  },
                  value: { title: 'Value', type: 'string', default: '' },
                  effect: {
                    title: 'Effect',
                    type: 'string',
                    default: '',
                    enum: ['', 'NoExecute', 'NoSchedule', 'PreferNoSchedule']
                  }
                },
                required: ['operator']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'key' },
                  value: { 'ui:placeholder': 'value' },
                  effect: { 'ui:placeholder': 'NoSchedule' }
                }
              }
            },
            mounted_volumes: {
              title: 'Data Volumes',
              description:
                'Volumes to be mounted in this node. The specified Persistent Volume Claims must exist in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  path: { title: 'Mount Path', type: 'string', default: '' },
                  pvc_name: {
                    title: 'Persistent Volume Claim Name',
                    type: 'string',
                    default: ''
                  },
                  sub_path: { title: 'Sub Path', type: 'string', default: '' },
                  read_only: {
                    title: 'Mount volume read-only',
                    type: 'boolean',
                    default: false
                  }
                },
                required: ['path', 'pvc_name']
              },
              uihints: {
                items: {
                  path: { 'ui:placeholder': '/mount/path' },
                  pvc_name: { 'ui:placeholder': 'pvc-name' },
                  sub_path: { 'ui:placeholder': 'relative/path/within/volume' },
                  read_only: { 'ui:placeholder': ' ' }
                }
              }
            }
          },
          required: ['filename', 'runtime_image']
        }
      },
      required: ['component_parameters']
    };
  },
  '/elyra/pipeline/components/local/python-script/properties': () => {
    return {
      type: 'object',
      properties: {
        label: {
          title: 'Label',
          description: 'A custom label for the node.',
          type: 'string'
        },
        component_parameters: {
          type: 'object',
          properties: {
            inputs_header: {
              type: 'null',
              title: 'Inputs',
              description: 'Input properties for this component.',
              uihints: { 'ui:field': 'header' }
            },
            filename: {
              type: 'string',
              title: 'Filename',
              description: 'The path to the Python Script.',
              uihints: { 'ui:widget': 'file', extensions: ['.py'] }
            },
            runtime_image: {
              type: 'string',
              title: 'Runtime Image',
              required: true,
              description: 'Container image used as execution environment.',
              uihints: { items: [] }
            },
            cpu: {
              type: 'integer',
              title: 'CPU',
              description:
                'For CPU-intensive workloads, you can choose more than 1 CPU (e.g. 1.5).',
              minimum: 0
            },
            memory: {
              type: 'integer',
              title: 'RAM(GB)',
              description: 'The total amount of RAM specified.',
              minimum: 0
            },
            gpu: {
              type: 'integer',
              title: 'GPU',
              description:
                'For GPU-intensive workloads, you can choose more than 1 GPU. Must be an integer.',
              minimum: 0
            },
            gpu_vendor: {
              type: 'string',
              title: 'GPU Vendor',
              description:
                "GPU Vendor, or K8s GPU resource type, default 'nvidia.com/gpu'.",
              uihints: { 'ui:placeholder': 'nvidia.com/gpu' }
            },
            dependencies: {
              title: 'File Dependencies',
              description:
                'Local file dependencies that need to be copied to remote execution environment.',
              type: 'array',
              items: { type: 'string', default: '' },
              default: [],
              uihints: { files: true, items: { 'ui:placeholder': '*.py' } }
            },
            include_subdirectories: {
              type: 'boolean',
              title: 'Include Subdirectories',
              description:
                'Recursively include subdirectories when submitting a pipeline (This may increase submission time).',
              default: false
            },
            outputs_header: {
              type: 'null',
              title: 'Outputs',
              description: 'Outputs produced by this component.',
              uihints: { 'ui:field': 'header' }
            },
            outputs: {
              title: 'Output Files',
              description:
                'Files generated during execution that will become available to all subsequent pipeline steps.',
              type: 'array',
              items: { type: 'string', default: '' },
              default: [],
              uihints: { items: { 'ui:placeholder': '*.csv' } }
            },
            additional_properties_header: {
              type: 'null',
              title: 'Additional Properties',
              description:
                'Additional properties used by Elyra that are not given in the component definition.',
              uihints: { 'ui:field': 'header' }
            },
            env_vars: {
              title: 'Environment Variables',
              description:
                'Environment variables to be set on the execution environment.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['env_var']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  value: { 'ui:placeholder': 'value' }
                },
                canRefresh: true
              }
            },
            kubernetes_pod_annotations: {
              title: 'Kubernetes Pod Annotations',
              description:
                'Metadata to be added to this node. The metadata is exposed as annotation in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'annotation_key' },
                  value: { 'ui:placeholder': 'annotation_value' }
                }
              }
            },
            kubernetes_pod_labels: {
              title: 'Kubernetes Pod Labels',
              description:
                'Metadata to be added to this node. The metadata is exposed as label in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'label_key' },
                  value: { 'ui:placeholder': 'label_value' }
                }
              }
            },
            kubernetes_secrets: {
              title: 'Kubernetes Secrets',
              description:
                'Kubernetes secrets to make available as environment variables to this node. The secret name and key given must be present in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  name: { title: 'Secret Name', type: 'string', default: '' },
                  key: { title: 'Secret Key', type: 'string', default: '' }
                },
                required: ['env_var', 'name', 'key']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  name: { 'ui:placeholder': 'secret-name' },
                  key: { 'ui:placeholder': 'secret-key' }
                }
              }
            },
            kubernetes_shared_mem_size: {
              title: 'Shared Memory Size',
              description:
                'Configure a custom shared memory size in gigabytes (10^9 bytes) for the pod that executes a node. A custom value is assigned if the size property value is a number greater than zero.',
              type: 'object',
              properties: {
                size: { title: 'Memory Size (GB)', type: 'integer', minimum: 0 }
              },
              required: [],
              uihints: { size: { 'ui:placeholder': 0 } }
            },
            kubernetes_tolerations: {
              title: 'Kubernetes Tolerations',
              description:
                'Kubernetes tolerations to apply to the pod where the node is executed.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  operator: {
                    title: 'Operator',
                    type: 'string',
                    default: 'Equal',
                    enum: ['Equal', 'Exists']
                  },
                  value: { title: 'Value', type: 'string', default: '' },
                  effect: {
                    title: 'Effect',
                    type: 'string',
                    default: '',
                    enum: ['', 'NoExecute', 'NoSchedule', 'PreferNoSchedule']
                  }
                },
                required: ['operator']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'key' },
                  value: { 'ui:placeholder': 'value' },
                  effect: { 'ui:placeholder': 'NoSchedule' }
                }
              }
            },
            mounted_volumes: {
              title: 'Data Volumes',
              description:
                'Volumes to be mounted in this node. The specified Persistent Volume Claims must exist in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  path: { title: 'Mount Path', type: 'string', default: '' },
                  pvc_name: {
                    title: 'Persistent Volume Claim Name',
                    type: 'string',
                    default: ''
                  },
                  sub_path: { title: 'Sub Path', type: 'string', default: '' },
                  read_only: {
                    title: 'Mount volume read-only',
                    type: 'boolean',
                    default: false
                  }
                },
                required: ['path', 'pvc_name']
              },
              uihints: {
                items: {
                  path: { 'ui:placeholder': '/mount/path' },
                  pvc_name: { 'ui:placeholder': 'pvc-name' },
                  sub_path: { 'ui:placeholder': 'relative/path/within/volume' },
                  read_only: { 'ui:placeholder': ' ' }
                }
              }
            }
          },
          required: ['filename', 'runtime_image']
        }
      },
      required: ['component_parameters']
    };
  },
  '/elyra/pipeline/components/local/r-script/properties': () => {
    return {
      type: 'object',
      properties: {
        label: {
          title: 'Label',
          description: 'A custom label for the node.',
          type: 'string'
        },
        component_parameters: {
          type: 'object',
          properties: {
            inputs_header: {
              type: 'null',
              title: 'Inputs',
              description: 'Input properties for this component.',
              uihints: { 'ui:field': 'header' }
            },
            filename: {
              type: 'string',
              title: 'Filename',
              description: 'The path to the R Script.',
              uihints: { 'ui:widget': 'file', extensions: ['.r'] }
            },
            runtime_image: {
              type: 'string',
              title: 'Runtime Image',
              required: true,
              description: 'Container image used as execution environment.',
              uihints: { items: [] }
            },
            cpu: {
              type: 'integer',
              title: 'CPU',
              description:
                'For CPU-intensive workloads, you can choose more than 1 CPU (e.g. 1.5).',
              minimum: 0
            },
            memory: {
              type: 'integer',
              title: 'RAM(GB)',
              description: 'The total amount of RAM specified.',
              minimum: 0
            },
            gpu: {
              type: 'integer',
              title: 'GPU',
              description:
                'For GPU-intensive workloads, you can choose more than 1 GPU. Must be an integer.',
              minimum: 0
            },
            gpu_vendor: {
              type: 'string',
              title: 'GPU Vendor',
              description:
                "GPU Vendor, or K8s GPU resource type, default 'nvidia.com/gpu'.",
              uihints: { 'ui:placeholder': 'nvidia.com/gpu' }
            },
            dependencies: {
              title: 'File Dependencies',
              description:
                'Local file dependencies that need to be copied to remote execution environment.',
              type: 'array',
              items: { type: 'string', default: '' },
              default: [],
              uihints: { files: true, items: { 'ui:placeholder': '*.py' } }
            },
            include_subdirectories: {
              type: 'boolean',
              title: 'Include Subdirectories',
              description:
                'Recursively include subdirectories when submitting a pipeline (This may increase submission time).',
              default: false
            },
            outputs_header: {
              type: 'null',
              title: 'Outputs',
              description: 'Outputs produced by this component.',
              uihints: { 'ui:field': 'header' }
            },
            outputs: {
              title: 'Output Files',
              description:
                'Files generated during execution that will become available to all subsequent pipeline steps.',
              type: 'array',
              items: { type: 'string', default: '' },
              default: [],
              uihints: { items: { 'ui:placeholder': '*.csv' } }
            },
            additional_properties_header: {
              type: 'null',
              title: 'Additional Properties',
              description:
                'Additional properties used by Elyra that are not given in the component definition.',
              uihints: { 'ui:field': 'header' }
            },
            env_vars: {
              title: 'Environment Variables',
              description:
                'Environment variables to be set on the execution environment.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['env_var']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  value: { 'ui:placeholder': 'value' }
                },
                canRefresh: true
              }
            },
            kubernetes_pod_annotations: {
              title: 'Kubernetes Pod Annotations',
              description:
                'Metadata to be added to this node. The metadata is exposed as annotation in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'annotation_key' },
                  value: { 'ui:placeholder': 'annotation_value' }
                }
              }
            },
            kubernetes_pod_labels: {
              title: 'Kubernetes Pod Labels',
              description:
                'Metadata to be added to this node. The metadata is exposed as label in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'label_key' },
                  value: { 'ui:placeholder': 'label_value' }
                }
              }
            },
            kubernetes_secrets: {
              title: 'Kubernetes Secrets',
              description:
                'Kubernetes secrets to make available as environment variables to this node. The secret name and key given must be present in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  name: { title: 'Secret Name', type: 'string', default: '' },
                  key: { title: 'Secret Key', type: 'string', default: '' }
                },
                required: ['env_var', 'name', 'key']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  name: { 'ui:placeholder': 'secret-name' },
                  key: { 'ui:placeholder': 'secret-key' }
                }
              }
            },
            kubernetes_shared_mem_size: {
              title: 'Shared Memory Size',
              description:
                'Configure a custom shared memory size in gigabytes (10^9 bytes) for the pod that executes a node. A custom value is assigned if the size property value is a number greater than zero.',
              type: 'object',
              properties: {
                size: { title: 'Memory Size (GB)', type: 'integer', minimum: 0 }
              },
              required: [],
              uihints: { size: { 'ui:placeholder': 0 } }
            },
            kubernetes_tolerations: {
              title: 'Kubernetes Tolerations',
              description:
                'Kubernetes tolerations to apply to the pod where the node is executed.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  operator: {
                    title: 'Operator',
                    type: 'string',
                    default: 'Equal',
                    enum: ['Equal', 'Exists']
                  },
                  value: { title: 'Value', type: 'string', default: '' },
                  effect: {
                    title: 'Effect',
                    type: 'string',
                    default: '',
                    enum: ['', 'NoExecute', 'NoSchedule', 'PreferNoSchedule']
                  }
                },
                required: ['operator']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'key' },
                  value: { 'ui:placeholder': 'value' },
                  effect: { 'ui:placeholder': 'NoSchedule' }
                }
              }
            },
            mounted_volumes: {
              title: 'Data Volumes',
              description:
                'Volumes to be mounted in this node. The specified Persistent Volume Claims must exist in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  path: { title: 'Mount Path', type: 'string', default: '' },
                  pvc_name: {
                    title: 'Persistent Volume Claim Name',
                    type: 'string',
                    default: ''
                  },
                  sub_path: { title: 'Sub Path', type: 'string', default: '' },
                  read_only: {
                    title: 'Mount volume read-only',
                    type: 'boolean',
                    default: false
                  }
                },
                required: ['path', 'pvc_name']
              },
              uihints: {
                items: {
                  path: { 'ui:placeholder': '/mount/path' },
                  pvc_name: { 'ui:placeholder': 'pvc-name' },
                  sub_path: { 'ui:placeholder': 'relative/path/within/volume' },
                  read_only: { 'ui:placeholder': ' ' }
                }
              }
            }
          },
          required: ['filename', 'runtime_image']
        }
      },
      required: ['component_parameters']
    };
  },
  '/elyra/pipeline/runtimes/types': () => {
    return {
      runtime_types: [
        {
          id: 'APACHE_AIRFLOW',
          display_name: 'Apache Airflow',
          icon: 'static/elyra/airflow.svg',
          export_file_types: [
            {
              id: 'py',
              display_name: 'Airflow domain-specific language Python code'
            }
          ]
        },
        {
          id: 'KUBEFLOW_PIPELINES',
          display_name: 'Kubeflow Pipelines',
          icon: 'static/elyra/kubeflow.svg',
          export_file_types: [
            {
              id: 'yaml',
              display_name: 'KFP static configuration file (YAML formatted)'
            },
            { id: 'py', display_name: 'Python DSL' }
          ]
        },
        {
          id: 'LOCAL',
          display_name: 'Local',
          icon: 'static/elyra/pipeline-flow.svg',
          export_file_types: []
        }
      ]
    };
  },
  '/elyra/schema/runtimes': () => {
    return {
      runtimes: [
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/airflow.json',
          title: 'Apache Airflow',
          name: 'airflow',
          schemaspace: 'runtimes',
          schemaspace_id: '130b8e00-de7c-4b32-b553-b4a52824a3b5',
          metadata_class_name:
            'elyra.pipeline.airflow.airflow_metadata.AirflowMetadata',
          runtime_type: 'APACHE_AIRFLOW',
          uihints: {
            title: 'Apache Airflow runtimes',
            icon: 'elyra:runtimes',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/runtime-conf.html'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'airflow'
            },
            display_name: {
              title: 'Display Name',
              description: 'Display name of this Apache Airflow configuration',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                runtime_type: {
                  title: 'Runtime Type',
                  description: 'The runtime associated with this instance',
                  type: 'string',
                  const: 'APACHE_AIRFLOW',
                  uihints: { hidden: true }
                },
                description: {
                  title: 'Description',
                  description:
                    'Description of this Apache Airflow configuration',
                  type: 'string'
                },
                api_endpoint: {
                  title: 'Apache Airflow UI Endpoint',
                  description: 'The Apache Airflow UI endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Apache Airflow',
                    'ui:placeholder': 'https://your-airflow-webserver:port'
                  }
                },
                user_namespace: {
                  title: 'Apache Airflow User Namespace',
                  description:
                    'The Apache Airflow user namespace used to run DAG workflows',
                  type: 'string',
                  pattern: '^[a-z0-9][-a-z0-9]*[a-z0-9]$',
                  maxLength: 63,
                  default: 'default',
                  uihints: { category: 'Apache Airflow' }
                },
                git_type: {
                  title: 'Git type',
                  description: 'Git provider',
                  type: 'string',
                  enum: ['GITHUB'],
                  default: 'GITHUB',
                  uihints: { category: 'Apache Airflow' }
                },
                github_api_endpoint: {
                  title: 'GitHub or GitLab server API Endpoint',
                  description:
                    'The GitHub or GitLab server URL / API endpoint - Public or Enterprise',
                  type: 'string',
                  format: 'uri',
                  default: 'https://api.github.com',
                  uihints: {
                    category: 'Apache Airflow',
                    'ui:placeholder': 'https://your-github-or-gitlab-endpoint'
                  }
                },
                github_repo: {
                  title: 'GitHub or GitLab DAG Repository',
                  description: 'Existing repository where DAGs are stored',
                  type: 'string',
                  uihints: {
                    category: 'Apache Airflow',
                    'ui:placeholder': 'user-or-org/dag-repo-name'
                  }
                },
                github_branch: {
                  title: 'GitHub or GitLab DAG Repository Branch',
                  description:
                    'Existing branch in the repository where DAGs are stored',
                  type: 'string',
                  uihints: { category: 'Apache Airflow' }
                },
                github_repo_token: {
                  title: 'Personal Access Token',
                  description:
                    'Token that has permission to push to the DAG repository',
                  type: 'string',
                  uihints: {
                    'ui:field': 'password',
                    category: 'Apache Airflow'
                  }
                },
                cos_endpoint: {
                  title: 'Cloud Object Storage Endpoint',
                  description: 'The Cloud Object Storage endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Cloud Object Storage',
                    'ui:placeholder': 'https://your-cos-service:port'
                  }
                },
                public_cos_endpoint: {
                  title: 'Public Cloud Object Storage Endpoint',
                  description: 'The public Cloud Object Storage endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Cloud Object Storage',
                    'ui:placeholder': 'https://your-public-cos-endpoint:port'
                  }
                },
                cos_bucket: {
                  title: 'Cloud Object Storage Bucket Name',
                  description: 'The Cloud Object Storage bucket name',
                  type: 'string',
                  pattern: '^[a-z0-9][a-z0-9-.]*[a-z0-9]$',
                  minLength: 3,
                  maxLength: 222,
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_auth_type: {
                  title: 'Cloud Object Storage Authentication Type',
                  description:
                    'Authentication type Elyra uses to authenticate with Cloud Object Storage',
                  type: 'string',
                  enum: [
                    'AWS_IAM_ROLES_FOR_SERVICE_ACCOUNTS',
                    'KUBERNETES_SECRET',
                    'USER_CREDENTIALS'
                  ],
                  default: 'USER_CREDENTIALS',
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_secret: {
                  title: 'Cloud Object Storage Credentials Secret',
                  description:
                    "Kubernetes secret that's defined in the specified user namespace, containing the Cloud Object Storage username and password. This property is required for authentication type KUBERNETES_SECRET.",
                  type: 'string',
                  uihints: {
                    'ui:field': 'password',
                    category: 'Cloud Object Storage'
                  }
                },
                cos_username: {
                  title: 'Cloud Object Storage Username',
                  description:
                    'The Cloud Object Storage username. This property is required for authentication type USER_CREDENTIALS and KUBERNETES_SECRET.',
                  type: 'string',
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_password: {
                  title: 'Cloud Object Storage Password',
                  description:
                    'The Cloud Object Storage password. This property is required for authentication type USER_CREDENTIALS and KUBERNETES_SECRET.',
                  type: 'string',
                  minLength: 8,
                  uihints: {
                    'ui:field': 'password',
                    category: 'Cloud Object Storage'
                  }
                },
                tags: {
                  title: 'Tags',
                  description: 'Tags for categorizing Apache Airflow',
                  uniqueItems: true,
                  type: 'array',
                  items: { minLength: 1, pattern: '^[^ \t]+([ \t]+[^ \t]+)*$' },
                  uihints: { 'ui:field': 'tags' }
                }
              },
              required: [
                'api_endpoint',
                'cos_endpoint',
                'cos_auth_type',
                'cos_bucket',
                'github_api_endpoint',
                'github_branch',
                'github_repo_token',
                'github_repo'
              ]
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        },
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/kfp.json',
          title: 'Kubeflow Pipelines',
          name: 'kfp',
          schemaspace: 'runtimes',
          schemaspace_id: '130b8e00-de7c-4b32-b553-b4a52824a3b5',
          metadata_class_name: 'elyra.pipeline.kfp.kfp_metadata.KfpMetadata',
          runtime_type: 'KUBEFLOW_PIPELINES',
          uihints: {
            title: 'Kubeflow Pipelines runtimes',
            icon: 'elyra:runtimes',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/runtime-conf.html'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'kfp'
            },
            display_name: {
              title: 'Display Name',
              description:
                'Display name of this Kubeflow Pipelines configuration',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                runtime_type: {
                  title: 'Runtime Type',
                  description: 'The runtime associated with this instance',
                  type: 'string',
                  const: 'KUBEFLOW_PIPELINES',
                  uihints: { hidden: true }
                },
                description: {
                  title: 'Description',
                  description:
                    'Description of this Kubeflow Pipelines configuration',
                  type: 'string'
                },
                api_endpoint: {
                  title: 'Kubeflow Pipelines API Endpoint',
                  description: 'The Kubeflow Pipelines API endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Kubeflow Pipelines',
                    'ui:placeholder':
                      'https://your-kubeflow-service:port/pipeline'
                  }
                },
                public_api_endpoint: {
                  title: 'Public Kubeflow Pipelines API Endpoint',
                  description: 'The public Kubeflow Pipelines API endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Kubeflow Pipelines',
                    'ui:placeholder':
                      'https://your-kubeflow-service:port/pipeline'
                  }
                },
                user_namespace: {
                  title: 'Kubeflow Pipelines User Namespace',
                  description:
                    'The Kubeflow Pipelines user namespace used to create experiments',
                  type: 'string',
                  pattern: '^[a-z0-9][-a-z0-9]*[a-z0-9]$',
                  maxLength: 63,
                  uihints: { category: 'Kubeflow Pipelines' }
                },
                engine: {
                  title: 'Kubeflow Pipelines engine',
                  description: 'The Kubeflow Pipelines engine in use',
                  type: 'string',
                  enum: ['Argo'],
                  default: 'Argo',
                  uihints: { category: 'Kubeflow Pipelines' }
                },
                auth_type: {
                  title: 'Authentication Type',
                  description:
                    'Authentication type Elyra uses to authenticate with Kubeflow',
                  type: 'string',
                  enum: [
                    'NO_AUTHENTICATION',
                    'KUBERNETES_SERVICE_ACCOUNT_TOKEN',
                    'DEX_STATIC_PASSWORDS',
                    'DEX_LDAP',
                    'DEX_LEGACY'
                  ],
                  default: 'NO_AUTHENTICATION',
                  uihints: { category: 'Kubeflow Pipelines' }
                },
                api_username: {
                  title: 'Kubeflow Pipelines API Endpoint Username',
                  description:
                    'The Kubeflow Pipelines API endpoint username. This property is required for all authentication types, except NO_AUTHENTICATION and KUBERNETES_SERVICE_ACCOUNT_TOKEN.',
                  type: 'string',
                  uihints: { category: 'Kubeflow Pipelines' }
                },
                api_password: {
                  title: 'Kubeflow Pipelines API Endpoint Password',
                  description:
                    'Password for the specified username. This property is required for all authentication types, except NO_AUTHENTICATION and KUBERNETES_SERVICE_ACCOUNT_TOKEN.',
                  type: 'string',
                  uihints: {
                    'ui:field': 'password',
                    category: 'Kubeflow Pipelines'
                  }
                },
                cos_endpoint: {
                  title: 'Cloud Object Storage Endpoint',
                  description: 'The Cloud Object Storage endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Cloud Object Storage',
                    'ui:placeholder': 'https://your-cos-service:port'
                  }
                },
                public_cos_endpoint: {
                  title: 'Public Cloud Object Storage Endpoint',
                  description: 'The public Cloud Object Storage endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Cloud Object Storage',
                    'ui:placeholder': 'https://your-public-cos-endpoint:port'
                  }
                },
                cos_bucket: {
                  title: 'Cloud Object Storage Bucket Name',
                  description: 'The Cloud Object Storage bucket name',
                  type: 'string',
                  pattern: '^[a-z0-9][a-z0-9-.]*[a-z0-9]$',
                  minLength: 3,
                  maxLength: 222,
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_auth_type: {
                  title: 'Cloud Object Storage Authentication Type',
                  description:
                    'Authentication type Elyra uses to authenticate with Cloud Object Storage',
                  type: 'string',
                  enum: [
                    'AWS_IAM_ROLES_FOR_SERVICE_ACCOUNTS',
                    'KUBERNETES_SECRET',
                    'USER_CREDENTIALS'
                  ],
                  default: 'USER_CREDENTIALS',
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_secret: {
                  title: 'Cloud Object Storage Credentials Secret',
                  description:
                    "Kubernetes secret that's defined in the specified user namespace, containing the Cloud Object Storage username and password. This property is required for authentication type KUBERNETES_SECRET.",
                  type: 'string',
                  uihints: {
                    'ui:field': 'password',
                    category: 'Cloud Object Storage'
                  }
                },
                cos_username: {
                  title: 'Cloud Object Storage Username',
                  description:
                    'The Cloud Object Storage username. This property is required for authentication type USER_CREDENTIALS and KUBERNETES_SECRET.',
                  type: 'string',
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_password: {
                  title: 'Cloud Object Storage Password',
                  description:
                    'The Cloud Object Storage password. This property is required for authentication type USER_CREDENTIALS and KUBERNETES_SECRET.',
                  type: 'string',
                  minLength: 8,
                  uihints: {
                    'ui:field': 'password',
                    category: 'Cloud Object Storage'
                  }
                },
                tags: {
                  title: 'Tags',
                  description: 'Tags for categorizing Kubeflow pipelines',
                  uniqueItems: true,
                  type: 'array',
                  items: { minLength: 1, pattern: '^[^ \t]+([ \t]+[^ \t]+)*$' },
                  uihints: { 'ui:field': 'tags' }
                }
              },
              required: [
                'api_endpoint',
                'cos_auth_type',
                'cos_endpoint',
                'cos_bucket'
              ]
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        }
      ]
    };
  },
  '/elyra/schema/runtime-images': () => {
    return {
      'runtime-images': [
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/runtime-image.json',
          title: 'Runtime Image',
          name: 'runtime-image',
          schemaspace: 'runtime-images',
          schemaspace_id: '119c9740-d73f-48c6-a97a-599d3acaf41d',
          uihints: {
            icon: 'elyra:container',
            title: 'Runtime Images',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/runtime-image-conf.html'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'runtime-image'
            },
            display_name: {
              title: 'Display Name',
              description: 'The display name of the Runtime Image',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this Runtime Image',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'The description of this Runtime Image instance',
                  type: 'string'
                },
                tags: {
                  title: 'Tags',
                  description: 'Tags for categorizing runtime images',
                  uniqueItems: true,
                  type: 'array',
                  items: { minLength: 1, pattern: '^[^ \t]+([ \t]+[^ \t]+)*$' },
                  uihints: { 'ui:field': 'tags' }
                },
                image_name: {
                  title: 'Image Name',
                  description: 'The image name (including optional tag)',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    'ui:placeholder': 'registry/owner/image:tag',
                    category: 'Source'
                  }
                },
                pull_policy: {
                  title: 'Image Pull Policy',
                  description:
                    'The pull policy to use when selecting this image',
                  type: 'string',
                  enum: ['Always', 'IfNotPresent', 'Never'],
                  uihints: { category: 'Source' }
                },
                pull_secret: {
                  title: 'Image Pull Secret',
                  description:
                    'Kubernetes secret name containing the container registry credentials, if anonymous pull access is forbidden.',
                  type: 'string',
                  pattern: '^[a-z0-9][a-z0-9-.]*[a-z0-9]$',
                  maxLength: 253,
                  uihints: { category: 'Source', 'ui:field': 'password' }
                }
              },
              required: ['image_name']
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        }
      ]
    };
  },
  '/elyra/schema/component-catalogs': () => {
    return {
      'component-catalogs': [
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/pipeline/airflow/package_catalog_connector/airflow-package-catalog.json',
          title: 'Apache Airflow package operator catalog',
          name: 'airflow-package-catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.ComponentCatalogMetadata',
          uihints: {
            title: 'Apache Airflow core operator catalog',
            icon: '',
            reference_url:
              'https://github.com/elyra-ai/elyra/tree/main/elyra/pipeline/airflow/package_catalog_connector'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'airflow-package-catalog'
            },
            display_name: {
              title: 'Display Name',
              description: 'Display name of this Component Catalog',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'Description of this Component Catalog',
                  type: 'string',
                  default: 'Airflow package operator catalog'
                },
                runtime_type: {
                  title: 'Runtime',
                  description: 'List of runtime types this catalog supports',
                  type: 'string',
                  enum: ['APACHE_AIRFLOW'],
                  default: 'APACHE_AIRFLOW'
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'Assign the operators in the catalog to one or more categories, to group them in the visual pipeline editor palette.',
                  type: 'array',
                  items: { type: 'string', maxLength: 18 },
                  default: ['Core packages'],
                  uihints: { category: 'Component Categories' }
                },
                airflow_package_download_url: {
                  title: 'Airflow package download URL',
                  description:
                    'URL where the Apache Airflow package wheel can be downloaded',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Source',
                    'ui:placeholder':
                      'https://host:port/path/apache_airflow.whl'
                  }
                },
                search_contrib: {
                  title: 'Include operators in contrib package',
                  description:
                    'Include operators in package airflow.contrib.operators',
                  type: 'boolean',
                  uihints: { category: 'Source' }
                },
                auth_id: {
                  title: 'User Id',
                  description:
                    'User id that has read access for the specified URL resource',
                  type: 'string',
                  minLength: 1,
                  uihints: { category: 'Source credentials' }
                },
                auth_password: {
                  title: 'Password',
                  description: 'Password or API key for the specified user id',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    'ui:field': 'password',
                    category: 'Source credentials'
                  }
                }
              },
              required: ['runtime_type', 'airflow_package_download_url']
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        },
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/pipeline/airflow/provider_package_catalog_connector/airflow-provider-package-catalog.json',
          title: 'Apache Airflow provider package operator catalog',
          name: 'airflow-provider-package-catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.ComponentCatalogMetadata',
          uihints: {
            title: 'Apache Airflow provider package operator catalog',
            icon: '',
            reference_url:
              'https://github.com/elyra-ai/elyra/tree/main/elyra/pipeline/airflow/provider_package_catalog_connector'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'airflow-provider-package-catalog'
            },
            display_name: {
              title: 'Display Name',
              description: 'Display name of this Component Catalog',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'Description of this Component Catalog',
                  type: 'string',
                  default: 'Apache Airflow provider package operator catalog'
                },
                runtime_type: {
                  title: 'Runtime',
                  description: 'List of runtime types this catalog supports',
                  type: 'string',
                  enum: ['APACHE_AIRFLOW'],
                  default: 'APACHE_AIRFLOW'
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'Assign the operators in the catalog to one or more categories, to group them in the visual pipeline editor palette.',
                  type: 'array',
                  items: { type: 'string', maxLength: 18 },
                  default: ['provider packages'],
                  uihints: { category: 'Component Categories' }
                },
                airflow_provider_package_download_url: {
                  title: 'Provider package download URL',
                  description:
                    'URL where the Airflow provider package wheel can be downloaded.',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Source',
                    'ui:placeholder':
                      'https://host:port/path/provider_package.whl'
                  }
                },
                auth_id: {
                  title: 'User Id',
                  description:
                    'User id that has read access for the specified URL resource',
                  type: 'string',
                  minLength: 1,
                  uihints: { category: 'Source credentials' }
                },
                auth_password: {
                  title: 'Password',
                  description: 'Password or API key for the specified user id',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    'ui:field': 'password',
                    category: 'Source credentials'
                  }
                }
              },
              required: [
                'runtime_type',
                'airflow_provider_package_download_url'
              ]
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        },
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/local-directory-catalog.json',
          title: 'Directory Component Catalog',
          name: 'local-directory-catalog',
          display_name: 'Directory Component Catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.DirectoryCatalogMetadata',
          uihints: {
            icon: '',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/pipeline-components.html#directory-component-catalog'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'local-directory-catalog'
            },
            display_name: {
              title: 'Display Name',
              description: 'Display name of this Component Catalog',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'Description of this Component Catalog',
                  type: 'string'
                },
                runtime_type: {
                  title: 'Runtime Type',
                  description:
                    'The type of runtime associated with this Component Catalog',
                  type: 'string',
                  enum: ['KUBEFLOW_PIPELINES', 'APACHE_AIRFLOW'],
                  uihints: { category: 'Runtime' }
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'Category names associated with this Component Catalog (the components defined in this registry will be organized in the component palette according to these categories)',
                  type: 'array',
                  items: { type: 'string', maxLength: 18 },
                  uihints: { category: 'Component Categories' }
                },
                paths: {
                  title: 'Directories',
                  description:
                    'A list of paths to directories in the local filesystem that each contain one or more component specification files',
                  type: 'array',
                  items: { type: 'string' },
                  uihints: { category: 'Configuration' }
                },
                include_subdirs: {
                  title: 'Include Subdirectories',
                  description:
                    'Indicates whether a recursive search for component specification files should be performed on subdirectories',
                  type: 'boolean',
                  uihints: { category: 'Configuration' }
                }
              },
              required: ['runtime_type', 'paths']
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        },
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/local-file-catalog.json',
          title: 'Filesystem Component Catalog',
          name: 'local-file-catalog',
          display_name: 'Filesystem Component Catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.FilenameCatalogMetadata',
          uihints: {
            icon: '',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/pipeline-components.html#filesystem-component-catalog'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'local-file-catalog'
            },
            display_name: {
              title: 'Display Name',
              description: 'Display name of this Component Catalog',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'Description of this Component Catalog',
                  type: 'string'
                },
                runtime_type: {
                  title: 'Runtime Type',
                  description:
                    'The type of runtime associated with this Component Catalog',
                  type: 'string',
                  enum: ['KUBEFLOW_PIPELINES', 'APACHE_AIRFLOW'],
                  uihints: { category: 'Runtime' }
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'Category names associated with this Component Catalog (the components defined in this registry will be organized in the component palette according to these categories)',
                  type: 'array',
                  items: { type: 'string', maxLength: 18 },
                  uihints: { category: 'Component Categories' }
                },
                base_path: {
                  title: 'Optional Base Directory',
                  description:
                    'An optional base directory from which the given values of Paths can be resolved',
                  type: 'string',
                  uihints: { category: 'Configuration' }
                },
                paths: {
                  title: 'Paths',
                  description:
                    'A list of paths to individual component specification files in the local filesystem',
                  type: 'array',
                  items: { type: 'string' },
                  uihints: { category: 'Configuration' }
                }
              },
              required: ['runtime_type', 'paths']
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        },
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/url-catalog.json',
          title: 'URL Component Catalog',
          name: 'url-catalog',
          display_name: 'URL Component Catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.UrlCatalogMetadata',
          uihints: {
            icon: '',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/pipeline-components.html#url-component-catalog'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'url-catalog'
            },
            display_name: {
              title: 'Display Name',
              description: 'Display name of this Component Catalog',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'Description of this Component Catalog',
                  type: 'string'
                },
                runtime_type: {
                  title: 'Runtime Type',
                  description:
                    'The type of runtime associated with this Component Catalog',
                  type: 'string',
                  enum: ['KUBEFLOW_PIPELINES', 'APACHE_AIRFLOW'],
                  uihints: { category: 'Runtime' }
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'Category names associated with this Component Catalog (the components defined in this registry will be organized in the component palette according to these categories)',
                  type: 'array',
                  items: { type: 'string', maxLength: 18 },
                  uihints: { category: 'Component Categories' }
                },
                paths: {
                  title: 'URLs',
                  description:
                    'A list of URLs to individual component specification files',
                  type: 'array',
                  items: { type: 'string', format: 'uri' },
                  uihints: {
                    category: 'Configuration',
                    items: {
                      'ui:placeholder': 'https://host:port/path/component_file'
                    }
                  }
                },
                auth_id: {
                  title: 'User Id',
                  description:
                    'User id that has read access for the specified URL resources',
                  type: 'string',
                  minLength: 1,
                  uihints: { category: 'Source credentials' }
                },
                auth_password: {
                  title: 'Password',
                  description: 'Password or API key for the specified user id',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    'ui:field': 'password',
                    category: 'Source credentials'
                  }
                }
              },
              required: ['runtime_type', 'paths']
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        }
      ]
    };
  }
};
