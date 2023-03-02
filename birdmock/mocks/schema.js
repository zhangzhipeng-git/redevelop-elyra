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
                  uihints: {
                    category: 'Source'
                  }
                },
                auth_id: {
                  title: 'User Id',
                  description:
                    'User id that has read access for the specified URL resource',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    category: 'Source credentials'
                  }
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
                  uihints: {
                    category: 'Source credentials'
                  }
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
                  uihints: {
                    category: 'Runtime'
                  }
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'Category names associated with this Component Catalog (the components defined in this registry will be organized in the component palette according to these categories)',
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
                  title: 'Directories',
                  description:
                    'A list of paths to directories in the local filesystem that each contain one or more component specification files',
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
                    'Indicates whether a recursive search for component specification files should be performed on subdirectories',
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
                  uihints: {
                    category: 'Runtime'
                  }
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'Category names associated with this Component Catalog (the components defined in this registry will be organized in the component palette according to these categories)',
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
                  title: 'Optional Base Directory',
                  description:
                    'An optional base directory from which the given values of Paths can be resolved',
                  type: 'string',
                  uihints: {
                    category: 'Configuration'
                  }
                },
                paths: {
                  title: 'Paths',
                  description:
                    'A list of paths to individual component specification files in the local filesystem',
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
                  uihints: {
                    category: 'Runtime'
                  }
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'Category names associated with this Component Catalog (the components defined in this registry will be organized in the component palette according to these categories)',
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
                  description:
                    'A list of URLs to individual component specification files',
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
                  title: 'User Id',
                  description:
                    'User id that has read access for the specified URL resources',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    category: 'Source credentials'
                  }
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
        },
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/master/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/examples/master/component-catalog-connectors/kfp-example-components-connector/kfp_examples_connector/elyra-kfp-catalog.json',
          title: 'Kubeflow Pipelines example components catalog',
          name: 'elyra-kfp-examples-catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.ComponentCatalogMetadata',
          uihints: {
            title: 'Kubeflow Pipelines example components catalog',
            icon: '',
            reference_url:
              'https://github.com/elyra-ai/examples/tree/master/component-catalog-connectors/kfp-example-components-connector'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'elyra-kfp-examples-catalog'
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
                  description:
                    'Curated collection of Kubeflow Pipeline components',
                  type: 'string',
                  default: 'Example pipeline components for Kubeflow Pipelines'
                },
                runtime_type: {
                  title: 'Runtime type',
                  description:
                    'The runtime for which to load the example components.',
                  type: 'string',
                  enum: ['KUBEFLOW_PIPELINES'],
                  default: 'KUBEFLOW_PIPELINES',
                  uihints: {
                    field_type: 'dropdown'
                  }
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'The example components will be added to the specified categories in the pipeline editor palette.',
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
