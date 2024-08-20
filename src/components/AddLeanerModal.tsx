import DynamicForm from '@/components/DynamicForm';
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from '@/components/GeneratedSchemas';
import SimpleModal from '@/components/SimpleModal';
import { createUser, getFormRead } from '@/services/CreateUserService';
import { generateUsernameAndPassword } from '@/utils/Helper';
import { FormData } from '@/utils/Interfaces';
import { FormContext, FormContextType, RoleId, Telemetry } from '@/utils/app.constant';
import { IChangeEvent } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { showToastMessage } from './Toastify';
import { editEditUser } from '@/services/ProfileService';
import { tenantId } from '../../app.config';
import SendCredentialModal from './SendCredentialModal';
import FormButtons from './FormButtons';
import { sendCredentialService } from '@/services/NotificationService';
import useSubmittedButtonStore from '@/store/useSubmittedButtonStore';
import ReactGA from 'react-ga4';
import { telemetryFactory } from '@/utils/telemetry';

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

  const { t } = useTranslation();
  const setSubmittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.setSubmittedButtonStatus
  );
  let userEmail: string = '';
  if (typeof window !== 'undefined' && window.localStorage) {
    userEmail = localStorage.getItem('userEmail') || '';
  }
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
    setTimeout(() => {
      setLearnerFormData(data.formData);
    });
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
            fieldSchema?.hasOwnProperty('isDropdown') ||
            fieldSchema.hasOwnProperty('isCheckbox')
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

      if (!isEditModal) {
        apiBody.customFields.push({
          fieldId: fieldData?.state?.blockId,
          value: [fieldData?.state?.blockCode],
        });
        apiBody.customFields.push({
          fieldId: fieldData?.state?.stateId,
          value: [fieldData?.state?.stateCode],
        });
        fieldData;
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
                uid: localStorage.getItem('userId') ?? 'Anonymous',
                userName: localStorage.getItem('userName') ?? 'Anonymous',
              },
            };
            telemetryFactory.interact(telemetryInteract);

            const isQueue = false;
            const context = 'USER';
            let createrName;
            const key = 'onLearnerCreated';
            if (typeof window !== 'undefined' && window.localStorage) {
              createrName = localStorage.getItem('userName');
            }
            let replacements;
            if (createrName) {
              replacements = [createrName, apiBody['name'], username, password];
            }
            const sendTo = {
              receipients: [userEmail],
            };
            if (replacements && sendTo) {
              const response = await sendCredentialService({
                isQueue,
                context,
                key,
                replacements,
                email: sendTo,
              });
              if (response?.result[0]?.data[0]?.status === 'success') {
                showToastMessage(
                  t('COMMON.USER_CREDENTIAL_SEND_SUCCESSFULLY'),
                  'success'
                );
              } else {
                showToastMessage(
                  t('COMMON.USER_CREDENTIALS_WILL_BE_SEND_SOON'),
                  'success'
                );
              }
              setOpenModal(true);
            } else {
              showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
            }
          }
        }
        // onClose();
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
                <FormButtons
                  formData={formData}
                  onClick={handleButtonClick}
                  isSingleButton={true}
                />
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
                <FormButtons
                  formData={learnerFormData}
                  onClick={handleButtonClick}
                  actions={{ back: handleBack }}
                  isCreatedLearner={true}
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
