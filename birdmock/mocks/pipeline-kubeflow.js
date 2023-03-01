module.exports = {
  '/elyra/pipeline/components/KUBEFLOW_PIPELINES': () => {
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
  '/elyra/pipeline/KUBEFLOW_PIPELINES/properties': () => {
    return {
      type: 'object',
      properties: {
        name: {
          title: 'Pipeline Name',
          type: 'string',
          uihints: {
            'ui:readonly': true
          }
        },
        runtime: {
          title: 'Pipeline Runtime',
          type: 'string',
          uihints: {
            'ui:readonly': true
          }
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
              uihints: {
                'ui:placeholder': 'project/subproject'
              }
            },
            node_defaults_header: {
              type: 'null',
              title: 'Node Defaults',
              description:
                'Default values are applied to all nodes in this pipeline and can be customized in each node.',
              uihints: {
                'ui:field': 'header'
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
                  key: {
                    title: 'Key',
                    type: 'string',
                    default: ''
                  },
                  value: {
                    title: 'Value',
                    type: 'string',
                    default: ''
                  }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: {
                    'ui:placeholder': 'annotation_key'
                  },
                  value: {
                    'ui:placeholder': 'annotation_value'
                  }
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
                  key: {
                    title: 'Key',
                    type: 'string',
                    default: ''
                  },
                  value: {
                    title: 'Value',
                    type: 'string',
                    default: ''
                  }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: {
                    'ui:placeholder': 'label_key'
                  },
                  value: {
                    'ui:placeholder': 'label_value'
                  }
                }
              }
            },
            kubernetes_shared_mem_size: {
              title: 'Shared Memory Size',
              description:
                'Configure a custom shared memory size in gigabytes (10^9 bytes) for the pod that executes a node. A custom value is assigned if the size property value is a number greater than zero.',
              type: 'object',
              properties: {
                size: {
                  title: 'Memory Size (GB)',
                  type: 'integer',
                  minimum: 0
                }
              },
              required: [],
              uihints: {
                size: {
                  'ui:placeholder': 0
                }
              }
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
                  key: {
                    title: 'Key',
                    type: 'string',
                    default: ''
                  },
                  operator: {
                    title: 'Operator',
                    type: 'string',
                    default: 'Equal',
                    enum: ['Equal', 'Exists']
                  },
                  value: {
                    title: 'Value',
                    type: 'string',
                    default: ''
                  },
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
                  key: {
                    'ui:placeholder': 'key'
                  },
                  value: {
                    'ui:placeholder': 'value'
                  },
                  effect: {
                    'ui:placeholder': 'NoSchedule'
                  }
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
                  path: {
                    title: 'Mount Path',
                    type: 'string',
                    default: ''
                  },
                  pvc_name: {
                    title: 'Persistent Volume Claim Name',
                    type: 'string',
                    default: ''
                  },
                  sub_path: {
                    title: 'Sub Path',
                    type: 'string',
                    default: ''
                  },
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
                  path: {
                    'ui:placeholder': '/mount/path'
                  },
                  pvc_name: {
                    'ui:placeholder': 'pvc-name'
                  },
                  sub_path: {
                    'ui:placeholder': 'relative/path/within/volume'
                  },
                  read_only: {
                    'ui:placeholder': ' '
                  }
                }
              }
            },
            generic_node_defaults_header: {
              type: 'null',
              title: 'Generic Node Defaults',
              description:
                'Default values are applied to all generic nodes in this pipeline and can be customized in each node.',
              uihints: {
                'ui:field': 'header'
              }
            },
            runtime_image: {
              title: 'Runtime Image',
              description: 'Container image used as execution environment.',
              type: 'string'
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
                  name: {
                    title: 'Secret Name',
                    type: 'string',
                    default: ''
                  },
                  key: {
                    title: 'Secret Key',
                    type: 'string',
                    default: ''
                  }
                },
                required: ['env_var', 'name', 'key']
              },
              uihints: {
                items: {
                  env_var: {
                    'ui:placeholder': 'ENV_VAR'
                  },
                  name: {
                    'ui:placeholder': 'secret-name'
                  },
                  key: {
                    'ui:placeholder': 'secret-key'
                  }
                }
              }
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
                  value: {
                    title: 'Value',
                    type: 'string',
                    default: ''
                  }
                },
                required: ['env_var']
              },
              uihints: {
                items: {
                  env_var: {
                    'ui:placeholder': 'ENV_VAR'
                  },
                  value: {
                    'ui:placeholder': 'value'
                  }
                },
                canRefresh: true
              }
            },
            custom_node_defaults_header: {
              type: 'null',
              title: 'Custom Node Defaults',
              description:
                'Default values are applied to all custom nodes in this pipeline and can be customized in each node.',
              uihints: {
                'ui:field': 'header'
              }
            },
            disable_node_caching: {
              title: 'Disable node caching',
              description:
                'Disable caching to force node re-execution in the target runtime environment.',
              type: 'string',
              enum: ['True', 'False'],
              uihints: {
                'ui:placeholder': 'Use runtime default'
              }
            }
          }
        }
      }
    };
  },
  '/elyra/pipeline/KUBEFLOW_PIPELINES/parameters': () => {
    return {
      title: 'Pipeline Parameters',
      description: 'Typed variables to be passed to the pipeline.',
      type: 'array',
      default: [],
      items: {
        type: 'object',
        properties: {
          name: {
            title: 'Parameter Name',
            description:
              'The name of the parameter. This must be a valid Python identifier and not a keyword.',
            pattern: '^[a-zA-Z][a-zA-Z0-9_]*$',
            type: 'string',
            default: ''
          },
          description: {
            title: 'Description',
            description: 'A description for this parameter.',
            type: 'string',
            default: ''
          },
          default_value: {
            title: 'Type',
            description: 'The type of this parameter',
            default: {
              type: 'String',
              value: ''
            },
            oneOf: [
              {
                type: 'object',
                title: 'Bool',
                properties: {
                  type: {
                    type: 'string',
                    default: 'Bool'
                  },
                  value: {
                    title: 'Default Value',
                    description: 'A default value for the parameter.',
                    type: 'boolean',
                    default: false
                  }
                },
                uihints: {
                  type: {
                    'ui:widget': 'hidden'
                  },
                  value: {
                    'ui:placeholder': ' '
                  }
                }
              },
              {
                type: 'object',
                title: 'Float',
                properties: {
                  type: {
                    type: 'string',
                    default: 'Float'
                  },
                  value: {
                    title: 'Default Value',
                    description: 'A default value for the parameter.',
                    type: 'number'
                  }
                },
                uihints: {
                  type: {
                    'ui:widget': 'hidden'
                  }
                }
              },
              {
                type: 'object',
                title: 'Integer',
                properties: {
                  type: {
                    type: 'string',
                    default: 'Integer'
                  },
                  value: {
                    title: 'Default Value',
                    description: 'A default value for the parameter.',
                    type: 'integer'
                  }
                },
                uihints: {
                  type: {
                    'ui:widget': 'hidden'
                  }
                }
              },
              {
                type: 'object',
                title: 'String',
                properties: {
                  type: {
                    type: 'string',
                    default: 'String'
                  },
                  value: {
                    title: 'Default Value',
                    description: 'A default value for the parameter.',
                    type: 'string',
                    default: ''
                  }
                },
                uihints: {
                  type: {
                    'ui:widget': 'hidden'
                  },
                  value: {
                    'ui:placeholder': 'default_val'
                  }
                }
              }
            ]
          },
          required: {
            title: 'Required',
            description:
              'Whether a value is required for this parameter during pipeline submit or export.',
            type: 'boolean',
            default: false
          }
        },
        required: ['name']
      },
      uihints: {
        items: {
          name: {
            'ui:placeholder': 'param_1'
          },
          required: {
            'ui:placeholder': ' '
          }
        }
      }
    };
  },
  '/elyra/pipeline/components/KUBEFLOW_PIPELINES/notebook/properties': () => {
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
              uihints: {
                'ui:field': 'header'
              }
            },
            filename: {
              type: 'string',
              title: 'Filename',
              description: 'The path to the Notebook.',
              uihints: {
                'ui:widget': 'file',
                extensions: ['.ipynb']
              }
            },
            runtime_image: {
              type: 'string',
              title: 'Runtime Image',
              required: true,
              description: 'Container image used as execution environment.',
              uihints: {
                items: []
              }
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
              uihints: {
                'ui:placeholder': 'nvidia.com/gpu'
              }
            },
            pipeline_parameters: {
              type: 'array',
              title: 'Pipeline Parameters',
              description:
                'Pipeline parameters that should be passed to this file.',
              items: {
                type: 'string',
                enum: []
              },
              uniqueItems: true
            },
            dependencies: {
              title: 'File Dependencies',
              description:
                'Local file dependencies that need to be copied to remote execution environment.',
              type: 'array',
              items: {
                type: 'string',
                default: ''
              },
              default: [],
              uihints: {
                files: true,
                items: {
                  'ui:placeholder': '*.py'
                }
              }
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
              uihints: {
                'ui:field': 'header'
              }
            },
            outputs: {
              title: 'Output Files',
              description:
                'Files generated during execution that will become available to all subsequent pipeline steps.',
              type: 'array',
              items: {
                type: 'string',
                default: ''
              },
              default: [],
              uihints: {
                items: {
                  'ui:placeholder': '*.csv'
                }
              }
            },
            additional_properties_header: {
              type: 'null',
              title: 'Additional Properties',
              description:
                'Additional properties used by Elyra that are not given in the component definition.',
              uihints: {
                'ui:field': 'header'
              }
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
                  value: {
                    title: 'Value',
                    type: 'string',
                    default: ''
                  }
                },
                required: ['env_var']
              },
              uihints: {
                items: {
                  env_var: {
                    'ui:placeholder': 'ENV_VAR'
                  },
                  value: {
                    'ui:placeholder': 'value'
                  }
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
                  key: {
                    title: 'Key',
                    type: 'string',
                    default: ''
                  },
                  value: {
                    title: 'Value',
                    type: 'string',
                    default: ''
                  }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: {
                    'ui:placeholder': 'annotation_key'
                  },
                  value: {
                    'ui:placeholder': 'annotation_value'
                  }
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
                  key: {
                    title: 'Key',
                    type: 'string',
                    default: ''
                  },
                  value: {
                    title: 'Value',
                    type: 'string',
                    default: ''
                  }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: {
                    'ui:placeholder': 'label_key'
                  },
                  value: {
                    'ui:placeholder': 'label_value'
                  }
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
                  name: {
                    title: 'Secret Name',
                    type: 'string',
                    default: ''
                  },
                  key: {
                    title: 'Secret Key',
                    type: 'string',
                    default: ''
                  }
                },
                required: ['env_var', 'name', 'key']
              },
              uihints: {
                items: {
                  env_var: {
                    'ui:placeholder': 'ENV_VAR'
                  },
                  name: {
                    'ui:placeholder': 'secret-name'
                  },
                  key: {
                    'ui:placeholder': 'secret-key'
                  }
                }
              }
            },
            kubernetes_shared_mem_size: {
              title: 'Shared Memory Size',
              description:
                'Configure a custom shared memory size in gigabytes (10^9 bytes) for the pod that executes a node. A custom value is assigned if the size property value is a number greater than zero.',
              type: 'object',
              properties: {
                size: {
                  title: 'Memory Size (GB)',
                  type: 'integer',
                  minimum: 0
                }
              },
              required: [],
              uihints: {
                size: {
                  'ui:placeholder': 0
                }
              }
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
                  key: {
                    title: 'Key',
                    type: 'string',
                    default: ''
                  },
                  operator: {
                    title: 'Operator',
                    type: 'string',
                    default: 'Equal',
                    enum: ['Equal', 'Exists']
                  },
                  value: {
                    title: 'Value',
                    type: 'string',
                    default: ''
                  },
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
                  key: {
                    'ui:placeholder': 'key'
                  },
                  value: {
                    'ui:placeholder': 'value'
                  },
                  effect: {
                    'ui:placeholder': 'NoSchedule'
                  }
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
                  path: {
                    title: 'Mount Path',
                    type: 'string',
                    default: ''
                  },
                  pvc_name: {
                    title: 'Persistent Volume Claim Name',
                    type: 'string',
                    default: ''
                  },
                  sub_path: {
                    title: 'Sub Path',
                    type: 'string',
                    default: ''
                  },
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
                  path: {
                    'ui:placeholder': '/mount/path'
                  },
                  pvc_name: {
                    'ui:placeholder': 'pvc-name'
                  },
                  sub_path: {
                    'ui:placeholder': 'relative/path/within/volume'
                  },
                  read_only: {
                    'ui:placeholder': ' '
                  }
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
  '/elyra/pipeline/components/KUBEFLOW_PIPELINES/python-script/properties':
    () => {
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
                uihints: {
                  'ui:field': 'header'
                }
              },
              filename: {
                type: 'string',
                title: 'Filename',
                description: 'The path to the Python Script.',
                uihints: {
                  'ui:widget': 'file',
                  extensions: ['.py']
                }
              },
              runtime_image: {
                type: 'string',
                title: 'Runtime Image',
                required: true,
                description: 'Container image used as execution environment.',
                uihints: {
                  items: []
                }
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
                uihints: {
                  'ui:placeholder': 'nvidia.com/gpu'
                }
              },
              pipeline_parameters: {
                type: 'array',
                title: 'Pipeline Parameters',
                description:
                  'Pipeline parameters that should be passed to this file.',
                items: {
                  type: 'string',
                  enum: []
                },
                uniqueItems: true
              },
              dependencies: {
                title: 'File Dependencies',
                description:
                  'Local file dependencies that need to be copied to remote execution environment.',
                type: 'array',
                items: {
                  type: 'string',
                  default: ''
                },
                default: [],
                uihints: {
                  files: true,
                  items: {
                    'ui:placeholder': '*.py'
                  }
                }
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
                uihints: {
                  'ui:field': 'header'
                }
              },
              outputs: {
                title: 'Output Files',
                description:
                  'Files generated during execution that will become available to all subsequent pipeline steps.',
                type: 'array',
                items: {
                  type: 'string',
                  default: ''
                },
                default: [],
                uihints: {
                  items: {
                    'ui:placeholder': '*.csv'
                  }
                }
              },
              additional_properties_header: {
                type: 'null',
                title: 'Additional Properties',
                description:
                  'Additional properties used by Elyra that are not given in the component definition.',
                uihints: {
                  'ui:field': 'header'
                }
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
                    value: {
                      title: 'Value',
                      type: 'string',
                      default: ''
                    }
                  },
                  required: ['env_var']
                },
                uihints: {
                  items: {
                    env_var: {
                      'ui:placeholder': 'ENV_VAR'
                    },
                    value: {
                      'ui:placeholder': 'value'
                    }
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
                    key: {
                      title: 'Key',
                      type: 'string',
                      default: ''
                    },
                    value: {
                      title: 'Value',
                      type: 'string',
                      default: ''
                    }
                  },
                  required: ['key']
                },
                uihints: {
                  items: {
                    key: {
                      'ui:placeholder': 'annotation_key'
                    },
                    value: {
                      'ui:placeholder': 'annotation_value'
                    }
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
                    key: {
                      title: 'Key',
                      type: 'string',
                      default: ''
                    },
                    value: {
                      title: 'Value',
                      type: 'string',
                      default: ''
                    }
                  },
                  required: ['key']
                },
                uihints: {
                  items: {
                    key: {
                      'ui:placeholder': 'label_key'
                    },
                    value: {
                      'ui:placeholder': 'label_value'
                    }
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
                    name: {
                      title: 'Secret Name',
                      type: 'string',
                      default: ''
                    },
                    key: {
                      title: 'Secret Key',
                      type: 'string',
                      default: ''
                    }
                  },
                  required: ['env_var', 'name', 'key']
                },
                uihints: {
                  items: {
                    env_var: {
                      'ui:placeholder': 'ENV_VAR'
                    },
                    name: {
                      'ui:placeholder': 'secret-name'
                    },
                    key: {
                      'ui:placeholder': 'secret-key'
                    }
                  }
                }
              },
              kubernetes_shared_mem_size: {
                title: 'Shared Memory Size',
                description:
                  'Configure a custom shared memory size in gigabytes (10^9 bytes) for the pod that executes a node. A custom value is assigned if the size property value is a number greater than zero.',
                type: 'object',
                properties: {
                  size: {
                    title: 'Memory Size (GB)',
                    type: 'integer',
                    minimum: 0
                  }
                },
                required: [],
                uihints: {
                  size: {
                    'ui:placeholder': 0
                  }
                }
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
                    key: {
                      title: 'Key',
                      type: 'string',
                      default: ''
                    },
                    operator: {
                      title: 'Operator',
                      type: 'string',
                      default: 'Equal',
                      enum: ['Equal', 'Exists']
                    },
                    value: {
                      title: 'Value',
                      type: 'string',
                      default: ''
                    },
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
                    key: {
                      'ui:placeholder': 'key'
                    },
                    value: {
                      'ui:placeholder': 'value'
                    },
                    effect: {
                      'ui:placeholder': 'NoSchedule'
                    }
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
                    path: {
                      title: 'Mount Path',
                      type: 'string',
                      default: ''
                    },
                    pvc_name: {
                      title: 'Persistent Volume Claim Name',
                      type: 'string',
                      default: ''
                    },
                    sub_path: {
                      title: 'Sub Path',
                      type: 'string',
                      default: ''
                    },
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
                    path: {
                      'ui:placeholder': '/mount/path'
                    },
                    pvc_name: {
                      'ui:placeholder': 'pvc-name'
                    },
                    sub_path: {
                      'ui:placeholder': 'relative/path/within/volume'
                    },
                    read_only: {
                      'ui:placeholder': ' '
                    }
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
  '/elyra/pipeline/components/KUBEFLOW_PIPELINES/r-script/properties': () => {
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
              uihints: {
                'ui:field': 'header'
              }
            },
            filename: {
              type: 'string',
              title: 'Filename',
              description: 'The path to the R Script.',
              uihints: {
                'ui:widget': 'file',
                extensions: ['.r']
              }
            },
            runtime_image: {
              type: 'string',
              title: 'Runtime Image',
              required: true,
              description: 'Container image used as execution environment.',
              uihints: {
                items: []
              }
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
              uihints: {
                'ui:placeholder': 'nvidia.com/gpu'
              }
            },
            pipeline_parameters: {
              type: 'array',
              title: 'Pipeline Parameters',
              description:
                'Pipeline parameters that should be passed to this file.',
              items: {
                type: 'string',
                enum: []
              },
              uniqueItems: true
            },
            dependencies: {
              title: 'File Dependencies',
              description:
                'Local file dependencies that need to be copied to remote execution environment.',
              type: 'array',
              items: {
                type: 'string',
                default: ''
              },
              default: [],
              uihints: {
                files: true,
                items: {
                  'ui:placeholder': '*.py'
                }
              }
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
              uihints: {
                'ui:field': 'header'
              }
            },
            outputs: {
              title: 'Output Files',
              description:
                'Files generated during execution that will become available to all subsequent pipeline steps.',
              type: 'array',
              items: {
                type: 'string',
                default: ''
              },
              default: [],
              uihints: {
                items: {
                  'ui:placeholder': '*.csv'
                }
              }
            },
            additional_properties_header: {
              type: 'null',
              title: 'Additional Properties',
              description:
                'Additional properties used by Elyra that are not given in the component definition.',
              uihints: {
                'ui:field': 'header'
              }
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
                  value: {
                    title: 'Value',
                    type: 'string',
                    default: ''
                  }
                },
                required: ['env_var']
              },
              uihints: {
                items: {
                  env_var: {
                    'ui:placeholder': 'ENV_VAR'
                  },
                  value: {
                    'ui:placeholder': 'value'
                  }
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
                  key: {
                    title: 'Key',
                    type: 'string',
                    default: ''
                  },
                  value: {
                    title: 'Value',
                    type: 'string',
                    default: ''
                  }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: {
                    'ui:placeholder': 'annotation_key'
                  },
                  value: {
                    'ui:placeholder': 'annotation_value'
                  }
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
                  key: {
                    title: 'Key',
                    type: 'string',
                    default: ''
                  },
                  value: {
                    title: 'Value',
                    type: 'string',
                    default: ''
                  }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: {
                    'ui:placeholder': 'label_key'
                  },
                  value: {
                    'ui:placeholder': 'label_value'
                  }
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
                  name: {
                    title: 'Secret Name',
                    type: 'string',
                    default: ''
                  },
                  key: {
                    title: 'Secret Key',
                    type: 'string',
                    default: ''
                  }
                },
                required: ['env_var', 'name', 'key']
              },
              uihints: {
                items: {
                  env_var: {
                    'ui:placeholder': 'ENV_VAR'
                  },
                  name: {
                    'ui:placeholder': 'secret-name'
                  },
                  key: {
                    'ui:placeholder': 'secret-key'
                  }
                }
              }
            },
            kubernetes_shared_mem_size: {
              title: 'Shared Memory Size',
              description:
                'Configure a custom shared memory size in gigabytes (10^9 bytes) for the pod that executes a node. A custom value is assigned if the size property value is a number greater than zero.',
              type: 'object',
              properties: {
                size: {
                  title: 'Memory Size (GB)',
                  type: 'integer',
                  minimum: 0
                }
              },
              required: [],
              uihints: {
                size: {
                  'ui:placeholder': 0
                }
              }
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
                  key: {
                    title: 'Key',
                    type: 'string',
                    default: ''
                  },
                  operator: {
                    title: 'Operator',
                    type: 'string',
                    default: 'Equal',
                    enum: ['Equal', 'Exists']
                  },
                  value: {
                    title: 'Value',
                    type: 'string',
                    default: ''
                  },
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
                  key: {
                    'ui:placeholder': 'key'
                  },
                  value: {
                    'ui:placeholder': 'value'
                  },
                  effect: {
                    'ui:placeholder': 'NoSchedule'
                  }
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
                  path: {
                    title: 'Mount Path',
                    type: 'string',
                    default: ''
                  },
                  pvc_name: {
                    title: 'Persistent Volume Claim Name',
                    type: 'string',
                    default: ''
                  },
                  sub_path: {
                    title: 'Sub Path',
                    type: 'string',
                    default: ''
                  },
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
                  path: {
                    'ui:placeholder': '/mount/path'
                  },
                  pvc_name: {
                    'ui:placeholder': 'pvc-name'
                  },
                  sub_path: {
                    'ui:placeholder': 'relative/path/within/volume'
                  },
                  read_only: {
                    'ui:placeholder': ' '
                  }
                }
              }
            }
          },
          required: ['filename', 'runtime_image']
        }
      },
      required: ['component_parameters']
    };
  }
};
