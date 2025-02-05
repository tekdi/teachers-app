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
import { calculateAge, generateUsernameAndPassword } from '@/utils/Helper';
import {
  FormContext,
  FormContextType,
  RoleId,
  Telemetry,
} from '@/utils/app.constant';
import { telemetryFactory } from '@/utils/telemetry';
import { IChangeEvent } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import { tenantId } from '../../app.config';
import FormButtons from './FormButtons';
import SendCredentialModal from './SendCredentialModal';
import { showToastMessage } from './Toastify';
import Loader from './Loader';
import { Box } from '@mui/material';

interface AddLearnerModalProps {
  open: boolean;
  onClose: () => void;
  onLearnerAdded?: () => void;
  formData?: any;
  isEditModal?: boolean;
  userId?: string;
  onReload?: (() => void) | undefined;
  learnerEmailId?: string;
  learnerUserName?: string;
}
const AddLearnerModal: React.FC<AddLearnerModalProps> = ({
  open,
  onClose,
  onLearnerAdded,
  formData,
  isEditModal = false,
  userId,
  onReload,
  learnerUserName,
  learnerEmailId,
}) => {
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();
  const [customFormData, setCustomFormData] = React.useState<any>(formData ?? {});
  const [reloadProfile, setReloadProfile] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [learnerFormData, setLearnerFormData] = React.useState<any>();
  const [fullname, setFullname] = React.useState<any>();
  const [originalSchema, setOriginalSchema] = React.useState(schema);

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
      const { schema, uiSchema } = GenerateSchemaAndUiSchema(formResponse, t);
      setSchema(schema);
      setUiSchema(uiSchema);
      setOriginalSchema({ ...schema });
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
      if (response?.email?.data?.[0]?.status !== 200) {
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
    if (data?.formData?.name) {
      data.formData.name = data?.formData?.name?.trim();
    }
    if (data?.formData?.father_name) {
      data.formData.father_name = data?.formData?.father_name?.trim();
    }
    setTimeout(() => {
      setLearnerFormData(data.formData);
    });

    const formData = data.formData;
  };

  useEffect(() => {
    if (learnerFormData) {
      handleButtonClick();
    }
  }, [learnerFormData]);

  const handleButtonClick = async () => {
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
        password: username,
        tenantCohortRoleMapping: [
          {
            tenantId: tenantId,
            roleId: RoleId.STUDENT,
            cohortIds: [cohortId],
          },
        ],
        customFields: [],
      };

      Object.entries(learnerFormData).forEach(([fieldKey, fieldValue]) => {
        const fieldSchema = schemaProperties[fieldKey];
        const fieldId = fieldSchema?.fieldId;
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

      if (!isEditModal) {
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
      }

      try {
        if (isEditModal && userId && cohortId) {
          const userData = {
            name: apiBody.name,
            mobile: String(apiBody?.phone_number),
            father_name: apiBody.father_name,
            username: apiBody.username,
            email: apiBody?.email,
            firstName: apiBody?.firstName,
            middleName: apiBody?.middleName,
            lastName: apiBody?.lastName,
            dob: apiBody?.dob,
            gender: apiBody?.gender,
          };
          const customFields = apiBody.customFields;
          const object = {
            userData: userData,
            customFields: customFields,
          };

          if (learnerEmailId === userData.email) {
            delete userData.email;
          }
          if (learnerUserName === userData.username) delete userData.username;
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
          if (apiBody?.phone_number) {
            apiBody.mobile = apiBody?.phone_number;
          }
          const response = await createUser(apiBody);
          if (response) {
            showToastMessage(
              t('COMMON.LEARNER_CREATED_SUCCESSFULLY'),
              'success'
            );
            onLearnerAdded?.();
            onClose();
            ReactGA.event('learner-creation-success', {
              username: learnerFormData.username,
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
            if (creatorName && userEmail) {
              sendEmail(
                creatorName,
                apiBody['username'],
                apiBody['username'],
                userEmail,
                apiBody['firstName']
              );
            } else {
              showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
            }
          }
        }
      } catch (error: any) {
        if (error?.response?.data?.params?.err === 'User already exist.') {
          showToastMessage(error?.response?.data?.params?.err, 'error');
        } else if (
          error?.response?.data?.params?.errmsg === 'Email already exists'
        ) {
          showToastMessage(error?.response?.data?.params?.errmsg, 'error');
        } else {
          showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        }
        setReloadProfile(true);
        ReactGA.event('learner-creation-fail', {
          error: error,
        });
      }
    }
  };

  const handleChange = (event: IChangeEvent<any>) => {
    const { formData } = event;

    let newFormData = { ...formData };


    console.log('Form data changed:', event.formData);
    console.log('schema:', schema);
    const dob = event.formData.dob;
    const dependencyKeys = Object.keys(schema.dependencies)[0];
    const dependentFields = schema?.dependencies?.dob?.properties;

    // if (!isUsernameEdited) {
    //   if (event.formData.firstName && event.formData.lastName) {
    //     event.formData.username =
    //       event.formData.firstName + event.formData.lastName;
    //   } else {
    //     event.formData.username = null;
    //   }
    // }

    if (dob) {
      const age = calculateAge(new Date(dob));

      if (age >= 18) {
        const newSchema = { ...schema };
        const dependentFieldKeys = Object.keys(dependentFields);

        newSchema.properties = Object.keys(newSchema.properties)
          .filter((key) => !dependentFieldKeys.includes(key))
          .reduce((acc: any, key) => {
            acc[key] = newSchema.properties[key];
            return acc;
          }, {});

        // Remove dependent fields from the formData
        const updatedFormData = { ...event.formData };
        dependentFieldKeys.forEach((key) => {
          delete updatedFormData[key];
        });

        newSchema.dependencies = Object.keys(newSchema.dependencies)
          .filter((key) => !dependentFieldKeys.includes(key))
          .reduce((acc: any, key) => {
            // Remove dependentFieldKeys from properties within dependencies
            const filteredProperties = Object.keys(
              newSchema.dependencies[key].properties
            )
              .filter((propKey) => !dependentFieldKeys.includes(propKey))
              .reduce((nestedAcc: any, propKey) => {
                nestedAcc[propKey] =
                  newSchema.dependencies[key].properties[propKey];
                return nestedAcc;
              }, {});

            // Add filtered dependencies back
            acc[key] = { properties: filteredProperties };
            return acc;
          }, {});

        setSchema(newSchema);
        // setFormData(updatedFormData);
        // setCustomFormData(updatedFormData);
        newFormData = { ...updatedFormData };
      } else if (age < 18) {
        const newSchema = { ...originalSchema };
        // Add dependent fields and reorder them in the schema
        const reorderedFields: any[] = [];
        const filteredFields = Object.keys(newSchema.properties).filter(
          (key) => !Object.keys(dependentFields).includes(key)
        );

        filteredFields.forEach((key) => {
          reorderedFields.push(key);
          if (key === dependencyKeys) {
            reorderedFields.push(...Object.keys(dependentFields));
          }
        });

        newSchema.properties = reorderedFields.reduce((acc: any, key: any) => {
          acc[key] = dependentFields[key] || newSchema.properties[key];
          return acc;
        }, {});

        setSchema(newSchema);
        // setFormData({ ...event.formData });
        // setCustomFormData({ ...event.formData });
        newFormData = { ...event.formData };
      }
    } else {
      // setFormData(event.formData);
    }

    if (!isEditModal) {
      const { firstName, lastName, username } = newFormData;

      if (firstName && lastName) {
        setCustomFormData({
          ...newFormData,
        });
      }
      // else {
      //   setCustomFormData({ ...formData });
      // }
    }
    //  else {
    //   setCustomFormData({ ...formData });
    // }
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
            formData={customFormData}
            setFormData={setCustomFormData}
            isEdit={isEditModal}
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
