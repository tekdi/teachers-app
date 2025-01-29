import { UiSchema } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';
import NumberInputField from './form/NumberInputField';
import { FormData, Field, FieldOption } from '@/utils/Interfaces';
import {
  getCurrentYearPattern,
  getEmailPattern,
  getLastDayDate,
} from '@/utils/Helper';

export const customFields = {
  NumberInputField: NumberInputField,
};

export const GenerateSchemaAndUiSchema = (
  formData: FormData,
  t: (key: string) => string
) => {
  const schema: JSONSchema7 = {
    //Form schema
    title: '',
    description: '',
    type: 'object',
    required: [],
    properties: {},
    dependencies: {},
  };

  const uiSchema: UiSchema = {}; //form ui schema
  const formValues: any = {};

  formData?.fields?.forEach((field: Field) => {
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
      pattern,
      isRequired,
    } = field;

    const fieldSchema: any = {
      title: t(`FORM.${label}`),
      fieldId: field.fieldId ?? field.fieldId,
    };

    const fieldUiSchema: any = {};

    if (field.default) {
      formValues[field.name] = field.default;
    }

    switch (type) {
      case 'text':
        fieldSchema.type = 'string';
        if (field?.hint) {
          fieldUiSchema['ui:help'] = t(`FORM.${field?.hint}`);
        }
        if (name === 'username')
          fieldUiSchema['ui:widget'] = 'UsernameWithSuggestions';

        break;
      case 'email':
        fieldSchema.type = 'string';
        fieldSchema.format = 'email';
        fieldSchema.pattern = getEmailPattern();
        break;
      case 'numeric':
        fieldSchema.type = 'number';
        if (field?.maxLength) {
          fieldSchema.maximum = Number(field.maxLength);
        }

        if (field?.minLength !== undefined && field?.minLength !== null) {
          fieldSchema.minimum = Number(field.minLength);
        }
        fieldUiSchema['ui:widget'] = 'CustomNumberWidget';

        break;
      case 'drop_down':
        fieldSchema.type = 'string';
        fieldSchema.isDropdown = true;
        // fieldSchema.oneOf = options.map((opt: FieldOption) => ({
        //   const: opt.value,
        //   title:
        //     t(`FORM.${opt.label}`) === `FORM.${opt.label}`
        //       ? opt.label
        //       : t(`FORM.${opt.label}`),
        // }));
        fieldUiSchema['ui:widget'] = 'select';
        break;
      case 'checkbox':
        fieldSchema.type = 'array';
        fieldSchema.checkbox = true;
        fieldSchema.items = {
          type: 'string',
          oneOf: options.map((opt: FieldOption) => ({
            const: opt.value,
            title:
              t(`FORM.${opt.label}`) === `FORM.${opt.label}`
                ? opt.label
                : t(`FORM.${opt.label}`),
          })),
        };
        fieldSchema.uniqueItems = true;
        fieldUiSchema['ui:widget'] = 'checkboxes';
        break;
      case 'radio':
        fieldSchema.type = 'string';
        fieldSchema.oneOf = options.map((opt: FieldOption) => ({
          const: opt.value,
          title:
            t(`FORM.${opt.label}`) === `FORM.${opt.label}`
              ? opt.label
              : t(`FORM.${opt.label}`),
        }));
        fieldUiSchema['ui:widget'] = 'CustomRadioWidget';
        break;
      case 'date':
        fieldSchema.type = 'string';
        fieldSchema.format = 'date';
        fieldUiSchema['ui:widget'] = 'date';
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

    // if (isMultiSelect && type === 'drop_down') {
    //   fieldSchema.type = 'array';
    //   fieldSchema.items = {
    //     type: 'string',
    //     oneOf: options.map((opt: FieldOption) => ({
    //       const: opt.value,
    //       title:
    //         t(`FORM.${opt.label}`) === `FORM.${opt.label}`
    //           ? opt.label
    //           : t(`FORM.${opt.label}`),
    //     })),
    //   };
    //   fieldSchema.uniqueItems = true;
    //   fieldUiSchema['ui:widget'] = 'select';
    // }

    if (isMultiSelect && type === 'drop_down' && maxSelections !== 1) {
      fieldSchema.type = 'array';
      fieldSchema.items = {
        type: 'string',
        enum: options.map((opt: FieldOption) => opt.value),
      };
      fieldSchema.uniqueItems = true;
      fieldSchema.enumNames = options.map((opt: FieldOption) =>
        t(`FORM.${opt.label}`) === `FORM.${opt.label}`
          ? opt.label
          : t(`FORM.${opt.label}`)
      );
      if (maxSelections) {
        fieldSchema.maxItems = maxSelections;
      }
      if (maxSelections === 1) {
        fieldUiSchema['ui:widget'] = 'select';
      } else {
        fieldUiSchema['ui:widget'] = 'MultiSelectDropdown';
      }
    }

    if (isMultiSelect && maxSelections === 1 && type === 'drop_down') {
      fieldSchema.type = 'string';
      fieldSchema.isDropdown = true;
      fieldSchema.oneOf = options.map((opt: FieldOption) => ({
        const: opt.value,
        title:
          t(`FORM.${opt.label}`) === `FORM.${opt.label}`
            ? opt.label
            : t(`FORM.${opt.label}`),
      }));
      fieldUiSchema['ui:widget'] = 'select';
    }

    if (!isMultiSelect && type === 'drop_down') {
      fieldSchema.type = 'string';
      fieldSchema.isDropdown = true;
      fieldSchema.oneOf = options.map((opt: FieldOption) => ({
        const: opt.value,
        title:
          t(`FORM.${opt.label}`) === `FORM.${opt.label}`
            ? opt.label
            : t(`FORM.${opt.label}`),
      }));
      fieldUiSchema['ui:widget'] = 'select';
    }

    if (isMultiSelect && type === 'checkbox') {
      fieldSchema.type = 'array';
      fieldSchema.isCheckbox = true;
      fieldSchema.items = {
        type: 'string',
        oneOf: options.map((opt: FieldOption) => ({
          const: opt.value,
          title:
            t(`FORM.${opt.label}`) === `FORM.${opt.label}`
              ? opt.label
              : t(`FORM.${opt.label}`),
        })),
      };
      fieldSchema.uniqueItems = true;
      fieldUiSchema['ui:widget'] = 'checkboxes';
      //       fieldUiSchema['ui:widget'] = 'MultiSelectCheckboxes';

      if (isRequired) {
        fieldSchema.minItems = 1;
      }
    }

    if (pattern) {
      fieldSchema.pattern = pattern;
      // fieldUiSchema["ui:help"]= "Only alphabetic characters are allowed.";
    }

    if (isRequired) {
      schema.required?.push(name);
    }

    if (field?.minLength) {
      fieldSchema.minLength = Number(field.minLength);
    }

    if (field?.default) {
      fieldSchema.default = field.default;
    }

    if (field?.maxLength) {
      fieldSchema.maxLength = Number(field.maxLength);
    }

    if (field?.validation) {
      if (field?.validation?.includes('numeric')) {
        // fieldUiSchema['ui:field'] = 'NumberInputField';
      }
      if (field?.validation?.includes('currentYear')) {
        fieldSchema.pattern = getCurrentYearPattern();
      }
      if (field?.validation?.includes('dob')) {
        // fieldSchema.minimum = '1900-01-01';
        // fieldSchema.maximum = getLastDayDate();
      }
      fieldSchema.validation = field.validation;
    }
    if (field.dependsOn) {
      const dependencyField = field.dependsOn;

      schema.dependencies = schema.dependencies || {};

      schema.dependencies[dependencyField] =
        schema.dependencies[dependencyField] ||
        ({
          properties: {},
        } as JSONSchema7);

      const dependencyObject = schema.dependencies[
        dependencyField
      ] as JSONSchema7;

      dependencyObject.properties = {
        ...dependencyObject.properties,
        [name]: fieldSchema,
      };

      schema.dependencies[dependencyField] = dependencyObject;
    } else {
      if (schema.properties) {
        schema.properties[name] = fieldSchema;
        uiSchema[name] = fieldUiSchema;
      }
    }

    if (schema !== undefined && schema.properties) {
      schema.properties[name] = fieldSchema;
      uiSchema[name] = fieldUiSchema;
    }
  });

  return { schema, uiSchema, customFields, formValues };
};
