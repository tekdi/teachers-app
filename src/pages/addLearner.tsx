import DynamicForm from '@/components/DynamicForm';
import React from 'react';
import { schema, uiSchema } from '@/utils/schema';
import { IChangeEvent } from '@rjsf/core';
import ISubmitEvent from '@rjsf/core';
import { Box } from '@mui/material';
import { RJSFSchema } from '@rjsf/utils';

const addLearner = () => {
  const handleSubmit = (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    const target = event.target as HTMLFormElement;
    const elementsArray = Array.from(target.elements);

    for (const element of elementsArray) {
      if (
        (element instanceof HTMLInputElement ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement) &&
        (element.value === '' ||
          (Array.isArray(element.value) && element.value.length === 0))
      ) {
        element.focus();
        return;
      }
    }
    console.log('Form data submitted:', data.formData);
  };

  const handleChange = (event: IChangeEvent<any>) => {
    console.log('Form data changed:', event.formData);
  };

  const handleError = (errors: any) => {
    console.log('Form errors:', errors);
  };

  return (
    <Box margin={'5rem'}>
      <DynamicForm
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onError={handleError}
        widgets={{}}
        showErrorList={true}
      />
    </Box>
  );
};

export default addLearner;
