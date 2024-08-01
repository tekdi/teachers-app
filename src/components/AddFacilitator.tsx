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
import { showToastMessage } from './Toastify';
import { editEditUser } from '@/services/ProfileService';
import { tenantId } from '../../app.config';

interface AddFacilitatorModalprops {
  open: boolean;
  onClose: () => void;
  userFormData?: object;
  isEditModal?: boolean;
  userId?: string;
  onReload?: (() => void) | undefined;
}
const AddFacilitatorModal: React.FC<AddFacilitatorModalprops> = ({
  open,
  onClose,
  userFormData,
  isEditModal = false,
  userId,
  onReload,
}) => {
  const [schema, setSchema] = React.useState<any>();
  const [openModal, setOpenModal] = React.useState(false);
  const [uiSchema, setUiSchema] = React.useState<any>();
  const [reloadProfile, setReloadProfile] = React.useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const getAddFacilitatorFormData = async () => {
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
          isRequired: true,
          coreField: 0,
          maxSelections: null,
        };
        if (!isEditModal) {
          response?.fields.push(assignCentersField);
          console.log(response);
        }

        if (response) {
          const { schema, uiSchema } = GenerateSchemaAndUiSchema(response, t);
          setSchema(schema);
          setUiSchema(uiSchema);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    getAddFacilitatorFormData();
  }, []);

  const handleSubmit = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    if (!isEditModal) {
      setOpenModal(true);
    }
    const target = event.target as HTMLFormElement;
    const elementsArray = Array.from(target.elements);

    // for (const element of elementsArray) {
    //   if (
    //     (element instanceof HTMLInputElement ||
    //       element instanceof HTMLSelectElement ||
    //       element instanceof HTMLTextAreaElement) &&
    //     (element.value === '' ||
    //       (Array.isArray(element.value) && element.value.length === 0))
    //   ) {
    //     element.focus();
    //     return;
    //   }
    // }

    const formData = data.formData;
    console.log('Form data submitted:', formData);
    const schemaProperties = schema.properties;

    const { username, password } = generateUsernameAndPassword('MH', 'F');

    const apiBody: any = {
      username: username,
      password: password,
      tenantCohortRoleMapping: [
        {
          tenantId: tenantId,
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
      } else {
        if (
          fieldSchema?.hasOwnProperty('isDropdown') ||
          fieldSchema.hasOwnProperty('isCheckbox')
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

    try {
      if (isEditModal && userId) {
        const userData = {
          name: apiBody.name,
          mobile: apiBody.mobile,
          father_name: apiBody.father_name,
        };
        const customFields = apiBody.customFields;
        console.log(customFields);
        const object = {
          userData: userData,
          customFields: customFields,
        };
        const response = await editEditUser(userId, object);
        if (response) {
          showToastMessage(
            t('COMMON.FACILITATOR_UPDATED_SUCCESSFULLY'),
            'success'
          );
          setReloadProfile(true);
          onReload?.();
        }
      } else {
        const response = await createUser(apiBody);
        console.log(response);
        showToastMessage(t('COMMON.FACILITATOR_ADDED_SUCCESSFULLY'), 'success');
      }
      onClose();
    } catch (error) {
      onClose();
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      setReloadProfile(true);
    }
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
        modalTitle={
          isEditModal
            ? t('COMMON.EDIT_FACILITATOR')
            : t('COMMON.NEW_FACILITATOR')
        }
      >
        {userFormData
          ? schema &&
            uiSchema && (
              <DynamicForm
                schema={schema}
                uiSchema={uiSchema}
                onSubmit={handleSubmit}
                onChange={handleChange}
                onError={handleError}
                widgets={{}}
                showErrorList={true}
                customFields={customFields}
                formData={userFormData}
              >
                {/* <CustomSubmitButton onClose={primaryActionHandler} /> */}
              </DynamicForm>
            )
          : schema &&
            uiSchema && (
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
                {/* <CustomSubmitButton onClose={primaryActionHandler} /> */}
              </DynamicForm>
            )}
      </SimpleModal>

      <SendCredentialModal open={openModal} onClose={onCloseModal} />
    </>
  );
};

export default AddFacilitatorModal;
