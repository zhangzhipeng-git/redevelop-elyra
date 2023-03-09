module.exports = {
  '/elyra/schemaspace': () => {
    return {
      schemaspaces: ['component-catalogs', 'runtimes', 'runtime-images']
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
              title: '模式名称',
              description: '与此实例关联的模式',
              type: 'string',
              const: 'airflow'
            },
            display_name: {
              title: '展示名称',
              description: '显示此Apache Airflow配置的名称',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: '特定于此元数据的其他数据',
              type: 'object',
              properties: {
                runtime_type: {
                  title: '运行环境',
                  description: '与此实例关联的运行时',
                  type: 'string',
                  const: 'APACHE_AIRFLOW',
                  uihints: { hidden: true }
                },
                description: {
                  title: '描述',
                  description: 'Apache Airflow配置描述',
                  type: 'string'
                },
                api_endpoint: {
                  title: 'Apache Airflow UI端点',
                  description: 'The Apache Airflow UI端点',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Apache Airflow',
                    'ui:placeholder': 'https://your-airflow-webserver:port'
                  }
                },
                user_namespace: {
                  title: 'Apache Airflow用户命名空间',
                  description:
                    'The Apache Airflow用于运行DAG工作流的用户命名空间',
                  type: 'string',
                  pattern: '^[a-z0-9][-a-z0-9]*[a-z0-9]$',
                  maxLength: 63,
                  default: 'default',
                  uihints: { category: 'Apache Airflow' }
                },
                git_type: {
                  title: 'Git类型',
                  description: 'Git平台',
                  type: 'string',
                  enum: ['GITHUB'],
                  default: 'GITHUB',
                  uihints: { category: 'Apache Airflow' }
                },
                github_api_endpoint: {
                  title: 'GitHub或者GitLab服务器API端点',
                  description:
                    'The GitHub或者GitLab服务器URL/API端点-  Public or Enterprise',
                  type: 'string',
                  format: 'uri',
                  default: 'https://api.github.com',
                  uihints: {
                    category: 'Apache Airflow',
                    'ui:placeholder': 'https://your-github-or-gitlab-endpoint'
                  }
                },
                github_repo: {
                  title: 'GitHub或者GitLab DAG仓库',
                  description: '存储DAG的现有存储库',
                  type: 'string',
                  uihints: {
                    category: 'Apache Airflow',
                    'ui:placeholder': 'user-or-org/dag-repo-name'
                  }
                },
                github_branch: {
                  title: 'GitHub或者GitLab DAG存储库分支',
                  description: '存储DAG的存储库中的现有分支',
                  type: 'string',
                  uihints: { category: 'Apache Airflow' }
                },
                github_repo_token: {
                  title: '个人访问令牌',
                  description: 'T有权限推送到DAG存储库的令牌',
                  type: 'string',
                  uihints: {
                    'ui:field': 'password',
                    category: 'Apache Airflow'
                  }
                },
                cos_endpoint: {
                  title: '云对象存储端点',
                  description: '云对象存储端点',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Cloud Object Storage',
                    'ui:placeholder': 'https://your-cos-service:port'
                  }
                },
                public_cos_endpoint: {
                  title: '公有云对象存储端点',
                  description: '公有云对象存储端点',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Cloud Object Storage',
                    'ui:placeholder': 'https://your-public-cos-endpoint:port'
                  }
                },
                cos_bucket: {
                  title: '云对象存储桶名称',
                  description: '云对象存储桶名称',
                  type: 'string',
                  pattern: '^[a-z0-9][a-z0-9-.]*[a-z0-9]$',
                  minLength: 3,
                  maxLength: 222,
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_auth_type: {
                  title: '云对象存储认证类型',
                  description: '身份验证类型使用云对象存储进行身份验证',
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
                  title: '云对象存储证书秘钥',
                  description:
                    '在指定的用户名称空间中定义的Kubernetes秘钥，包含云对象存储用户名和密码。这个属性对于身份验证类型KUBERNETES_SECRET是必需的.',
                  type: 'string',
                  uihints: {
                    'ui:field': 'password',
                    category: 'Cloud Object Storage'
                  }
                },
                cos_username: {
                  title: '云对象存储用户名',
                  description:
                    '云对象存储用户名，此属性对于身份验证类型USER_CREDENTIALS和KUBERNETES_SECRET是必需的.',
                  type: 'string',
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_password: {
                  title: '对象存储密码',
                  description:
                    '云对象存储密码，此属性对于身份验证类型USER_CREDENTIALS和KUBERNETES_SECRET是必需的.',
                  type: 'string',
                  minLength: 8,
                  uihints: {
                    'ui:field': 'password',
                    category: 'Cloud Object Storage'
                  }
                },
                tags: {
                  title: '标签',
                  description: '标签用于分类Apache Airflow',
                  uniqueItems: true,
                  type: 'array',
                  items: { minLength: 1, pattern: '^[^\t]+([\t]+[^\t]+)*$' },
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
              title: '模式名称',
              description: '与此实例关联的模式',
              type: 'string',
              const: 'kfp'
            },
            display_name: {
              title: '展示名称',
              description: '显示此kfp配置的名称',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: '特定于此元数据的其他数据',
              type: 'object',
              properties: {
                runtime_type: {
                  title: '运行环境',
                  description: '与此实例关联的运行时',
                  type: 'string',
                  const: 'KUBEFLOW_PIPELINES',
                  uihints: { hidden: true }
                },
                description: {
                  title: '描述',
                  description: 'Kubeflow Pipelines配置描述',
                  type: 'string'
                },
                api_endpoint: {
                  title: 'kfp API端点',
                  description: 'kfp API端点',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Kubeflow Pipelines',
                    'ui:placeholder':
                      'https://your-kubeflow-service:port/pipeline'
                  }
                },
                public_api_endpoint: {
                  title: '公共kfp API端点',
                  description: '公共kfp API端点',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Kubeflow Pipelines',
                    'ui:placeholder':
                      'https://your-kubeflow-service:port/pipeline'
                  }
                },
                user_namespace: {
                  title: 'kfp用户命名空间',
                  description: '用于创建实验的kfp用户名称空间',
                  type: 'string',
                  pattern: '^[a-z0-9][-a-z0-9]*[a-z0-9]$',
                  maxLength: 63,
                  uihints: { category: 'Kubeflow Pipelines' }
                },
                engine: {
                  title: 'kfp引擎',
                  description: '使用中的kfp引擎',
                  type: 'string',
                  enum: ['Argo'],
                  default: 'Argo',
                  uihints: { category: 'Kubeflow Pipelines' }
                },
                auth_type: {
                  title: '认证类型',
                  description: '认证类型使用Kubeflow进行身份验证',
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
                  title: 'kfp API端点用户名称',
                  description:
                    '身份验证类型使用Kubeflow pipeline API端点用户名进行身份验证，除NO_AUTHENTICATION和KUBERNETES_SERVICE_ACCOUNT_TOKEN外，所有身份验证类型都需要此属性.',
                  type: 'string',
                  uihints: { category: 'Kubeflow Pipelines' }
                },
                api_password: {
                  title: 'kfp API端点密码',
                  description:
                    '指定用户名的密码，除NO_AUTHENTICATION和KUBERNETES_SERVICE_ACCOUNT_TOKEN外，所有身份验证类型都需要此属性.',
                  type: 'string',
                  uihints: {
                    'ui:field': 'password',
                    category: 'Kubeflow Pipelines'
                  }
                },
                cos_endpoint: {
                  title: '云对象存储端点',
                  description: '云对象存储端点',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Cloud Object Storage',
                    'ui:placeholder': 'https://your-cos-service:port'
                  }
                },
                public_cos_endpoint: {
                  title: '公有云对象存储端点',
                  description: '公有云对象存储端点',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Cloud Object Storage',
                    'ui:placeholder': 'https://your-public-cos-endpoint:port'
                  }
                },
                cos_bucket: {
                  title: '云对象存储桶名称',
                  description: '云对象存储桶名称',
                  type: 'string',
                  pattern: '^[a-z0-9][a-z0-9-.]*[a-z0-9]$',
                  minLength: 3,
                  maxLength: 222,
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_auth_type: {
                  title: '云对象存储认证类型',
                  description: '身份验证类型使用云对象存储进行身份验证',
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
                  title: '云对象存储证书秘钥',
                  description:
                    '在指定的用户名称空间中定义的Kubernetes秘钥，包含云对象存储用户名和密码。这个属性对于身份验证类型KUBERNETES_SECRET是必需的.',
                  type: 'string',
                  uihints: {
                    'ui:field': 'password',
                    category: 'Cloud Object Storage'
                  }
                },
                cos_username: {
                  title: '云对象存储用户名',
                  description:
                    '云对象存储用户名。此属性对于身份验证类型USER_CREDENTIALS和KUBERNETES_SECRET是必需的.',
                  type: 'string',
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_password: {
                  title: '对象存储密码',
                  description:
                    '云对象存储密码，此属性对于身份验证类型USER_CREDENTIALS和KUBERNETES_SECRET是必需的.',
                  type: 'string',
                  minLength: 8,
                  uihints: {
                    'ui:field': 'password',
                    category: 'Cloud Object Storage'
                  }
                },
                tags: {
                  title: '标签',
                  description: '标签用于分类kfp',
                  uniqueItems: true,
                  type: 'array',
                  items: { minLength: 1, pattern: '^[^\t]+([\t]+[^\t]+)*$' },
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
          title: '运行时镜像',
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
              title: '模式名称',
              description: '与此实例关联的模式',
              type: 'string',
              const: 'runtime-image'
            },
            display_name: {
              title: '展示名称',
              description: '运行时映像的显示名称',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: '特定于此运行时映像的附加数据',
              type: 'object',
              properties: {
                description: {
                  title: '描述',
                  description: '此运行时映像实例的描述',
                  type: 'string'
                },
                tags: {
                  title: '标签',
                  description: '标签用于分类运行镜像',
                  uniqueItems: true,
                  type: 'array',
                  items: { minLength: 1, pattern: '^[^\t]+([\t]+[^\t]+)*$' },
                  uihints: { 'ui:field': 'tags' }
                },
                image_name: {
                  title: '镜像名称',
                  description: '镜像名称(包括可选标签)',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    'ui:placeholder': 'registry/owner/image:tag',
                    category: 'Source'
                  }
                },
                pull_policy: {
                  title: '镜像拉取策略',
                  description: '选择此镜像时使用的拉取策略',
                  type: 'string',
                  enum: ['Always', 'IfNotPresent', 'Never'],
                  uihints: { category: 'Source' }
                },
                pull_secret: {
                  title: '镜像拉取秘钥',
                  description:
                    '包含容器注册表凭据的Kubernetes秘钥名称，如果匿名拉访问被禁止.',
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
          title: 'Apache Airflow包的operator',
          name: 'airflow-package-catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.ComponentCatalogMetadata',
          uihints: {
            title: 'Apache Airflow核心operator',
            icon: '',
            reference_url:
              'https://github.com/elyra-ai/elyra/tree/main/elyra/pipeline/airflow/package_catalog_connector'
          },
          properties: {
            schema_name: {
              title: '模式名称',
              description: '与此实例关联的模式',
              type: 'string',
              const: 'airflow-package-catalog'
            },
            display_name: {
              title: '展示名称',
              description: '显示此组件目录的名称',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: '特定于此元数据的其他数据',
              type: 'object',
              properties: {
                description: {
                  title: '描述',
                  description: '此组件目录的描述',
                  type: 'string',
                  default: 'Airflow包的operator目录'
                },
                runtime_type: {
                  title: '运行环境',
                  description: '此目录支持的运行环境类型的列表',
                  type: 'string',
                  enum: ['APACHE_AIRFLOW'],
                  default: 'APACHE_AIRFLOW'
                },
                categories: {
                  title: '目录名称',
                  description:
                    '将分类中的operator分配给一个或多个目录，以便在可视管道编辑器面板中对它们进行分组.',
                  type: 'array',
                  items: {
                    type: 'string',
                    maxLength: 18
                  },
                  default: ['Core packages'],
                  uihints: {
                    category: 'Component Categories'
                  }
                },
                airflow_package_download_url: {
                  title: 'Airflow包下载链接',
                  description: 'Apache Airflow可以下载wheel包的链接',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Source',
                    'ui:placeholder':
                      'https://host:port/path/apache_airflow.whl'
                  }
                },
                search_contrib: {
                  title: '在contrib包中包含operator',
                  description: '在airflow.contrib.operators包中包含operator',
                  type: 'boolean',
                  uihints: {
                    category: 'Source'
                  }
                },
                auth_id: {
                  title: '用户ID',
                  description: '对指定URL资源具有读访问权限的用户ID',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    category: 'Source credentials'
                  }
                },
                auth_password: {
                  title: '密码',
                  description: '指定用户ID的密码或API密钥',
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
          title: 'Apache Airflow provider packageoperator',
          name: 'airflow-provider-package-catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.ComponentCatalogMetadata',
          uihints: {
            title: 'Apache Airflow provider packageoperator',
            icon: '',
            reference_url:
              'https://github.com/elyra-ai/elyra/tree/main/elyra/pipeline/airflow/provider_package_catalog_connector'
          },
          properties: {
            schema_name: {
              title: '模式名称',
              description: '与此实例关联的模式',
              type: 'string',
              const: 'airflow-provider-package-catalog'
            },
            display_name: {
              title: '展示名称',
              description: '显示此组件目录的名称',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: '特定于此元数据的其他数据',
              type: 'object',
              properties: {
                description: {
                  title: '描述',
                  description: '此组件目录的描述',
                  type: 'string',
                  default: 'Apache Airflow provider package operator catalog'
                },
                runtime_type: {
                  title: '运行环境',
                  description: '此分类支持的运行环境类型的列表',
                  type: 'string',
                  enum: ['APACHE_AIRFLOW'],
                  default: 'APACHE_AIRFLOW'
                },
                categories: {
                  title: '目录名称',
                  description:
                    '将分类中的operator分配给一个或多个分类，以便在可视管道编辑器面板中对它们进行分组.',
                  type: 'array',
                  items: {
                    type: 'string',
                    maxLength: 18
                  },
                  default: ['provider packages'],
                  uihints: {
                    category: 'Component Categories'
                  }
                },
                airflow_provider_package_download_url: {
                  title: 'provider package的下载链接',
                  description: '可以下载Airflow provider package wheel的链接.',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Source',
                    'ui:placeholder':
                      'https://host:port/path/provider_package.whl'
                  }
                },
                auth_id: {
                  title: '用户ID',
                  description: '对指定URL资源具有读访问权限的用户ID',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    category: 'Source credentials'
                  }
                },
                auth_password: {
                  title: '密码',
                  description: '指定用户ID的密码或API密钥',
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
          title: '文件目录',
          name: 'local-directory-catalog',
          display_name: '文件目录',
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
              title: '模式名称',
              description: '与此实例关联的模式',
              type: 'string',
              const: 'local-directory-catalog'
            },
            display_name: {
              title: '展示名称',
              description: '显示此组件目录的名称',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: '特定于此元数据的其他数据',
              type: 'object',
              properties: {
                description: {
                  title: '描述',
                  description: '此组件目录的描述',
                  type: 'string'
                },
                runtime_type: {
                  title: '运行环境',
                  description: '与此组件目录关联的运行环境',
                  type: 'string',
                  enum: ['KUBEFLOW_PIPELINES', 'APACHE_AIRFLOW'],
                  uihints: {
                    category: 'Runtime'
                  }
                },
                categories: {
                  title: '目录名称',
                  description:
                    '与此组件目录相关联的目录名称(在此注册中心中定义的组件将根据这些类别在组件面板中进行组织)',
                  type: 'array',
                  items: {
                    type: 'string',
                    maxLength: 18
                  },
                  uihints: {
                    category: 'Component Categories'
                  }
                },
                paths: {
                  title: '目录',
                  description:
                    '本地文件系统中目录的路径列表，每个目录包含一个或多个组件规范文件',
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  uihints: {
                    category: 'Configuration'
                  }
                },
                include_subdirs: {
                  title: '包含子目录',
                  description:
                    '指示是否应在子目录上执行对组件规范文件的递归搜索',
                  type: 'boolean',
                  uihints: {
                    category: 'Configuration'
                  }
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
          title: '文件系统',
          name: 'local-file-catalog',
          display_name: '文件系统',
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
              title: '模式名称',
              description: '与此实例关联的模式',
              type: 'string',
              const: 'local-file-catalog'
            },
            display_name: {
              title: '展示名称',
              description: '显示此组件目录的名称',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: '特定于此元数据的其他数据',
              type: 'object',
              properties: {
                description: {
                  title: '描述',
                  description: '此组件目录的描述',
                  type: 'string'
                },
                runtime_type: {
                  title: '运行环境',
                  description: '与此组件目录关联的运行环境',
                  type: 'string',
                  enum: ['KUBEFLOW_PIPELINES', 'APACHE_AIRFLOW'],
                  uihints: {
                    category: 'Runtime'
                  }
                },
                categories: {
                  title: '目录名称',
                  description:
                    '与此组件目录相关联的目录名称(在此注册中心中定义的组件将根据这些类别在组件面板中进行组织)',
                  type: 'array',
                  items: {
                    type: 'string',
                    maxLength: 18
                  },
                  uihints: {
                    category: 'Component Categories'
                  }
                },
                base_path: {
                  title: '可选基础目录',
                  description: '一个可选的基目录，可以从中解析path的给定值',
                  type: 'string',
                  uihints: {
                    category: 'Configuration'
                  }
                },
                paths: {
                  title: '路径',
                  description: '本地文件系统中各个组件规范文件的路径列表',
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  uihints: {
                    category: 'Configuration'
                  }
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
          title: 'URL',
          name: 'url-catalog',
          display_name: 'URL',
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
              title: '模式名称',
              description: '与此实例关联的模式',
              type: 'string',
              const: 'url-catalog'
            },
            display_name: {
              title: '展示名称',
              description: '显示此组件目录的名称',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: '特定于此元数据的其他数据',
              type: 'object',
              properties: {
                description: {
                  title: '描述',
                  description: '此组件目录的描述',
                  type: 'string'
                },
                runtime_type: {
                  title: '运行环境',
                  description: '与此组件目录关联的运行环境',
                  type: 'string',
                  enum: ['KUBEFLOW_PIPELINES', 'APACHE_AIRFLOW'],
                  uihints: {
                    category: 'Runtime'
                  }
                },
                categories: {
                  title: '目录名称',
                  description:
                    '与此组件目录相关联的目录名称(在此注册中心中定义的组件将根据这些类别在组件面板中进行组织)',
                  type: 'array',
                  items: {
                    type: 'string',
                    maxLength: 18
                  },
                  uihints: {
                    category: 'Component Categories'
                  }
                },
                paths: {
                  title: 'URLs',
                  description: '指向各个组件规范文件的url列表',
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'uri'
                  },
                  uihints: {
                    category: 'Configuration',
                    items: {
                      'ui:placeholder': 'https://host:port/path/component_file'
                    }
                  }
                },
                auth_id: {
                  title: '用户ID',
                  description: '对指定URL资源具有读访问权限的用户ID',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    category: 'Source credentials'
                  }
                },
                auth_password: {
                  title: '密码',
                  description: '指定用户ID的密码或API密钥',
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
        },
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/master/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/examples/master/component-catalog-connectors/kfp-example-components-connector/kfp_examples_connector/elyra-kfp-catalog.json',
          title: 'kpf示例',
          name: 'elyra-kfp-examples-catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.ComponentCatalogMetadata',
          uihints: {
            title: 'kpf示例',
            icon: '',
            reference_url:
              'https://github.com/elyra-ai/examples/tree/master/component-catalog-connectors/kfp-example-components-connector'
          },
          properties: {
            schema_name: {
              title: '模式名称',
              description: '与此实例关联的模式',
              type: 'string',
              const: 'elyra-kfp-examples-catalog'
            },
            display_name: {
              title: '展示名称',
              description: '显示此组件目录的名称',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: '特定于此元数据的其他数据',
              type: 'object',
              properties: {
                description: {
                  title: '描述',
                  description: 'kfp组件集合',
                  type: 'string',
                  default: 'kfp示例管道组件'
                },
                runtime_type: {
                  title: '运行环境',
                  description: '要为其加载示例组件的运行环境.',
                  type: 'string',
                  enum: ['KUBEFLOW_PIPELINES'],
                  default: 'KUBEFLOW_PIPELINES',
                  uihints: {
                    field_type: 'dropdown'
                  }
                },
                categories: {
                  title: '目录名称',
                  description:
                    '示例组件将被添加到管道编辑器面板中的指定类别中.',
                  type: 'array',
                  items: {
                    type: 'string',
                    maxLength: 18
                  },
                  default: ['examples'],
                  uihints: {
                    field_type: 'array',
                    category: 'Component Categories'
                  }
                }
              },
              required: ['runtime_type']
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        }
      ]
    };
  }
};
