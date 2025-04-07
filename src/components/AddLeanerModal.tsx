import DynamicForm from '@/components/DynamicForm';
import AreaSelection from '@/components/AreaSelection';
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
import {
  calculateAge,
  generateUsernameAndPassword,
  transformArray,
} from '@/utils/Helper';
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
import { useLocationState } from '@/utils/UseLocation';

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
  const [customFormData, setCustomFormData] = React.useState<any>(
    formData ?? {}
  );
  const [reloadProfile, setReloadProfile] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [learnerFormData, setLearnerFormData] = React.useState<any>();
  const [fullname, setFullname] = React.useState<any>();
  const [originalSchema, setOriginalSchema] = React.useState(schema);
  const {
    country,
    states,
    districts,
    blocks,
    allCenters,
    isMobile,
    isMediumScreen,
    selectedState,
    selectedStateCode,
    selectedDistrict,
    selectedDistrictCode,
    selectedCenter,
    dynamicForm,
    selectedBlock,
    selectedBlockCode,
    handleCountryChangeWrapper,
    handleStateChangeWrapper,
    handleBlockChangeWrapper,
    handleCenterChangeWrapper,
    selectedCenterCode,
    selectedBlockCohortId,
    blockFieldId,
    districtFieldId,
    stateFieldId,
    dynamicFormForBlock,
    stateDefaultValue,
    assignedTeamLeader,
    assignedTeamLeaderNames,
    selectedStateCohortId,
    selectedCountryName,
  } = useLocationState(open, onClose, 'YOUTH');
  const countryCodeMapping: Record<string, string> = {
    Burundi: '+257',
    Comoros: '+269',
    Djibouti: '+253',
    Eritrea: '+291',
    Ethiopia: '+251',
    Kenya: '+254',
    Madagascar: '+261',
    Malawi: '+265',
    Mauritius: '+230',
    Mozambique: '+258',
    Rwanda: '+250',
    Seychelles: '+248',
    Somalia: '+252',
    'South Sudan': '+211',
    Tanzania: '+255',
    Uganda: '+256',
    Zambia: '+260',
    Zimbabwe: '+263',
  };

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
    async function fetchAndUpdateSchema() {
      if (formResponse) {
        try {
          const updatedResponse =
            await updateFieldsWithExternalData(formResponse);
          const { schema, uiSchema } = GenerateSchemaAndUiSchema(
            updatedResponse,
            t
          );
          setSchema(schema);
          setUiSchema(uiSchema);
          setOriginalSchema({ ...schema });
        } catch (error) {
          console.error('Error updating schema:', error);
        }
      }
    }

    fetchAndUpdateSchema();
  }, [formResponse, t]);

  const updateFieldsWithExternalData = async (response: any) => {
    const updatedFields = await Promise.all(
      response.fields.map(async (field: any) => {
        if (field.sourceDetails?.externalsource) {
          try {
            const url = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}${field.sourceDetails.externalsource}`;

            const apiResponse = await fetch(url, {
              headers: {
                tenantid: 'ef99949b-7f3a-4a5f-806a-e67e683e38f3',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            const data = await apiResponse.json();
            const skillsOptions = data.result.map((skill: any) => ({
              label: skill.name,
              value: skill.id,
            }));

            return {
              ...field,
              options: skillsOptions,
            };
          } catch (error) {
            console.error('Error fetching external options:', error);
          }
        }
        return field;
      })
    );

    return { ...response, fields: updatedFields };
  };

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
      let cohortId, fieldData, centerCohortId;
      if (typeof window !== 'undefined' && window.localStorage) {
        fieldData = JSON.parse(localStorage.getItem('fieldData') || '');
        cohortId = localStorage.getItem('classId');
        centerCohortId = localStorage.getItem('centerCohortId');
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
            cohortIds: [cohortId],
          },
        ],
        customFields: [],
      };

      Object.entries(learnerFormData).forEach(([fieldKey, fieldValue]) => {
        const fieldSchema = schemaProperties[fieldKey];
        const fieldId = fieldSchema?.fieldId;
        if (fieldId === null || fieldId === 'null' || fieldKey === 'gender') {
          if (typeof fieldValue !== 'object') {
            apiBody[fieldKey] = fieldValue;
            if (fieldKey === 'name') {
              setFullname(fieldValue);
            }
          }
        } else {
          if (
            fieldSchema &&
            (Object.hasOwn(fieldSchema, 'isDropdown') ||
              Object.hasOwn(fieldSchema, 'isCheckbox'))
          ) {
            apiBody.customFields.push({
              fieldId: fieldId,
              value: Array.isArray(fieldValue) ? fieldValue : [fieldValue],
            });
          } else if (fieldId) {
            apiBody.customFields.push({
              fieldId: fieldId,
              value: String(fieldValue),
            });
          }
        }
      });

      if (!isEditModal) {
        apiBody.customFields.push({
          fieldId: blockFieldId,
          value: [selectedBlockCode],
        });
        apiBody.customFields.push({
          fieldId: stateFieldId,
          value: [selectedStateCode],
        });
        apiBody.customFields.push({
          fieldId: districtFieldId,
          value: [selectedDistrictCode],
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
          apiBody.password = apiBody.username;
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
            // if (creatorName && userEmail) {
            //   sendEmail(
            //     creatorName,
            //     apiBody['username'],
            //     apiBody['username'],
            //     userEmail,
            //     apiBody['firstName']
            //   );
            // } else {
            //   showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
            // }
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

    const dob = formData.dob;
    if (!isEditModal) {
      const countryName = selectedCountryName?.[0];
      if (countryName && countryCodeMapping[countryName]) {
        newFormData.mobile_country_code = countryCodeMapping[countryName];
      }
    }

    if (dob) {
      const age = calculateAge(new Date(dob));

      // Auto-populate the age field
      newFormData.age = age;

      if (age < 16) {
        showToastMessage('Date of birth should be 16 or above.', 'error');
        setCustomFormData(newFormData);
        return;
      }
    }

    // Update the form value state
    setCustomFormData(newFormData);

    if (!isEditModal) {
      const { firstName, lastName } = newFormData;
      if (firstName && lastName) {
        setCustomFormData({
          ...newFormData,
        });
      }
    }
  };

  useEffect(() => {
    async function fetchAndUpdateSchema() {
      if (formResponse) {
        try {
          const updatedResponse =
            await updateFieldsWithExternalData(formResponse);
          const { schema, uiSchema } = GenerateSchemaAndUiSchema(
            updatedResponse,
            t
          );

          // Mark the "age" field as disabled in the uiSchema
          if (uiSchema.age) {
            uiSchema.age['ui:disabled'] = true;
          }

          if (uiSchema.mobile_country_code) {
            uiSchema.mobile_country_code['ui:disabled'] = true;
          }

          setSchema(schema);
          setUiSchema(uiSchema);
          setOriginalSchema({ ...schema });
        } catch (error) {
          console.error('Error updating schema:', error);
        }
      }
    }

    fetchAndUpdateSchema();
  }, [formResponse, t]);

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

        {!isEditModal && !isPending && (
          <Box
            sx={{
              marginTop: '10px',
            }}
          >
            <AreaSelection
              country={transformArray(country)}
              states={transformArray(states)}
              districts={transformArray(districts)}
              blocks={transformArray(blocks)}
              allCenters={transformArray(allCenters)}
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
              selectedBlock={selectedBlock}
              handleCountryChangeWrapper={handleCountryChangeWrapper}
              handleStateChangeWrapper={handleStateChangeWrapper}
              handleBlockChangeWrapper={handleBlockChangeWrapper}
              isMobile={isMobile}
              isMediumScreen={isMediumScreen}
              isCenterSelection={true}
              selectedCenter={selectedCenter}
              handleCenterChangeWrapper={handleCenterChangeWrapper}
              inModal={true}
              userType={'YOUTH'}
              stateDefaultValue={stateDefaultValue}
              isUserAdd={true}
            />
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
