import { IChangeEvent, withTheme } from '@rjsf/core';
import { Theme as MaterialUITheme } from '@rjsf/mui';
import { RJSFSchema, RegistryFieldsType, WidgetProps } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { useTranslation } from 'next-i18next';
import React, { Children, ReactNode, useState } from 'react';
import CustomRadioWidget from './CustomRadioWidget';
import MultiSelectCheckboxes from './MultiSelectCheckboxes';
import MultiSelectDropdown from './MultiSelectDropdown';
import { getCurrentYearPattern } from '@/utils/Helper';
// import FormButtons from './FormButtons';
import { Button, useTheme } from '@mui/material';
const FormWithMaterialUI = withTheme(MaterialUITheme);

interface DynamicFormProps {
  schema: any;
  uiSchema: object;
  formData?: object;
  onSubmit: (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => void | Promise<void>;
  onChange: (event: IChangeEvent<any>) => void;
  onError: (errors: any) => void;
  showErrorList: boolean;

  widgets: {
    [key: string]: React.FC<WidgetProps<any, RJSFSchema, any>>;
  };
  customFields?: {
    [key: string]: React.FC<RegistryFieldsType<any, RJSFSchema, any>>;
  };
  children?: ReactNode;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  uiSchema,
  formData,
  onSubmit,
  onChange,
  onError,
  customFields,
  children,
}) => {
  console.log(formData);
  const widgets = {
    MultiSelectCheckboxes: MultiSelectCheckboxes,
    CustomRadioWidget: CustomRadioWidget,
    MultiSelectDropdown: MultiSelectDropdown,
  };
  const { t } = useTranslation();

  const handleError = (errors: any) => {
    if (errors.length > 0) {
      const property = errors[0].property?.replace(/^root\./, '');
      const errorField = document.querySelector(
        `[name$="${property}"]`
      ) as HTMLElement;

      if (errorField) {
        errorField.focus();
      } else {
        const fallbackField = document.getElementById(property) as HTMLElement;
        if (fallbackField) {
          fallbackField.focus();
        }
      }
    }
    onError(errors);
  };

  function transformErrors(errors: any) {
    console.log('errors', errors);
    console.log('schema', schema);
    const currentYearPattern = new RegExp(getCurrentYearPattern());

    return errors.map((error: any) => {
      const property = error.property.substring(1);

      switch (error.name) {
        case 'required': {
          error.message = children
            ? t('FORM_ERROR_MESSAGES.THIS_IS_REQUIRED_FIELD')
            : '';
          break;
        }
        case 'maximum': {
          const property = error.property.substring(1);
          if (property === 'age') {
            if (
              schema.properties?.[property]?.validation?.includes('numeric')
            ) {
              error.message = t(
                'FORM_ERROR_MESSAGES.AGE_MUST_BE_LESS_THAN_100',
                {
                  maxLength: schema.properties?.[property]?.maxLength,
                }
              );
            }
          } else {
            if (
              schema.properties?.[property]?.validation?.includes('numeric')
            ) {
              error.message = t('FORM_ERROR_MESSAGES.MAX_LENGTH_DIGITS_ERROR', {
                maxLength: schema.properties?.[property]?.maxLength,
              });
            }
          }

          break;
        }
        case 'minimum': {
          const property = error.property.substring(1);
          if (property === 'age') {
            if (
              schema.properties?.[property]?.validation?.includes('numeric')
            ) {
              error.message = t(
                'FORM_ERROR_MESSAGES.AGE_MUST_BE_GREATER_THAN_1',
                {
                  maxLength: schema.properties?.[property]?.maxLength,
                }
              );
            }
          } else {
            if (
              schema.properties?.[property]?.validation?.includes('numeric')
            ) {
              error.message = t('FORM_ERROR_MESSAGES.MIN_LENGTH_DIGITS_ERROR', {
                minLength: schema.properties?.[property]?.minLength,
              });
            }
          }
          break;
        }

        case 'pattern': {
          const pattern = error?.params?.pattern;
          const property = error.property.substring(1);

          switch (pattern) {
            case '^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$': {
              error.message = t(
                'FORM_ERROR_MESSAGES.NUMBER_AND_SPECIAL_CHARACTERS_NOT_ALLOWED'
              );
              break;
            }
            case '^[0-9]{10}$': {
              if (
                schema.properties?.[property]?.validation?.includes('mobile')
              ) {
                error.message = t(
                  'FORM_ERROR_MESSAGES.ENTER_VALID_MOBILE_NUMBER'
                );
              } else if (
                schema.properties?.[property]?.validation?.includes('.age')
              ) {
                error.message = t('age must be valid');
              } else {
                error.message = t(
                  'FORM_ERROR_MESSAGES.CHARACTERS_AND_SPECIAL_CHARACTERS_NOT_ALLOWED'
                );
              }
              break;
            }
            case '^d{10}$': {
              error.message = t(
                'FORM_ERROR_MESSAGES.CHARACTERS_AND_SPECIAL_CHARACTERS_NOT_ALLOWED'
              );
              break;
            }
            default: {
              const validRange = currentYearPattern.test(pattern);
              if (!validRange) {
                error.message = t('FORM_ERROR_MESSAGES.ENTER_VALID_YEAR');
              }
              break;
            }
          }
          break;
        }
        case 'minLength': {
          const property = error.property.substring(1);
          if (schema.properties?.[property]?.validation?.includes('numeric')) {
            error.message = t('FORM_ERROR_MESSAGES.MIN_LENGTH_DIGITS_ERROR', {
              minLength: schema.properties?.[property]?.minLength,
            });
          }
          break;
        }
        case 'maxLength': {
          const property = error.property.substring(1);
          if (schema.properties?.[property]?.validation?.includes('numeric')) {
            error.message = t('FORM_ERROR_MESSAGES.MAX_LENGTH_DIGITS_ERROR', {
              maxLength: schema.properties?.[property]?.maxLength,
            });
          }
          break;
        }
        case 'format': {
          const format = error?.params?.format;
          switch (format) {
            case 'email': {
              error.message = t('FORM_ERROR_MESSAGES.ENTER_VALID_EMAIL');
            }
          }
        }
      }

      return error;
    });
  }

  function handleChange(event: any) {
    console.log('Form data changed:', event.formData);
    onChange(event);
  }

  return (
    <div>
      <FormWithMaterialUI
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onChange={handleChange}
        onSubmit={onSubmit}
        validator={validator}
        liveValidate
        showErrorList={false}
        widgets={widgets}
        noHtml5Validate
        onError={handleError}
        transformErrors={transformErrors}
        fields={customFields}
      >
        {children}
      </FormWithMaterialUI>
    </div>
  );
};

export default DynamicForm;
