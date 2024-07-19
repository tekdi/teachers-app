import { FormContext, FormContextType } from '@/utils/app.constant';
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from '@/components/GeneratedSchemas';
import React, { useEffect } from 'react';

import { Box } from '@mui/material';
import DynamicForm from '@/components/DynamicForm';
import { Field } from '@/utils/Interfaces';
import { FormData } from '@/utils/Interfaces';
import { IChangeEvent } from '@rjsf/core';
import ISubmitEvent from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import SendCredentialModal from '@/components/SendCredentialModal';
import SimpleModal from '@/components/SimpleModal';
import { getFormRead } from '@/services/CreateUserService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

interface AddFacilitatorModalprops {
  open: boolean;
  onClose: () => void;
}
const AddFacilitatorModal: React.FC<AddFacilitatorModalprops> = ({
  open,
  onClose,
}) => {
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();
  const { t } = useTranslation();

  useEffect(() => {
    const getAddLearnerFormData = async () => {
      try {
        const response: FormData = await getFormRead(
          FormContext.USERS,
          FormContextType.TEACHER
        );
        console.log('sortedFields', response);
        if (typeof window !== 'undefined' && window.localStorage) {
          const CenterList = localStorage.getItem('CenterList');
          const centerOptions = CenterList ? JSON.parse(CenterList) : [];
          var centerOptionsList = centerOptions.map(
            (center: { cohortId: string; cohortName: string }) => ({
              value: center.cohortId,
              label: center.cohortName,
            })
          );
          console.log(centerOptionsList);
        }
        const assignCentersField: Field = {
          name: 'assignCenters',
          type: 'checkbox',
          label: 'ASSIGN_CENTERS',
          order: '7',
          fieldId: 'null',
          options: centerOptionsList,
          dependsOn: null,
          maxLength: null,
          minLength: null,
          isEditable: true,
          isPIIField: null,
          validation: [],
          placeholder: '',
          isMultiSelect: true,
          sourceDetails: {},
          required: true,
          coreField: 0,
          maxSelections: null,
        };
        response?.fields.push(assignCentersField);
        console.log(response);

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
        showFooter={false}
        modalTitle={t('COMMON.NEW_FACILITATOR')}
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
            // showTwoButtons={true}
          />
        )}
      </SimpleModal>
    </>
  );
};

export default AddFacilitatorModal;
