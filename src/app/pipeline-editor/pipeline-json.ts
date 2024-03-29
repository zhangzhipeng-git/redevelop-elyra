export default function ({ version, runtime_type, uuid }: any) {
  return {
    doc_type: 'pipe',
    version: '3.0',
    json_schema:
      'http://api.dataplatform.ibm.com/schemas/common-pipeline/pipeline-flow/pipeline-flow-v3-schema.json',
    id: 'auto-generated-pipeline',
    uuid,
    primary_pipeline: 'primary',
    pipelines: [
      {
        id: 'primary',
        nodes: [],
        app_data: {
          ui_data: {
            comments: []
          },
          version,
          runtime_type
        },
        runtime_ref: ''
      }
    ],
    schemas: []
  };
}
