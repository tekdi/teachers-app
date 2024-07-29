import {
  GenerateSchemaAndUiSchema,
  customFields,
} from '@/components/GeneratedSchemas';
import { FormContext, FormContextType, RoleId } from '@/utils/app.constant';
import React, { useEffect } from 'react';

import DynamicForm from '@/components/DynamicForm';
import SendCredentialModal from '@/components/SendCredentialModal';
import SimpleModal from '@/components/SimpleModal';
import { createUser, getFormRead } from '@/services/CreateUserService';
import { generateUsernameAndPassword } from '@/utils/Helper';
import { Field, FormData } from '@/utils/Interfaces';
import { IChangeEvent } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { useTranslation } from 'next-i18next';

interface AddFacilitatorModalprops {
  open: boolean;
  onClose: () => void;
}
const AddFacilitatorModal: React.FC<AddFacilitatorModalprops> = ({
  open,
  onClose,
}) => {
  const [schema, setSchema] = React.useState<any>();
  const [openModal, setOpenModal] = React.useState(false);
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
        let centerOptionsList;
        if (typeof window !== 'undefined' && window.localStorage) {
          const CenterList = localStorage.getItem('CenterList');
          const centerOptions = CenterList ? JSON.parse(CenterList) : [];
          centerOptionsList = centerOptions.map(
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

  const handleSubmit = async (
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

    const formData = data.formData;
    console.log('Form data submitted:', formData);
    const schemaProperties = schema.properties;

    const { username, password } = generateUsernameAndPassword('MH', 'F');

    const apiBody: any = {
      username: username,
      password: password,
      tenantCohortRoleMapping: [
        {
          tenantId: 'ef99949b-7f3a-4a5f-806a-e67e683e38f3',
          roleId: RoleId.TEACHER,
          cohortId: formData?.assignCenters,
        },
      ],
      customFields: [],
    };

    Object.entries(formData).forEach(([fieldKey, fieldValue]) => {
      const fieldSchema = schemaProperties[fieldKey];
      const fieldId = fieldSchema?.fieldId;
      console.log(
        `FieldID: ${fieldId}, FieldValue: ${fieldValue}, type: ${typeof fieldValue}`
      );

      if (fieldId === null || fieldId === 'null') {
        if (typeof fieldValue !== 'object') {
          apiBody[fieldKey] = fieldValue;
        }
      } else if (
        Object.hasOwn(fieldSchema, 'isDropdown') ||
        Object.hasOwn(fieldSchema, 'isCheckbox')
      ) {
        apiBody.customFields.push({
          fieldId: fieldId,
          value: [String(fieldValue)],
        });
      } else {
        apiBody.customFields.push({
          fieldId: fieldId,
          value: String(fieldValue),
        });
      }
    });

    if (typeof window !== 'undefined' && window.localStorage) {
      const teamLeaderData = JSON.parse(
        localStorage.getItem('teamLeadApp') ?? ''
      );
      console.log(teamLeaderData);
    }
    // apiBody.customFields.push({
    //   fieldId: teamLeaderData?.state?.blockId,
    //   value: [teamLeaderData?.state?.blockCode],
    // });
    // apiBody.customFields.push({
    //   fieldId: teamLeaderData?.state?.stateId,
    //   value: [teamLeaderData?.state?.stateCode],
    // });
    // apiBody.customFields.push({
    //   fieldId: teamLeaderData?.state?.districtId,
    //   value: [teamLeaderData?.state?.districtCode],
    // });
    console.log(apiBody);

    const response = await createUser(apiBody);
    console.log(response);
  };

  const handleChange = (event: IChangeEvent<any>) => {
    console.log('Form data changed:', event.formData);
  };

  const handleError = (errors: any) => {
    console.log('Form errors:', errors);
  };

  const onCloseModal = () => {
    setOpenModal(false);
    onClose();
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
          />
        )}
      </SimpleModal>

      <SendCredentialModal open={openModal} onClose={onCloseModal} />
    </>
  );
};

export default AddFacilitatorModal;
