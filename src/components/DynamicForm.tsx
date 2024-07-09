import React from 'react';
import { IChangeEvent } from '@rjsf/core';
import ISubmitEvent from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { Theme as MaterialUITheme } from '@rjsf/mui';
import { withTheme } from '@rjsf/core';

const FormWithMaterialUI = withTheme(MaterialUITheme);

interface DynamicFormProps {
  schema: object;
  uiSchema: object;
  formData?: object;
  onSubmit: (data: ISubmitEvent<any>, event: React.FormEvent<any>) => void;
  onChange: (event: IChangeEvent<any>) => void;
  onError: (errors: any) => void;
  showErrorList: boolean;
}
const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  uiSchema,
  formData,
  onSubmit,
  onChange,
  onError,
}) => {
  return (
    <FormWithMaterialUI
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      onChange={onChange}
      onSubmit={onSubmit}
      onError={onError}
      validator={validator}
      liveValidate
      showErrorList={false}
    />
  );
};

export default DynamicForm;
