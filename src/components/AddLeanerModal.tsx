import DynamicForm from '@/components/DynamicForm';
import React, { useEffect } from 'react';
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from '@/components/GeneratedSchemas';
import { IChangeEvent } from '@rjsf/core';
import ISubmitEvent from '@rjsf/core';
import { Box } from '@mui/material';
import { RJSFSchema } from '@rjsf/utils';
import SendCredentialModal from '@/components/SendCredentialModal';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getFormRead } from '@/services/CreateUserService';
import { FormData } from '@/utils/Interfaces';
import { FormContext, FormContextType } from '@/utils/app.constant';
import SimpleModal from '@/components/SimpleModal';
import { useTranslation } from 'react-i18next';

interface AddLearnerModalProps {
  open: boolean;
  onClose: () => void;
}
const AddLearnerModal: React.FC<AddLearnerModalProps> = ({ open, onClose }) => {
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();
  const { t } = useTranslation();

  useEffect(() => {
    const getAddLearnerFormData = async () => {
      try {
        const response: FormData = await getFormRead(
          FormContext.USERS,
          FormContextType.STUDENT
        );
        console.log('sortedFields', response);

        if (response) {
          const { schema, uiSchema } = GenerateSchemaAndUiSchema(response, t);
          setSchema(schema);
          setUiSchema(uiSchema);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    getAddLearnerFormData();
  }, []);

  const handleSubmit = (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    // setOpenModal(true);
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
    <>
      <SimpleModal
        open={open}
        onClose={onClose}
        primaryText="Back"
        primaryActionHandler={() => {
          const formElement = document.getElementById(
            'dynamic-form'
          ) as HTMLFormElement;
          if (formElement) {
            formElement.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true })
            );
          }
        }}
        secondaryText="Create"
        secondaryActionHandler={onClose}
        modalTitle={t('COMMON.NEW_LEARNER')}
      >
        {schema && uiSchema && (
          <DynamicForm
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onError={handleError}
            widgets={{}}
            showErrorList={true}
            customFields={customFields}
          />
        )}
      </SimpleModal>
    </>
  );
};

export default AddLearnerModal;
