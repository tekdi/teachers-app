import { UiSchema } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';
import { apiResponse } from '@/utils/schema';

interface FieldOption {
  label: string;
  value: string;
}

interface Field {
  label: string;
  name: string;
  type: 'text' | 'numeric' | 'drop_down' | 'checkbox' | 'radio';
  isEditable: boolean;
  isPIIField?: boolean | null;
  placeholder?: string;
  validation?: any[];
  options: FieldOption[];
  isMultiSelect: boolean;
  maxSelections?: number | null;
  hint?: string | null;
  pattern?: string | null;
  maxLength?: number | null;
  minLength?: number | null;
  fieldId: string;
  dependsOn: boolean;
}

const GenerateSchemaAndUiSchema = (apiResponse: any) => {
  const schema: JSONSchema7 = {
    title: 'A registration form',
    description: 'A simple form example',
    type: 'object',
    required: [],
    properties: {},
    dependencies: {},
  };

  const uiSchema: UiSchema = {};

  apiResponse.result.forEach((field: Field) => {
    const {
      label,
      name,
      type,
      isEditable,
      validation,
      options,
      isMultiSelect,
      maxSelections,
      dependsOn,
    } = field;

    const fieldSchema: any = {
      title: label,
    };

    const fieldUiSchema: any = {};

    switch (type) {
      case 'text':
        fieldSchema.type = 'string';
        break;
      case 'numeric':
        fieldSchema.type = 'number';
        break;
      case 'drop_down':
        fieldSchema.type = 'string';
        fieldSchema.oneOf = options.map((opt: FieldOption) => ({
          const: opt.value,
          title: opt.label,
        }));
        fieldUiSchema['ui:widget'] = 'select';
        break;
      case 'checkbox':
        fieldSchema.type = 'array';
        fieldSchema.items = {
          type: 'string',
          oneOf: options.map((opt: FieldOption) => ({
            const: opt.value,
            title: opt.label,
          })),
        };
        fieldSchema.uniqueItems = true;
        fieldUiSchema['ui:widget'] = 'checkboxes';
        break;
      case 'radio':
        fieldSchema.type = 'string';
        fieldSchema.oneOf = options.map((opt: FieldOption) => ({
          const: opt.value,
          title: opt.label,
        }));
        fieldUiSchema['ui:widget'] = 'CustomRadioWidget';
        break;
      default:
        break;
    }

    if (isEditable === false) {
      fieldUiSchema['ui:disabled'] = true;
    }

    if (dependsOn) {
      // Handle dependencies logic if needed
    }

    if (isMultiSelect && type === 'drop_down') {
      fieldSchema.type = 'array';
      fieldSchema.items = {
        type: 'string',
        oneOf: options.map((opt: FieldOption) => ({
          const: opt.value,
          title: opt.label,
        })),
      };
      fieldSchema.uniqueItems = true;
      fieldUiSchema['ui:widget'] = 'select';
    }

    if (isMultiSelect && type === 'checkbox') {
      fieldSchema.type = 'array';
      fieldSchema.items = {
        type: 'string',
        oneOf: options.map((opt: FieldOption) => ({
          const: opt.value,
          title: opt.label,
        })),
      };
      fieldSchema.uniqueItems = true;
      fieldUiSchema['ui:widget'] = 'MultiSelectCheckboxes';
    }

    if (schema !== undefined && schema.properties) {
      schema.properties[name] = fieldSchema;
      uiSchema[name] = fieldUiSchema;
    }
  });

  return { schema, uiSchema };
};

const { schema, uiSchema } = GenerateSchemaAndUiSchema(apiResponse);

export { schema, uiSchema };
