import DynamicForm from '@/components/DynamicForm';
import React from 'react';
import { schema, uiSchema } from '@/components/GeneratedSchemas';
import { IChangeEvent } from '@rjsf/core';
import ISubmitEvent from '@rjsf/core';
import { Box } from '@mui/material';
import { RJSFSchema } from '@rjsf/utils';
import SendCredentialModal from '@/components/SendCredentialModal';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const addLearner = () => {
  const [openModal, setOpenModal] = React.useState(false);

  const handleSubmit = (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    setOpenModal(true);
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

  const handleCloseModal = () => {
    setOpenModal(false);
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

      <SendCredentialModal open={openModal} onClose={handleCloseModal} />
    </Box>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}
export default addLearner;
