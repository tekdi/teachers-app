import AddFacilitatorModal from '@/components/AddFacilitator';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import ManageUser from '@/components/ManageUser';
import { showToastMessage } from '@/components/Toastify';
import { useProfileInfo } from '@/services/queries';
import {
  extractAddress,
  mapFieldIdToValue,
  toPascalCase,
} from '@/utils/Helper';
import { CustomField } from '@/utils/Interfaces';
import { FormContext, FormContextType, Role } from '@/utils/app.constant';
import { logEvent } from '@/utils/googleAnalytics';
import withAccessControl from '@/utils/hoc/withAccessControl';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { Box, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { GetStaticPaths } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { accessControl } from '../../../app.config';
import { getFormRead, useFormRead } from '@/hooks/useFormRead';
import { useQueryClient } from '@tanstack/react-query';
import { useDirection } from '@/hooks/useDirection';
import useStore from '@/store/store';

interface TeacherProfileProp {
  reloadState?: boolean;
  setReloadState?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TeacherProfile: React.FC<TeacherProfileProp> = ({
  reloadState,
  setReloadState,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { userId }: any = router.query;
  const queryClient = useQueryClient();
  const theme = useTheme<any>();
  const store = useStore();
  const isActiveYear = store.isActiveYearSelected;

  const [userData, setUserData] = useState<any | null>(null);
  const [userName, setUserName] = useState<any | null>(null);
  const [customFieldsData, setCustomFieldsData] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [isData, setIsData] = React.useState<boolean>(false);
  const [userFormData, setUserFormData] = useState<{ [key: string]: any }>({});
  const [openAddLearnerModal, setOpenAddLearnerModal] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [selfUserId, setSelfUserId] = React.useState<string | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUserUserName, setSelectedUserUserName] = useState("");
  
  const { isRTL } = useDirection();

  const { data: formResponse } = useFormRead(
    FormContext.USERS,
    FormContextType.TEACHER
  );

  const {
    data: userDetails,
    error,
    isLoading,
  } = useProfileInfo(userId ?? '', true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userId = localStorage.getItem('userId');
      setSelfUserId(userId);
      const role = localStorage.getItem('role');
      setUserRole(role);
    }
  }, []);
  const handleReload = () => {
    setReload((prev) => !prev);
    queryClient.invalidateQueries({ queryKey: ['profile', userId] });
  };

  const handleOpenAddLearnerModal = () => {
    setOpenAddLearnerModal(true);
    logEvent({
      action: 'edit-teacher-profile-modal-open',
      category: 'Profile Page',
      label: 'Edit Teacher Profile Modal Open',
    });
  };

  const handleCloseAddLearnerModal = () => {
    setOpenAddLearnerModal(false);
    logEvent({
      action: 'edit-teacher-profile-modal-close',
      category: 'Profile Page',
      label: 'Edit Teacher Profile Modal Close',
    });
  };

  const mapFields = (formFields: any, response: any) => {
    const initialFormData: any = {};
    formFields.fields.forEach((item: any) => {
      const userData = response?.userData;
      const customFieldValue = userData?.customFields?.find(
        (field: any) => field.fieldId === item.fieldId
      );
      const getValue = (data: any, field: any) => {
        if (item.default) {
          return item.default;
        }
        if (item?.isMultiSelect) {
          if (data[item.name] && item?.maxSelections > 1) {
            if (field?.value) {
              return [field.value];
            }
            return null;
          } else if (item?.type === 'checkbox') {
            if (field?.code) {
              return String(field.code).split(',');
            }
            return null;
          } else {
            return field?.value;
          }
        } else {
          if (item?.type === 'numeric') {
            return parseInt(String(field?.value));
          } else if (item?.type === 'text') {
            return String(field?.value);
          } else if (item?.type === 'radio') {
            if (typeof field?.value === 'string') {
              return field?.value?.replace(/_/g, ' ').toLowerCase();
            }
            return field?.value;
          }
        }
      };
      if (item.coreField) {
        if (item?.isMultiSelect) {
          if (userData[item.name] && item?.maxSelections > 1) {
            initialFormData[item.name] = [userData[item.name]];
          } else if (item?.type === 'checkbox') {
            initialFormData[item.name] = String(userData[item.name]).split(',');
          } else {
            initialFormData[item.name] = userData[item.name];
          }
        } else if (item?.type === 'numeric') {
          initialFormData[item.name] = Number(userData[item.name]);
        } else if (item?.type === 'text' && userData[item.name]) {
          initialFormData[item.name] = String(userData[item.name]);
        } else {
          if (userData[item.name]) {
            initialFormData[item.name] = userData[item.name];
          }
        }
      } else {
        // For Custom Fields
        const fieldValue = getValue(userData, customFieldValue);

        if (fieldValue) {
          initialFormData[item.name] = fieldValue;
        }
      }
    });
    return initialFormData;
  };

  const fetchDataAndInitializeForm = async () => {
    try {
      if (formResponse && userDetails) {
        setSelectedUserUserName(userDetails?.result?.userData?.username);
      setSelectedUserEmail(userDetails?.result?.userData?.email);
   
        setUserFormData(mapFields(formResponse, userDetails?.result));
      }
    } catch (error) {
      console.error('Error fetching data or initializing form:', error);
    }
  };

  useEffect(() => {
    fetchDataAndInitializeForm();
  }, [userId, reload, formResponse, userDetails]);

  useEffect(() => {
    setLoading(isLoading);

    if (error) {
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      console.error('Error fetching user details:', error);
    }

    if (userDetails) {
      const coreFieldData = userDetails?.result?.userData;
      let fullName = "";

      if (coreFieldData?.firstName) {
        fullName += toPascalCase(coreFieldData.firstName);
      }
      
      if (coreFieldData?.middleName) {
        fullName += (fullName ? " " : "") + toPascalCase(coreFieldData.middleName);
      }
      
      if (coreFieldData?.lastName) {
        fullName += (fullName ? " " : "") + toPascalCase(coreFieldData.lastName);
      }
      
      setUserName(fullName);
      // setUserName(toPascalCase(coreFieldData?.name));
      const fields: CustomField[] = userDetails?.result?.userData?.customFields;
      if (fields?.length > 0) {
        setAddress(
          extractAddress(
            fields,
            'STATES',
            'DISTRICTS',
            'BLOCKS',
            'label',
            'value',
            toPascalCase
          )
        );
      }
      const fieldIdToValueMap: { [key: string]: string } =
        mapFieldIdToValue(fields);

      const fetchFormData = async () => {
        try {
          const formContextType =
            userRole === Role.TEAM_LEADER && selfUserId === userId
              ? FormContextType.TEAM_LEADER
              : FormContextType.TEACHER;
          const response = await queryClient.fetchQuery({
            queryKey: ['formRead', FormContext.USERS, formContextType],
            queryFn: () => getFormRead(FormContext.USERS, formContextType),
          });
          if (response) {
            const mergeData = (
              fieldIdToValueMap: { [key: string]: string },
              response: any
            ): any => {
              response.fields.forEach(
                (field: {
                  name: any;
                  fieldId: string | number;
                  value: string;
                  coreField: number;
                }) => {
                  if (field.fieldId && fieldIdToValueMap[field.fieldId]) {
                    // Update field value from fieldIdToValueMap if fieldId is available
                    field.value = fieldIdToValueMap[field.fieldId] || '-';
                  } else if (field.coreField === 1) {
                    // Set field value from fieldIdToValueMap if coreField is 1 and fieldId is not in the map
                    field.value = coreFieldData[field.name] || '-';
                  }
                }
              );
              return response;
            };

            const mergedProfileData = mergeData(fieldIdToValueMap, response);
            if (mergedProfileData) {
              setUserData(mergedProfileData?.fields);
              const customDataFields = mergedProfileData?.fields;
              setIsData(true);

              if (customDataFields?.length > 0) {
                setCustomFieldsData(customDataFields);
              }
            }
          } else {
            setIsData(false);
            console.log('No data Found');
          }
        } catch (error) {
          console.error('Error fetching form data:', error);
        }
      };

      if (userRole) {
        fetchFormData();
      }
    }
  }, [userDetails, error, isLoading, userRole]);

  // Find fields for "Subjects I Teach" and "My Main Subjects"
  const teachSubjectsField = customFieldsData?.find(
    (field) => field?.name === 'subject_taught'
  );
  const mainSubjectsField: any = customFieldsData?.find(
    (field) => field?.name === 'main_subject'
  );

  const teachSubjects: string[] = teachSubjectsField
    ? teachSubjectsField?.value?.split(',')
    : [];

  const mainSubjects: string[] = mainSubjectsField
    ? mainSubjectsField?.value?.split(',')
    : [];

  const mutualSubjects =
    teachSubjects && mainSubjects
      ? teachSubjects.filter((subject) => mainSubjects.includes(subject))
      : [];

  const remainingSubjects =
    teachSubjects && mainSubjects
      ? teachSubjects.filter((subject) => !mainSubjects.includes(subject))
      : [];

  let orderedSubjects: any;
  if (remainingSubjects?.length) {
    orderedSubjects = [...mutualSubjects, ...remainingSubjects];
  } else {
    orderedSubjects = [...mutualSubjects];
  }

  // Function to get label for a subject from the options array
  const getLabelForSubject = (subject: string) => {
    const option = teachSubjectsField?.options?.find(
      (opt: any) => opt?.value === subject
    );
    return option ? t(`FORM.${option?.label}`) : subject;
  };

  //fields  for view profile by order
  const filteredSortedForView = [...customFieldsData]
    ?.filter((field) => field.order !== 0 && field.name !== 'main_subject')
    ?.sort((a, b) => a.order - b.order);

  // fields for showing in  basic details
  const getLabelForValue = (field: any, value: string) => {
    if (
      field.type === 'radio' ||
      field.type === 'Radio' ||
      field.type === 'drop_down' ||
      field.type === 'dropdown'
    ) {
      const option = field?.options?.find((opt: any) => opt?.value === value);
      return option ? option?.label : value;
    }
    return value;
  };

  // //------------edit teacher profile------------
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      minWidth={'100%'}
    >
      <Header />
      {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}
      {isData ? (
        <Box
          display="flex"
          flexDirection="column"
          // padding={2}
          justifyContent={'center'}
          alignItems={'center'}
        >
          {selfUserId === userId ? (
            <Box
              sx={{ flex: '1', minWidth: '100%' }}
              display="flex"
              flexDirection="row"
              gap="5px"
              padding="25px 19px  20px"
            >
              <Typography
                // variant="h3"
                style={{
                  letterSpacing: '0.1px',
                  textAlign: 'left',
                  marginBottom: '2px',
                }}
                fontSize={'22px'}
                fontWeight={'400'}
                lineHeight={'28px'}
                color={theme.palette.warning['A200']}
              >
                {t('PROFILE.MY_PROFILE')}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{ flex: '1', minWidth: '100%' }}
              display="flex"
              flexDirection="row"
              gap="10px"
              padding="25px 19px  20px"
              justifyContent={'space-between'}
            >
              <Box display={'flex'}>
                <Box
                  onClick={() => {
                    window.history.back();
                    logEvent({
                      action: 'back-button-clicked-teacher-profile-page',
                      category: 'Teacher Profile Page',
                      label: 'Back Button Clicked',
                    });
                  }}
                >
                  <ArrowBackIcon
                    sx={{
                      color: theme.palette.warning['A200'],
                      height: '1.5rem',
                      width: '1.5rem',
                      cursor: 'pointer',
                      pr: '5px',
                      transform: isRTL ? ' rotate(180deg)' : 'unset',
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    style={{
                      letterSpacing: '0.1px',
                      textAlign: 'left',
                      marginBottom: '2px',
                    }}
                    fontSize={'1.375rem'}
                    fontWeight={'400'}
                    lineHeight={'1.75rem'}
                    color={theme.palette.warning['A200']}
                  >
                    {userName}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: theme.typography.fontFamily,
                      fontSize: '12px',
                    }}
                  >
                    {address}
                  </Typography>
                </Box>
              </Box>
              {isActiveYear && (
                <ManageUser
                  reloadState={reloadState ?? false}
                  setReloadState={setReloadState ?? (() => {})}
                  isFromFLProfile={true}
                  teacherUserId={userId}
                />
              )}
            </Box>
          )}
          <Box
            className="linerGradient"
            sx={{
              padding: '10px 16px 21px',
              width: '100%',
            }}
          >
            {userRole === Role.TEAM_LEADER &&
            userId !== selfUserId &&
            isActiveYear ? (
              <Button
                sx={{
                  fontSize: '14px',
                  lineHeight: '20px',

                  minWidth: 'fit-content',
                  padding: '10px 24px 10px 16px',
                  gap: '8px',
                  borderRadius: '100px',
                  marginTop: '10px',
                  flex: '1',
                  textAlign: 'center',
                  color: theme.palette.warning.A200,
                  border: `1px solid #4D4639`,

                  px: '16px',
                }}
                onClick={handleOpenAddLearnerModal}
              >
                <Typography
                  variant="h3"
                  style={{
                    letterSpacing: '0.1px',
                    textAlign: 'left',
                    marginBottom: '2px',
                  }}
                  fontSize={'14px'}
                  fontWeight={'500'}
                  lineHeight={'20px'}
                >
                  {t('PROFILE.EDIT_PROFILE')}
                </Typography>
                <Box>
                  <CreateOutlinedIcon sx={{ fontSize: '18px' }} />
                </Box>
              </Button>
            ) : null}
            {openAddLearnerModal && (
              <AddFacilitatorModal
                open={openAddLearnerModal}
                onClose={handleCloseAddLearnerModal}
                userFormData={userFormData}
                isEditModal={true}
                userId={userId}
                onReload={handleReload}
                facilitatorEmailId={selectedUserEmail}
                facilitatorUserName={selectedUserUserName}
              />
            )}
            <Box
              mt={2}
              sx={{
                flex: '1',
                border: '1px solid',
                borderColor: theme.palette.warning['A100'],
                padding: '16px',
                '@media (min-width: 900px)': {
                  width: '50%',
                },
              }}
              className="bg-white"
              width={'100%'}
              borderRadius={'16px'}
              border={'1px'}
              display="flex"
              flexDirection="row"
            >
              <Grid container spacing={4}>
                {filteredSortedForView?.map((item) => {
                  if (String(item.order) === '9') {
                    return (
                      <Grid item xs={12} key={item?.label}>
                        <Typography
                          fontSize={'12px'}
                          fontWeight={'600'}
                          margin={0}
                          lineHeight={'16px'}
                          letterSpacing={'0.5px'}
                          sx={{ wordBreak: 'break-word' }}
                          color={theme.palette.warning['500']}
                        >
                          {item?.label && t(`FORM.${item.label}`, item.label)}
                        </Typography>
                        <Box
                          mt={2}
                          sx={{
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap',
                          }}
                        >
                          {orderedSubjects && orderedSubjects.length > 0 ? (
                            orderedSubjects.map((subject: any) => {
                              const isMutualSubject =
                                mutualSubjects?.includes(subject);
                              return (
                                <Button
                                  key={subject}
                                  size="small"
                                  variant={
                                    isMutualSubject ? 'contained' : 'outlined'
                                  }
                                  sx={{
                                    backgroundColor: isMutualSubject
                                      ? theme.palette.info.contrastText
                                      : 'none',
                                    borderRadius: '8px',
                                    color: theme.palette.warning.A200,
                                    whiteSpace: 'nowrap',
                                    boxShadow: 'none',
                                    border: `1px solid ${theme.palette.warning[900]}`,
                                    pointerEvents: 'none',
                                  }}
                                >
                                  {getLabelForSubject(subject)}
                                </Button>
                              );
                            })
                          ) : (
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: theme.palette.warning.A200,
                              }}
                            >
                             -
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    );
                  } 
                  
                  else if (item.order === 7) {
                    return (
                      <Grid item xs={12} key={item.label}>
                        <Typography
                          variant="h4"
                          margin={0}
                          lineHeight={'16px'}
                          fontSize={'12px'}
                          fontWeight={'600'}
                          letterSpacing={'0.5px'}
                          color={theme.palette.warning['500']}
                        >
                          {item?.label && t(`FORM.${item?.label}`, item?.label)}
                        </Typography>{' '}
                        {/* No of cluster */}
                        <Typography
                          variant="h4"
                          margin={0}
                          color={theme.palette.warning.A200}
                          sx={{ wordBreak: 'break-word' }}
                        >
                          {item?.value ? toPascalCase(item?.value) : '-'}
                        </Typography>
                      </Grid>
                    );
                  } else {
                    return (
                      <Grid item xs={6} key={item?.label}>
                        {/* Profile Field Labels */}
                        <Typography
                          variant="h4"
                          margin={0}
                          lineHeight={'16px'}
                          fontSize={'12px'}
                          fontWeight={'600'}
                          letterSpacing={'0.5px'}
                          color={theme.palette.warning['500']}
                        >
                          {item?.label && t(`FORM.${item?.label}`, item?.label)}
                        </Typography>
                        {/* Profile Field Values */}
                        <Typography
                          variant="h4"
                          margin={0}
                          color={theme.palette.warning.A200}
                          sx={{
                            wordBreak: 'break-word',
                            fontSize: '16px',
                            paddingTop: '6px',
                          }}
                        >
                          {item?.value
                            ? toPascalCase(getLabelForValue(item, item?.value))
                            : '-'}{' '}
                        </Typography>
                      </Grid>
                    );
                  }
                })}
              </Grid>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box mt={5}>
          <Typography textAlign={'center'}>{t('COMMON.LOADING')}</Typography>
        </Box>
      )}
      {selfUserId === userId ? (
        <Box sx={{ px: '16px', mt: 2 }}>
          <Box
            sx={{
              fontSize: '14px',
              fontWeight: '500',
              color: theme.palette.warning['300'],
            }}
          >
            {t('LOGIN_PAGE.OTHER_SETTING')}
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                '&.Mui-disabled': {
                  backgroundColor: theme?.palette?.primary?.main,
                },
                minWidth: '84px',
                padding: theme.spacing(1),
                fontWeight: '500',
                width: '188px',
                height: '40px',
                '@media (max-width: 430px)': {
                  width: '100%',
                },
                whiteSpace: 'nowrap',
              }}
              onClick={() => {
                router.push('/edit-password');
              }}
              className="one-line-text"
            >
              {t('LOGIN_PAGE.RESET_PASSWORD')}
            </Button>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export default withAccessControl(
  'accessProfile',
  accessControl
)(TeacherProfile);
