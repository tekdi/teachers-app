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
import FormButtons from './FormButtons';
import { sendCredentialService } from '@/services/NotificationService';
import {
  Box,
  Button,
  Divider,
  Modal,
  Typography,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SendCredstyle } from '@/styles/modalStyles';
interface AddFacilitatorModalprops {
  open: boolean;
  onClose: () => void;
  userFormData?: object;
  isEditModal?: boolean;
  userId?: string;
  onReload?: (() => void) | undefined;
  onFacilitatorAdded?: (() => void) | undefined;
}
const AddFacilitatorModal: React.FC<AddFacilitatorModalprops> = ({
  open,
  onClose,
  userFormData,
  isEditModal = false,
  userId,
  onReload,
  onFacilitatorAdded,
}) => {
  const [schema, setSchema] = React.useState<any>();
  const [openSendCredModal, setOpenSendCredModal] = React.useState(false);
  const [createFacilitator, setCreateFacilitator] = React.useState(false);
  const [uiSchema, setUiSchema] = React.useState<any>();
  const [reloadProfile, setReloadProfile] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [formData, setFormData] = React.useState<any>();
  const [username, setUsername] = React.useState<any>();
  const [password, setPassword] = React.useState<any>();
  const [fullname, setFullname] = React.useState<any>();
  const [coreFields, setCoreFields] = React.useState<string[]>([]);

  const { t } = useTranslation();
  const theme = useTheme<any>();

  useEffect(() => {
    const getAddFacilitatorFormData = async () => {
      try {
        const response: FormData = await getFormRead(
          FormContext.USERS,
          FormContextType.TEACHER
        );
        console.log('sortedFields', response);
        if (response) {
          const filteredFieldNames = response?.fields
            .filter((field) => field?.coreField === 1)
            .map((field) => field?.name);
          setCoreFields(filteredFieldNames);
        }

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
    setTimeout(() => {
      setFormData(data.formData);
    });
  };

  useEffect(() => {
    if (formData) {
      handleButtonClick();
    }
  }, [formData, createFacilitator]);

  const handleButtonClick = async () => {
    console.log('Form data:', formData);
    if (formData) {
      const schemaProperties = schema.properties;
      setEmail(formData?.email);
      let fieldData;
      if (typeof window !== 'undefined' && window.localStorage) {
        fieldData = JSON.parse(localStorage.getItem('fieldData') || '');
      }
      const { username, password } = generateUsernameAndPassword(
        fieldData?.state?.stateCode,
        'F'
      );
      setUsername(username);
      setPassword(password);
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
            if (fieldKey === 'name') {
              setTimeout(() => {
                setFullname(fieldValue);
              });
            }
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
            if (fieldSchema.checkbox && fieldSchema.type === 'array') {
              if (Array.isArray(fieldValue) && fieldValue.length > 0) {
                apiBody.customFields.push({
                  fieldId: fieldId,
                  value: String(fieldValue).split(','),
                });
              }
            } else {
              apiBody.customFields.push({
                fieldId: fieldId,
                value: String(fieldValue),
              });
            }
          }
        }
      });

      if (typeof window !== 'undefined' && window.localStorage) {
        const fieldData = JSON.parse(localStorage.getItem('fieldData') ?? '');

        if (!isEditModal && fieldData) {
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
      }

      console.log(apiBody);
      try {
        if (isEditModal && userId) {
          const userData: Record<string, any> = {};
          coreFields?.forEach((fieldName) => {
            userData[fieldName] = apiBody[fieldName];
          });
          const customFields = apiBody?.customFields;
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
          if (formData?.assignCenters?.length > 0) {
            setOpenSendCredModal(true);
            if (createFacilitator) {
              try {
                const response = await createUser(apiBody);

                if (response) {
                  onFacilitatorAdded?.();
                  onClose();
                  showToastMessage(
                    t('COMMON.FACILITATOR_ADDED_SUCCESSFULLY'),
                    'success'
                  );

                  const isQueue = false;
                  const context = 'USER';
                  const key = 'onFacilitatorCreated';
                  const replacements = [apiBody['name'], username, password];
                  const sendTo = {
                    receipients: [formData?.email],
                  };

                  let createrName;
                  if (typeof window !== 'undefined' && window.localStorage) {
                    createrName = localStorage.getItem('userName');
                  }

                  if (replacements && sendTo) {
                    const credentialResponse = await sendCredentialService({
                      isQueue,
                      context,
                      key,
                      replacements,
                      email: sendTo,
                    });

                    if (
                      credentialResponse?.result[0]?.data[0]?.status ===
                      'success'
                    ) {
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
                  } else {
                    showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
                  }
                } else {
                  showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
                }
              } catch (error) {
                console.error(error);
                showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
              }
            }
          } else {
            showToastMessage(t('COMMON.PLEASE_SELECT_THE_CENTER'), 'error');
          }
        }
      } catch (error) {
        onClose();
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setReloadProfile(true);
      }
    }
  };

  const handleChange = (event: IChangeEvent<any>) => {
    console.log('Form data changed:', event.formData);
  };

  const handleError = (errors: any) => {
    console.log('Form errors:', errors);
  };

  const handleBackAction = () => {
    setCreateFacilitator(false);
    setOpenSendCredModal(false);
  };

  const handleAction = () => {
    setTimeout(() => {
      setCreateFacilitator(true);
    });
    setOpenSendCredModal(false);
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
                formData={createFacilitator ? '' : formData}
              >
                <FormButtons
                  formData={formData}
                  onClick={handleButtonClick}
                  isCreatedFacilitator={true}
                  isCreateCentered={false}
                />{' '}
              </DynamicForm>
            )}
      </SimpleModal>
      <Modal
        open={openSendCredModal}
        aria-labelledby="send credential modal"
        aria-describedby="to send credentials"
      >
        <Box sx={SendCredstyle(theme)}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            sx={{ padding: '18px 16px' }}
          >
            <Box marginBottom={'0px'}>
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.warning['A200'],
                  fontSize: '14px',
                }}
                component="h2"
              >
                {t('COMMON.NEW', { role: 'Learner' })}
              </Typography>
            </Box>
            <CloseIcon
              sx={{
                cursor: 'pointer',
                color: theme.palette.warning['A200'],
              }}
              onClick={onClose}
            />
          </Box>
          <Divider />
          {/* {isButtonAbsent ? ( */}
          <Box
            sx={{
              padding: '18px 16px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Box>
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.warning['400'],
                  fontSize: '14px',
                }}
                component="h2"
              >
                {t('COMMON.CREDENTIALS_EMAILED')}
              </Typography>
            </Box>
            <Box sx={{ padding: '0 1rem' }}>
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.warning['400'],
                  fontSize: '14px',
                }}
                component="h2"
              >
                {email}
              </Typography>
            </Box>
          </Box>

          <>
            <Box mt={1.5}>
              <Divider />
            </Box>
            <Box p={'18px'} display={'flex'} gap={'1rem'}>
              <Button
                className="w-100"
                sx={{ boxShadow: 'none' }}
                variant="outlined"
                onClick={() => handleBackAction()}
              >
                {t('COMMON.BACK')}
              </Button>
              <Button
                className="w-100"
                sx={{ boxShadow: 'none' }}
                variant="contained"
                onClick={() => handleAction()}
              >
                {t('COMMON.SEND_CREDENTIALS')}
              </Button>
            </Box>
          </>
        </Box>
      </Modal>
    </>
  );
};

export default AddFacilitatorModal;
