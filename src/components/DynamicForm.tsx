import React from 'react';
import { IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { Theme as MaterialUITheme } from '@rjsf/mui';
import { withTheme } from '@rjsf/core';
import MultiSelectCheckboxes from './MultiSelectCheckboxes';
import CustomRadioWidget from './CustomRadioWidget';
import { RJSFSchema, WidgetProps } from '@rjsf/utils';

const FormWithMaterialUI = withTheme(MaterialUITheme);

interface DynamicFormProps {
  schema: object;
  uiSchema: object;
  formData?: object;
  onSubmit: (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => void | undefined;
  onChange: (event: IChangeEvent<any>) => void;
  onError: (errors: any) => void;
  showErrorList: boolean;
  widgets: {
    [key: string]: React.FC<WidgetProps<any, RJSFSchema, any>>;
  };
}
const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  uiSchema,
  formData,
  onSubmit,
  onChange,
  onError,
}) => {
  const widgets = {
    MultiSelectCheckboxes: MultiSelectCheckboxes,
    CustomRadioWidget: CustomRadioWidget,
  };
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

  return (
    <FormWithMaterialUI
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      onChange={onChange}
      onSubmit={onSubmit}
      validator={validator}
      liveValidate
      showErrorList={false}
      widgets={widgets}
      noHtml5Validate
      onError={handleError}
      // ErrorList={CustomErrorList}
    />
  );
};

export default DynamicForm;
