import DynamicForm from '@/components/DynamicForm';
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from '@/components/GeneratedSchemas';
import SimpleModal from '@/components/SimpleModal';
import { useFormRead } from '@/hooks/useFormRead';
import { createUser } from '@/services/CreateUserService';
import { sendEmailOnLearnerCreation } from '@/services/NotificationService';
import { editEditUser } from '@/services/ProfileService';
import useSubmittedButtonStore from '@/store/useSubmittedButtonStore';
import { generateUsernameAndPassword } from '@/utils/Helper';
import {
  FormContext,
  FormContextType,
  RoleId,
  Telemetry,
} from '@/utils/app.constant';
import { telemetryFactory } from '@/utils/telemetry';
import { IChangeEvent } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import { addPassword, addUserName, tenantId } from '../../app.config';
import FormButtons from './FormButtons';
import SendCredentialModal from './SendCredentialModal';
import { showToastMessage } from './Toastify';
import Loader from './Loader';
import { Box } from '@mui/material';

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
  const [openModal, setOpenModal] = React.useState(false);
  const [learnerFormData, setLearnerFormData] = React.useState<any>();
  const [fullname, setFullname] = React.useState<any>();

  const { data: formResponse, isPending } = useFormRead(
    FormContext.USERS,
    FormContextType.STUDENT
  );

  const { t } = useTranslation();
  const setSubmittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.setSubmittedButtonStatus
  );
  let userEmail: string = '';
  if (typeof window !== 'undefined' && window.localStorage) {
    userEmail = localStorage.getItem('userEmail') ?? '';
  }

  useEffect(() => {
    if (formResponse) {
      console.log('formResponse', formResponse);
      const { schema, uiSchema } = GenerateSchemaAndUiSchema(formResponse, t);
      setSchema(schema);
      setUiSchema(uiSchema);
    }
  }, [formResponse]);

  const sendEmail = async (
    name: string,
    username: string,
    password: string,
    email: string,
    learnerName: string
  ) => {
    try {
      const response = await sendEmailOnLearnerCreation(
        name,
        username,
        password,
        email,
        learnerName
      );
      if (response?.email?.data?.[0]?.[0]?.status !== 'success') {
        showToastMessage(t('COMMON.USER_CREDENTIAL_SEND_FAILED'), 'error');
      }
      setOpenModal(true);
    } catch (error) {
      console.error('error in sending email', error);
    }
  };

  const handleSubmit = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    setTimeout(() => {
      setLearnerFormData(data.formData);
    });

    console.log('Form data submitted:', data.formData);

    const formData = data.formData;
    console.log('Form data submitted:', formData);
  };

  useEffect(() => {
    if (learnerFormData) {
      handleButtonClick();
    }
  }, [learnerFormData]);

  const handleButtonClick = async () => {
    console.log('Form data:', formData);
    setSubmittedButtonStatus(true);
    if (learnerFormData) {
      const schemaProperties = schema.properties;
      let cohortId, fieldData;
      if (typeof window !== 'undefined' && window.localStorage) {
        fieldData = JSON.parse(localStorage.getItem('fieldData') || '');
        cohortId = localStorage.getItem('classId');
      }
      const { username, password } = generateUsernameAndPassword(
        fieldData?.state?.stateCode,
        '',
        ''
      );
      const apiBody: any = {
        tenantCohortRoleMapping: [
          {
            tenantId: tenantId,
            roleId: RoleId.STUDENT,
            cohortId: [cohortId],
          },
        ],
        customFields: [],
      };
      if (addUserName) {
        apiBody.username = username;
      }

      if (addPassword) {
        apiBody.password = password;
      }

      Object.entries(learnerFormData).forEach(([fieldKey, fieldValue]) => {
        const fieldSchema = schemaProperties[fieldKey];
        const fieldId = fieldSchema?.fieldId;
        console.log(
          `FieldID: ${fieldId}, FieldValue: ${fieldValue}, type: ${typeof fieldValue}`
        );

        if (fieldId === null || fieldId === 'null') {
          if (typeof fieldValue !== 'object') {
            apiBody[fieldKey] = fieldValue;
            if (fieldKey === 'name') {
              setFullname(fieldValue);
            }
          }
        } else {
          if (
            Object.hasOwn(fieldSchema, 'isDropdown') ||
            Object.hasOwn(fieldSchema, 'isCheckbox')
          ) {
            apiBody.customFields.push({
              fieldId: fieldId,
              value: Array.isArray(fieldValue) ? fieldValue : [fieldValue],
            });
          } else {
            apiBody.customFields.push({
              fieldId: fieldId,
              value: String(fieldValue),
            });
          }
        }
      });

      if (
        !isEditModal &&
        fieldData?.state?.blockId &&
        fieldData?.state?.stateId &&
        fieldData?.state?.districtId
      ) {
        apiBody.customFields.push({
          fieldId: fieldData?.state?.blockId,
          value: [fieldData?.state?.blockCode],
        });
        apiBody.customFields.push({
          fieldId: fieldData?.state?.stateId,
          value: [fieldData?.state?.stateCode],
        });
        apiBody.customFields.push({
          fieldId: fieldData?.state?.districtId,
          value: [fieldData?.state?.districtCode],
        });
        console.log(apiBody);
      }

      try {
        if (isEditModal && userId && cohortId) {
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
            showToastMessage(
              t('COMMON.LEARNER_UPDATED_SUCCESSFULLY'),
              'success'
            );
            setReloadProfile(true);
            onReload?.();
            onClose();
          }
        } else {
          const response = await createUser(apiBody);
          if (response) {
            showToastMessage(
              t('COMMON.LEARNER_CREATED_SUCCESSFULLY'),
              'success'
            );
            onLearnerAdded?.();
            onClose();
            ReactGA.event('learner-creation-success', {
              username: username,
            });

            const telemetryInteract = {
              context: {
                env: 'teaching-center',
                cdata: [],
              },
              edata: {
                id: 'learner-creation-success',
                type: Telemetry.CLICK,
                subtype: '',
                pageid: 'centers',
              },
            };
            telemetryFactory.interact(telemetryInteract);

            let creatorName: string = '';
            if (typeof window !== 'undefined' && window.localStorage) {
              creatorName = (localStorage.getItem('userName') as string) || '';
            }
            // if (creatorName && userEmail) {
            //   sendEmail(creatorName, username, password, userEmail, apiBody['name']);
            // } else {
            //   showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
            // }
          }
        }
      } catch (error) {
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setReloadProfile(true);
        ReactGA.event('learner-creation-fail', {
          error: error,
        });
      }
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
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <>
      <SimpleModal
        open={open}
        onClose={onClose}
        showFooter={false}
        modalTitle={
          isEditModal ? t('COMMON.EDIT_LEARNER') : t('COMMON.NEW_LEARNER')
        }
      >
        {isPending && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
          </Box>
        )}

        {!isPending && schema && uiSchema && (
          <DynamicForm
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onError={handleError}
            widgets={{}}
            showErrorList={true}
            customFields={customFields}
            formData={formData ?? undefined}
          >
            <FormButtons
              formData={formData ?? learnerFormData}
              onClick={handleButtonClick}
              isSingleButton={!!formData}
              actions={formData ? undefined : { back: handleBack }}
              isCreatedLearner={!formData}
            />
          </DynamicForm>
        )}
      </SimpleModal>
      <SendCredentialModal
        open={openModal}
        onClose={onCloseModal}
        email={userEmail}
        isLearnerAdded={openModal}
      />
    </>
  );
};

export default AddLearnerModal;
