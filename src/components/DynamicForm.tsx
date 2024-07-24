import React, { ReactNode } from 'react';
import { IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { Theme as MaterialUITheme } from '@rjsf/mui';
import { withTheme } from '@rjsf/core';
import MultiSelectCheckboxes from './MultiSelectCheckboxes';
import CustomRadioWidget from './CustomRadioWidget';
import { RJSFSchema, RegistryFieldsType, WidgetProps } from '@rjsf/utils';
import { useTranslation } from 'next-i18next';
import { Button, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
  customFields: {
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
  const widgets = {
    MultiSelectCheckboxes: MultiSelectCheckboxes,
    CustomRadioWidget: CustomRadioWidget,
  };
  const { t } = useTranslation();

  // console.log('CustomErrorList', CustomErrorList);

  const handleError = (errors: any) => {
    if (errors.length > 0) {
      // Adjust the selector based on the actual structure of the form element names
      const property = errors[0].property?.replace(/^root\./, '');
      const errorField = document.querySelector(
        `[name$="${property}"]`
      ) as HTMLElement;

      if (errorField) {
        errorField.focus();
      } else {
        // If the name-based selector fails, try to select by ID as a fallback
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
    return errors.map((error: any) => {
      switch (error.name) {
        case 'required': {
          // error.message = t('FORM_ERROR_MESSAGES.FIELD_REQUIRED', {
          //   field: t(`FORM.${schema.properties[error.property].title}`),
          // });

          error.message = t('FORM_ERROR_MESSAGES.THIS_IS_REQUIRED_FIELD');
          break;
        }
        case 'pattern': {
          const property = error.property.substring(1);
          console.log('schema===>', schema);
          if (schema.properties?.[property]?.validation?.includes('numeric')) {
            error.message = t('FORM_ERROR_MESSAGES.ENTER_ONLY_DIGITS');
          } else if (
            schema.properties?.[property]?.validation?.includes(
              'characters-with-space'
            )
          ) {
            error.message = t(
              'FORM_ERROR_MESSAGES.NUMBER_AND_SPECIAL_CHARACTERS_NOT_ALLOWED'
            );
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
      }

      return error;
    });
  }

  function handleChange(event: any) {
    console.log('Form data event:', event);
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
