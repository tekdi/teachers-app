import DynamicForm from '@/components/DynamicForm';
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from '@/components/GeneratedSchemas';
import SimpleModal from '@/components/SimpleModal';
import { createUser, getFormRead } from '@/services/CreateUserService';
import { generateUsernameAndPassword } from '@/utils/Helper';
import { FormData } from '@/utils/Interfaces';
import { FormContext, FormContextType, RoleId } from '@/utils/app.constant';
import { Button, useTheme } from '@mui/material';
import { IChangeEvent } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { showToastMessage } from './Toastify';
import { editEditUser } from '@/services/ProfileService';
import { tenantId } from '../../app.config';

interface AddLearnerModalProps {
  open: boolean;
  onClose: () => void;
  onLearnerAdded?: () => void;
  formData?: object;
  isEditModal?: boolean;
  userId?: string;
  onReload?: (() => void) | undefined;
}
const AddLearnerModal: React.FC<AddLearnerModalProps> = ({
  open,
  onClose,
  onLearnerAdded,
  formData,
  isEditModal = false,
  userId,
  onReload,
}) => {
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();
  const [reloadProfile, setReloadProfile] = React.useState(false);
  const [credentials, setCredentials] = React.useState({
    username: '',
    password: '',
  });

  const { t } = useTranslation();
  const theme = useTheme<any>();

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

  const handleSubmit = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    // setOpenModal(true);
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
    console.log('Form data submitted:', data.formData);

    const formData = data.formData;
    console.log('Form data submitted:', formData);
    const schemaProperties = schema.properties;
    let cohortId, teacherData;
    if (typeof window !== 'undefined' && window.localStorage) {
      teacherData = JSON.parse(localStorage.getItem('teacherApp') || '');
      localStorage.getItem('cohortId') ?? localStorage.getItem('classId');
    }
    const { username, password } = generateUsernameAndPassword(
      teacherData?.state?.stateCode,
      ''
    );

    const apiBody: any = {
      username: username,
      password: password,
      tenantCohortRoleMapping: [
        {
          tenantId: tenantId,
          roleId: RoleId.STUDENT,
          cohortId: [cohortId],
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

    if (!isEditModal) {
      apiBody.customFields.push({
        fieldId: teacherData?.state?.blockId,
        value: [teacherData?.state?.blockCode],
      });
      apiBody.customFields.push({
        fieldId: teacherData?.state?.stateId,
        value: [teacherData?.state?.stateCode],
      });
      apiBody.customFields.push({
        fieldId: teacherData?.state?.districtId,
        value: [teacherData?.state?.districtCode],
      });
      console.log(apiBody);
    }

    try {
      if (isEditModal && userId) {
        console.log('apiBody', apiBody);
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
          showToastMessage(t('COMMON.LEARNER_UPDATED_SUCCESSFULLY'), 'success');
          setReloadProfile(true);
          onReload?.();
        }
      } else {
        const response = await createUser(apiBody);
        showToastMessage(t('LEARNERS.LEARNER_CREATED_SUCCESSFULLY'), 'success');
      }
      onClose();
      onLearnerAdded?.();
    } catch (error) {
      onClose();
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      setReloadProfile(true);
    }
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

  const CustomSubmitButton: React.FC<{ onClose: () => void }> = ({
    onClose,
  }) => (
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
    // handleGenerateCredentials();
    // try {
    //   const response = await createUser(learnerFormData);
    //   console.log('User created successfully', response);
    // } catch (error) {
    //   console.error('Error creating user', error);
    // }
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      showFooter={false}
      modalTitle={isEditModal ? t('COMMON.EDIT_LEARNER') : t('COMMON.NEW_LEARNER')}
    >
      {formData
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
              formData={formData}
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
  );
};

export default AddLearnerModal;
