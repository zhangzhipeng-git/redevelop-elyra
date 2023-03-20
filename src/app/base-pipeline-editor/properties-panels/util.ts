import { UiSchema } from '@rjsf/core';

export function genUISchemaFromSchema(schema: any, uiSchema: UiSchema) {
  if (schema.uihints) Object.assign(uiSchema, schema.uihints);
  if (!schema.properties) return;
  for (const field in schema.properties) {
    const property = schema.properties[field];
    genUISchemaFromSchema(property, (uiSchema[field] = {}));
  }
}
