import DynamicForm from '@/components/DynamicForm';
import React, { useEffect } from 'react';
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from '@/components/GeneratedSchemas';
import { IChangeEvent } from '@rjsf/core';
import ISubmitEvent from '@rjsf/core';
import { Box, Button, useTheme } from '@mui/material';
import { RJSFSchema } from '@rjsf/utils';
import SendCredentialModal from '@/components/SendCredentialModal';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { createUser, getFormRead } from '@/services/CreateUserService';
import { FormData } from '@/utils/Interfaces';
import { FormContext, FormContextType } from '@/utils/app.constant';
import SimpleModal from '@/components/SimpleModal';
import { useTranslation } from 'react-i18next';
import { generateUsernameAndPassword } from '@/utils/Helper';

interface AddLearnerModalProps {
  open: boolean;
  onClose: () => void;
}
const AddLearnerModal: React.FC<AddLearnerModalProps> = ({ open, onClose }) => {
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();
  const [credentials, setCredentials] = React.useState({ username: '', password: '' });
  // const [learnerFormData, setLearnerFormData] = React.useState<any>();
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const handleGenerateCredentials = () => {
    const stateCode = 'MH';
    const newCredentials = generateUsernameAndPassword(stateCode);
    setCredentials(newCredentials);
  };

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
    // setFormData({
    //   ...formData,
    //   [event.target.name]: event.target.value
    // });
  };

  const handleError = (errors: any) => {
    console.log('Form errors:', errors);
  };

  const CustomSubmitButton: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div
      style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            '&.Mui-disabled': {
              backgroundColor: theme?.palette?.primary?.main,
            },
            minWidth: '84px',
            height: '2.5rem',
            padding: theme.spacing(1),
            fontWeight: '500',
            width: '48%',
          }}
          onClick={onClose}
        >
          {t('COMMON.BACK')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            '&.Mui-disabled': {
              backgroundColor: theme?.palette?.primary?.main,
            },
            minWidth: '84px',
            height: '2.5rem',
            padding: theme.spacing(1),
            fontWeight: '500',
            width: '48%',
          }}
          onClick={secondaryActionHandler}
        >
          {t('COMMON.SUBMIT')}
        </Button>
      </>
    </div>
  );

  const primaryActionHandler = () => {
    onClose();
  };

  const secondaryActionHandler = async (e: React.FormEvent) => {
    // console.log('Secondary action handler clicked');
    e.preventDefault();
    handleGenerateCredentials();
    // try {
    //   const response = await createUser(learnerFormData);
    //   console.log('User created successfully', response);
    // } catch (error) {
    //   console.error('Error creating user', error);
    // }
  };

  return (
    <>
      <SimpleModal
        open={open}
        onClose={onClose}
        showFooter={false}
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
          >
            <CustomSubmitButton onClose={primaryActionHandler}/>
            </DynamicForm>
        )}
      </SimpleModal>
    </>
  );
};

export default AddLearnerModal;
