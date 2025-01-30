import useSubmittedButtonStore from '@/store/useSubmittedButtonStore';
import { getCurrentYearPattern, getEmailPattern } from '@/utils/Helper';
import { IChangeEvent, withTheme } from '@rjsf/core';
import { Theme as MaterialUITheme } from '@rjsf/mui';
import { RJSFSchema, RegistryFieldsType, WidgetProps } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { useTranslation } from 'next-i18next';
import React, { ReactNode, useEffect, useState } from 'react';
import CustomRadioWidget from './CustomRadioWidget';
import MultiSelectCheckboxes from './MultiSelectCheckboxes';
import MultiSelectDropdown from './MultiSelectDropdown';
import CustomNumberWidget from './CustomNumberWidget';
import UsernameWithSuggestions from './UsernameWithSuggestions';
import { customValidation } from './FormValidation';
import { userNameExist } from '@/services/CreateUserService';

const FormWithMaterialUI = withTheme(MaterialUITheme);

interface DynamicFormProps {
  schema: any;
  uiSchema: object;
  formData?: {
    username?: string;
    [key: string]: any;
  };
  onSubmit: (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => void | Promise<void>;
  onChange: (event: IChangeEvent<any>) => void;
  onError: (errors: any) => void;
  setFormData?: (data: any) => void;
  showErrorList: boolean;

  widgets: {
    [key: string]: React.FC<WidgetProps<any, RJSFSchema, any>>;
  };
  customFields?: {
    [key: string]: React.FC<RegistryFieldsType<any, RJSFSchema, any>>;
  };
  children?: ReactNode;
  isEdit?: boolean;
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
  setFormData,
  isEdit = false,
}) => {
  const widgets = {
    MultiSelectCheckboxes: MultiSelectCheckboxes,
    CustomRadioWidget: CustomRadioWidget,
    MultiSelectDropdown: MultiSelectDropdown,
    CustomNumberWidget: CustomNumberWidget,
    UsernameWithSuggestions: UsernameWithSuggestions as React.FC<
      WidgetProps<any, RJSFSchema, any>
    >,
  };
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [storedSuggestions, setStoredSuggestions] = useState<string[]>([]);

  const [isGetUserName, setIsGetUserName] = useState<boolean>(false);

  const submittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.submittedButtonStatus
  );
  const setSubmittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.setSubmittedButtonStatus
  );

  
  useEffect(() => {
    setSubmittedButtonStatus(false);
  }, []);

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
  const sanitizeFormData = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map((item) =>
        typeof item === 'undefined' ? '' : sanitizeFormData(item)
      );
    }
    if (data !== null && typeof data === 'object') {
      return Object.fromEntries(
        Object.entries(data)?.map(([key, value]) => [
          key,
          value === 'undefined' ? '' : sanitizeFormData(value),
        ])
      );
    }
    return data;
  };
  function transformErrors(errors: any) {
    console.log('errors', errors);
    const currentYearPattern = new RegExp(getCurrentYearPattern());
    const emailPattern = new RegExp(getEmailPattern());

    errors = errors.filter(
      (item: any, index: number, self: any) =>
        index === self.findIndex((t: any) => t.property === item.property)
    );

    return errors.map((error: any) => {
      switch (error.name) {
        case 'required': {
          error.message = submittedButtonStatus
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
              error.message = t('FORM_ERROR_MESSAGES.MUST_BE_LESS_THAN', {
                fieldname: t('FIELDS.AGE'),
                maxLength: schema.properties?.[property]?.maxLength,
              });
            }
          } else if (
            schema.properties?.[property]?.validation?.includes('numeric')
          ) {
            error.message = t('FORM_ERROR_MESSAGES.MAX_LENGTH_DIGITS_ERROR', {
              maxLength: schema.properties?.[property]?.maxLength,
            });
          }

          break;
        }

        case 'minimum': {
          const property = error.property.substring(1);
          if (property === 'age') {
            if (
              schema.properties?.[property]?.validation?.includes('numeric')
            ) {
              error.message = t('FORM_ERROR_MESSAGES.MUST_BE_GREATER_THAN', {
                fieldname: property,
                minLength: schema.properties?.[property]?.minLength,
              });
            }
          } else if (
            schema.properties?.[property]?.validation?.includes('numeric')
          ) {
            error.message = t('FORM_ERROR_MESSAGES.MIN_LENGTH_DIGITS_ERROR', {
              minLength: schema.properties?.[property]?.minLength,
            });
          }
          break;
        }

        case 'pattern': {
          const pattern = error?.params?.pattern;
          const property = error.property.substring(1);

          switch (pattern) {
            case '^(?=.*[a-zA-Z])[a-zA-Z ]+$': {
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
            case '^[a-zA-Z0-9.@]+$': {
              error.message = t(
                'FORM_ERROR_MESSAGES.SPACE_AND_SPECIAL_CHARACTERS_NOT_ALLOWED'
              );
              break;
            }
            default: {
              if (error?.property === '.email') {
                const validEmail = emailPattern.test(pattern);
                if (!validEmail) {
                  error.message = t('FORM_ERROR_MESSAGES.ENTER_VALID_EMAIL');
                }
              } else {
                const validRange = currentYearPattern.test(pattern);
                if (!validRange) {
                  error.message = t('FORM_ERROR_MESSAGES.ENTER_VALID_YEAR');
                }
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
            case 'email':
              {
                error.message = t('FORM_ERROR_MESSAGES.ENTER_VALID_EMAIL');
              }
              break;
          }
          break;
        }
        case 'minItems': {
          const property = error.property.substring(1);
          if (
            schema.properties?.[property]?.type === 'array' &&
            schema.required?.includes(property)
          ) {
            error.message = submittedButtonStatus
              ? t('FORM_ERROR_MESSAGES.THIS_IS_REQUIRED_FIELD', {
                  minLength: schema.properties?.[property]?.minLength,
                })
              : '';
          }
          break;
        }
      }

      return error;
    });
  }
  const validateUsername = async (userData: {
    firstName: string;
    lastName: string;
    username: string;
  }) => {
    try {
      console.log('suggestions.length', suggestions.length);
      if (suggestions.length === 0) {
        const response = await userNameExist(userData);
        setSuggestions([response?.suggestedUsername]);
        setStoredSuggestions([response?.suggestedUsername]);
        setIsGetUserName(false);
      }
    } catch (error) {
      setSuggestions([]);
      setIsGetUserName(true);
      console.error('Error validating username:', error);
    }
  };
  const handleChange = async (event: any) => {
    const sanitizedData = sanitizeFormData(event.formData);
    if (event.formData?.username !== formData?.username && (formData?.username||formData?.username==="")) {
      if (event.formData?.username !== '') {
        setIsGetUserName(false);
        setSuggestions([]);
      } else setSuggestions(storedSuggestions);
    }
    onChange({ ...event, formData: sanitizedData });
  };
  const handleUsernameBlur = async (username: string) => {
    if (
      username &&
      formData?.firstName &&
      formData?.lastName &&
      !isGetUserName
    ) {
      const userData = {
        firstName: formData?.firstName,
        lastName: formData?.lastName,
        username: username,
      };
      await validateUsername(userData);
    }
  };
  const handleFirstLastNameBlur = async (lastName: string) => {
    if (lastName && !isEdit && !isGetUserName) {
      try {
        console.log('Username onblur called', formData);
        if (formData?.firstName && formData?.lastName) {
          if (setFormData) {
            setFormData((prev: any) => ({
              ...prev,
              username: formData.username
                ? formData.username
                : `${formData?.firstName}${formData?.lastName}`.toLowerCase(),
            }));
            const userData = {
              firstName: formData?.firstName,
              lastName: formData?.lastName,
              username: formData.username
                ? formData.username
                : `${formData?.firstName}${formData?.lastName}`.toLowerCase(),
            };
            await validateUsername(userData);
          }
        }
      } catch (error) {
        setSuggestions([]);

        console.error('Error validating username:', error);
      }
    }
  };

  const handleSuggestionSelect = (selectedUsername: string) => {
    if (setFormData)
      setFormData((prev: any) => ({
        ...prev,
        username: selectedUsername,
      }));
    setIsGetUserName(true);
    setSuggestions([]);
  };

  return (
    <div className="form-parent">
      <FormWithMaterialUI
        schema={schema}
        uiSchema={uiSchema}
        formData={sanitizeFormData(formData)}
        onChange={handleChange}
        onSubmit={onSubmit}
        validator={validator}
        liveValidate
        customValidate={customValidation(schema, t)}
        showErrorList={false}
        widgets={widgets}
        noHtml5Validate
        onError={handleError}
        transformErrors={transformErrors}
        fields={customFields}
        formContext={{
          suggestions,
          onSuggestionSelect: handleSuggestionSelect,
        }}
        onBlur={(field, value) => {
          if (field === 'username') {
            handleUsernameBlur(value);
          }
          if (field === 'root_lastName' || field === 'root_firstName') {
            handleFirstLastNameBlur(value);
          }
        }}
      >
        {children}
      </FormWithMaterialUI>
    </div>
  );
};

export default DynamicForm;
