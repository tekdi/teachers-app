import BoardEnrollmentProfile from '@/components/BoardEnrollmentProfile';
import ConfirmationModal from '@/components/ConfirmationModal';
import Header from '@/components/Header';
import HorizontalLinearStepper from '@/components/HorizontalLinearStepper';
import { updateCohortMemberStatus } from '@/services/MyClassDetailsService';
import boardEnrollmentStore from '@/store/boardEnrollmentStore';
import manageUserStore from '@/store/manageUserStore';
import useStore from '@/store/store';
import { FeesStepBoards, Telemetry } from '@/utils/app.constant';
import { logEvent } from '@/utils/googleAnalytics';
import {
  extractCategory,
  getAssociationsByName,
  getCohortNameById,
  getOptionsByCategory,
  toPascalCase
} from '@/utils/Helper';
import { BoardEnrollmentData } from '@/utils/Interfaces';
import { telemetryFactory } from '@/utils/telemetry';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showToastMessage } from '../../../components/Toastify';
import { useDirection } from '../../../hooks/useDirection';

interface BoardEnrollment {
  boardEnrollmentData: {
    customField: {
      label: string;
      sourceDetails?: { externalsource: string };
    }[];
  }[];
}

const BoardEnrollmentDetail = () => {
  const theme = useTheme<any>();
  const { t, i18n } = useTranslation();
  const { dir, isRTL } = useDirection();
  const router = useRouter();
  const { userId } = router.query;
  const store = useStore();
  const userStore = manageUserStore();
  const boardData = boardEnrollmentStore();
  const [userData, setUserData] = useState<BoardEnrollmentData | null>(null);
  const [stateAssociations, setStateAssociations] = useState<any[]>([]);
  const [boardOptions, setBoardOptions] = useState<any[]>([]);
  const [boardAssociations, setBoardAssociations] = useState<any[]>([]);
  const [mainCourseAssociations, setMainCourseAssociations] = useState<any[]>(
    []
  );
  const [stageCount, setStageCount] = React.useState<number>(0);
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [cohortId, setCohortId] = React.useState('');
  const [subjectOptions, setSubjectOptions] = React.useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [backButtonClicked, setBackButtonClicked] = useState<boolean>(false);

  const [names, setNames] = useState({
    cohortName: '',
    blockName: '',
    districtName: '',
  });
  const cohortDetails = `${names?.cohortName} (${names?.blockName}, ${names?.districtName})`;
  const labelMapping: { [key: number]: string } = {
    0: 'BOARD',
    1: 'SUBJECTS',
    2: 'REGISTRATION',
    3: 'FEES',
  };

  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [formDataUpdated, setFormDataUpdated] = useState(false);

  const updateFormData = (userData: any) => {
    if (!userData?.customField) return;

    function isStringifiedObject(str: any): boolean {
      if (typeof str !== 'string' || str.trim() === '') return false;
      try {
        const parsed = JSON.parse(str);
        return typeof parsed === 'object' && parsed !== null;
      } catch (error) {
        return false;
      }
    }

    const fields = userData.customField.reduce(
      (acc: Record<string, any>, field: any) => {
        // Parse if value is a stringified object
        if (isStringifiedObject(field.value)) {
          acc[field.label] = JSON.parse(field.value);
        }
        // Parse if it's a stringified primitive
        else if (
          typeof field.value === 'string' &&
          field.value.startsWith('"') &&
          field.value.endsWith('"')
        ) {
          acc[field.label] = JSON.parse(field.value);
        } else {
          acc[field.label] = field.value; // Use as-is for other cases
        }
        return acc;
      },
      {}
    );
    setFormData(fields); 
  };

  useEffect(() => {
    if (formData.BOARD !== 'NIOS') {
      setFormData((prev) => ({ ...prev, FEES: 'na' }));
    }
  }, [formData.BOARD, formData.FEES, activeStep === 3]);

  useEffect(() => {
    if (boardData && typeof userId === 'string') {
      const getUserDataById = (
        boardData: { boardEnrollmentData: BoardEnrollmentData[] },
        userId: string
      ) => {
        return (
          boardData.boardEnrollmentData.find(
            (user) => user.userId === userId
          ) || null
        );
      };

      const blockName: string = userStore?.blockName;
      const districtName = userStore?.districtName;
      const cohortId = localStorage.getItem('classId');
      const cohortData = store?.cohorts;

      if (cohortId) {
        const cohortName = getCohortNameById(cohortData, cohortId);
        setCohortId(cohortId);
        setNames({
          cohortName: toPascalCase(cohortName) || '',
          blockName: toPascalCase(blockName) || '',
          districtName: toPascalCase(districtName),
        });
      }

      const data = getUserDataById(boardData, userId);
      setUserData(data);

      if (data) {
        updateFormData(data); // Dynamically update formData after fetching userData
      }
    } else if (userId && typeof userId !== 'string') {
      console.error('Invalid userId: Expected a string.');
    }
  }, [boardData, userId]);

  // Update `formData` dynamically whenever `userData` changes
  useEffect(() => {
    if (userData) {
      updateFormData(userData);
      setStageCount(userData?.completedStep);
      setActiveStep(userData?.completedStep);
    }
  }, [userData]);

  // const navigateToStep = () => {
  //   // Build the route dynamically
  //   const route = `/board-enrollment/student-detail/${userId}/stage_${activeStep}`;
  //   // Navigate to the constructed route
  //   router.push(route);
  // };

  useEffect(() => {
    const userStateName =
      typeof window !== 'undefined' && window.localStorage
        ? localStorage.getItem('stateName')
        : null;
    const handleBMGS = async () => {
      const extractExternalSource = (boardData: any): string | null => {
        for (const enrollment of boardData.boardEnrollmentData) {
          for (const field of enrollment.customField) {
            if (field.sourceDetails?.externalsource) {
              return field.sourceDetails.externalsource;
            }
          }
        }
        return null;
      };

      const externalsource = extractExternalSource(boardData);
      try {
        if (externalsource) {
          const url = externalsource;
          const boards = await fetch(url).then((res) => res.json());
          const frameworks = boards?.result?.framework;

          const getBoards = getOptionsByCategory(frameworks, 'board');

          if (getBoards) {
            setBoardOptions(getBoards);

            if (formData?.BOARD) {
              const boardAssociations = getAssociationsByName(
                getBoards,
                formData?.BOARD
              );
              setBoardAssociations(boardAssociations);
             
              const getSubjects = getOptionsByCategory(frameworks, 'subject');

              const commonSubjectInBoard = getSubjects
                .filter((item1: { code: any }) =>
                  boardAssociations.some(
                    (item2: { code: any; category: string }) =>
                      item2.code === item1.code && item2.category === 'subject'
                  )
                )
                .map((item1: { name: any; code: any; associations: any }) => ({
                  name: item1.name,
                  code: item1.code,
                  associations: item1.associations,
                }));

              setSubjectOptions(commonSubjectInBoard);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };
    handleBMGS();
  }, [formData]);

  const getMessage = () => {
    if (modalOpen) return t('BOARD_ENROLMENT.SURE_GO_BACK');
    return '';
  };

  const handleCloseModel = () => {
    setModalOpen(false);
  };

  const confirmBack = () => {
    setModalOpen(false);
    handleBack();
  };

  const handleBackEvent = () => {
    setBackButtonClicked(true);
    window.history.back();
    logEvent({
      action: 'back-button-clicked-board-enrollment',
      category: 'Board enrollment page',
      label: 'Back Button Clicked',
    });
  };

  const handleNext = async () => {
    setFormDataUpdated(false);
  
    // Calculate the next step value first
    let nextStep = activeStep;
    nextStep = nextStep < 4 ? nextStep + 1 : nextStep;
    if (nextStep > stageCount) {
      setStageCount(stageCount + 1);
    }
  
    const currentLabel = labelMapping[nextStep - 1];
    const field = userData?.customField?.find(
      (item) => item.label === currentLabel
    );
  
    if (!field) {
      console.error(`Field with label "${currentLabel}" not found.`);
      return;
    }
  
    const fieldId = field.fieldId;
  
    let value;
    switch (nextStep - 1) {
      case 0:
        value = formData?.BOARD;
        break;
      case 1:
        value = formData?.SUBJECTS;
        break;
      case 2:
        value = formData?.REGISTRATION;
        break;
      case 3:
        value = formData?.FEES;
        break;
      default:
        console.error('Invalid step');
        return;
    }
  
    if (!userData?.cohortMembershipId) {
      throw new Error('Membership ID is required.');
    }
  
    const requestBody = {
      membershipId: userData?.cohortMembershipId,
      dynamicBody: {
        cohortId,
        userId,
        createdBy: userId,
        updatedBy: userId,
        customFields: [
          {
            fieldId,
            value,
          },
        ],
      },
    };
  
    try {
      const response = await updateCohortMemberStatus(requestBody);
  
      if (response && response.params.status === 'successful' && response.responseCode === 201) {
        const windowUrl = window.location.pathname;
        const cleanedUrl = windowUrl.replace(/^\//, '');
        const env = cleanedUrl.split("/")[0];
        const telemetryInteract = {
          context: {
            env: env,
            cdata: [],
          },
          edata: {
            id: `endrolled-student(${userId})-to step ` + nextStep,
  
            type: Telemetry.CLICK,
            subtype: '',
            pageid: cleanedUrl,
          },
        };
        telemetryFactory.interact(telemetryInteract);
        // API successful, update step state to nextStep
        setActiveStep(nextStep);
      } else {
        console.error('API response is invalid or failed.');
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      }
    } catch (error) {
      console.error('Error updating:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    }
  };
  
  
  
  

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep > 0) {
        return prevActiveStep - 1;
      } else {
        return prevActiveStep;
      }
    });
  };

  const isNextDisabled = () => {
    switch (activeStep) {
      case 0:
        return !formData?.BOARD;
      case 1:
        return formData.SUBJECTS.length === 0;
      case 2:
        return !formData.REGISTRATION;
      case 3:
        return !formData.FEES;
      default:
        return false;
    }
  };

  const handleOpenModal = () => {
    if (formDataUpdated) {
      setModalOpen(true);
    } else {
      handleBack();
    }
  };

  const handleConfirmationOnBack = () => {
    setBackButtonClicked(true);
    const checkDisableStatus = isNextDisabled();
    if (formDataUpdated || !checkDisableStatus) {
      setModalOpen(true);
    } else {
      handleBackEvent();
    }
  };

  return (
    <>
      {activeStep > 3 ? (
        <BoardEnrollmentProfile
          learnerName={userData?.name}
          centerName={cohortDetails}
          board={formData.BOARD}
          subjects={formData.SUBJECTS}
          registrationNum={formData.REGISTRATION}
          feesPaidStatus={formData.FEES}
          setActiveStep={setActiveStep}
        />
      ) : (
        <>
          <Box>
            <Header />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'left',
                color: theme.palette.warning['A200'],
                padding: '15px 20px 5px',
              }}
              width={'100%'}
            >
              <KeyboardBackspaceOutlinedIcon
                onClick={handleConfirmationOnBack}
                cursor={'pointer'}
                sx={{
                  color: theme.palette.warning['A200'],
                  marginTop: '18px',
                  transform: isRTL ? ' rotate(180deg)' : 'unset',
                }}
              />
              <Box my={'1rem'} ml={'0.5rem'}>
                <Typography
                  color={theme.palette.warning['A200']}
                  textAlign={'left'}
                  fontSize={'22px'}
                  fontWeight={400}
                >
                  {userData?.name}
                </Typography>
                <Typography
                  color={theme.palette.warning['A200']}
                  textAlign={'left'}
                  fontSize={'11px'}
                  fontWeight={500}
                >
                  {cohortDetails}
                </Typography>
              </Box>
            </Box>

            <Box px={'16px'}>
              <HorizontalLinearStepper activeStep={stageCount} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  border: `1px solid ${theme.palette.warning['A100']}`,
                  borderRadius: '16px',
                  padding: '16px',
                  mt: 3,
                  '@media (min-width: 900px)': {
                    width: '50%',
                  },
                  width: '100%',
                }}
                mx={'16px'}
              >
                <Box>
                  {activeStep > 0 && (
                    <Box
                      sx={{
                        color: theme.palette.warning['300'],
                        fontWeight: '500',
                        fontSize: '14px',
                        mb: 1,
                      }}
                    >
                      {t('BOARD_ENROLMENT.BOARD')}: {formData?.BOARD}
                    </Box>
                  )}

                  {activeStep === 0 && (
                    <>
                      <Box
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: theme.palette.warning['500'],
                        }}
                      >
                        {t('BOARD_ENROLMENT.CHOOSE_BOARD')}
                      </Box>
                      {boardOptions?.map((boardItem) => (
                        <Box sx={{ mt: 2 }} key={boardItem.code}>
                          <Box
                            sx={{
                              display: 'flex',
                              pb: '15px',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderBottom: `1px solid ${theme.palette.warning['A100']}`,
                            }}
                          >
                            <Box
                              sx={{
                                fontSize: '16px',
                                fontWeight: 400,
                                color: theme.palette.warning['300'],
                              }}
                            >
                              {boardItem?.name}
                            </Box>
                            <Radio
                              checked={formData?.BOARD === boardItem?.name}
                              onChange={(e) => {
                                const selectedBoard = e.target.value;
                                setFormData((prevFormData) => {
                                  const updatedFormData = {
                                    ...prevFormData,
                                    BOARD: selectedBoard,
                                  };
                                 
                                  setFormDataUpdated(true);
                                  return updatedFormData;
                                });
                              }}
                              value={boardItem?.name}
                              name="radio-buttons"
                              inputProps={{ 'aria-label': boardItem?.name }}
                            />
                          </Box>
                        </Box>
                      ))}
                    </>
                  )}

                  {activeStep === 1 && (
                    <>
                      <Box
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: theme.palette.warning['500'],
                        }}
                      >
                        {t('BOARD_ENROLMENT.CHOOSE_SUBJECT')}
                      </Box>
                      <Box
                        sx={{
                          py: '10px',
                          borderBottom: `1px solid ${theme.palette.warning['A100']}`,
                        }}
                      >
                        <FormControlLabel
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexDirection: 'row-reverse',
                            ml: 0,
                            mr: 0,
                            color: theme.palette.warning['300'],
                          }}
                          label={t('COMMON.SELECT_ALL')}
                          control={
                            <Checkbox
                              checked={
                                formData?.SUBJECTS.length ===
                                subjectOptions?.length
                              }
                              indeterminate={
                                formData?.SUBJECTS.length > 0 &&
                                formData?.SUBJECTS.length <
                                  subjectOptions.length
                              }
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setFormData({
                                  ...formData,
                                  SUBJECTS: isChecked
                                    ? [...subjectOptions]
                                    : [],
                                });
                                setFormDataUpdated(true);
                              }}
                              sx={{
                                color: theme.palette.warning['300'],
                                '&.Mui-checked, &.MuiCheckbox-indeterminate': {
                                  color: theme.palette.warning['300'],
                                },
                              }}
                            />
                          }
                        />
                      </Box>
                      {subjectOptions?.map((subject, index) => (
                        <Box
                          key={subject.code}
                          sx={{
                            py: '10px',
                            borderBottom: `1px solid ${theme.palette.warning['A100']}`,
                          }}
                        >
                          <FormControlLabel
                            label={subject?.name}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              flexDirection: 'row-reverse',
                              ml: 0,
                              mr: 0,
                              color: theme.palette.warning['300'],
                            }}
                            control={
                              <Checkbox
                                checked={
                                  Array.isArray(formData?.SUBJECTS) &&
                                  formData?.SUBJECTS.some(
                                    (sub: { name: any }) =>
                                      sub.name === subject.name
                                  )
                                }
                                onChange={(e) => {
                                  const isChecked = e.target.checked;

                                  const updatedSubjects = isChecked
                                    ? [...formData?.SUBJECTS, subject]
                                    : formData?.SUBJECTS?.filter(
                                        (sub: { name: any }) =>
                                          sub.name !== subject.name
                                      );
                                  setFormDataUpdated(true);

                                  setFormData({
                                    ...formData,
                                    SUBJECTS: updatedSubjects,
                                  });
                                }}
                                sx={{
                                  color: theme.palette.warning['300'],
                                  '&.Mui-checked': {
                                    color: theme.palette.warning['300'],
                                  },
                                }}
                              />
                            }
                          />
                        </Box>
                      ))}
                    </>
                  )}
                </Box>

                {activeStep === 2 && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      id="outlined-basic"
                      label={t('BOARD_ENROLMENT.BOARD_ENROLLMENT_NUMBER')}
                      variant="outlined"
                      style={{ color: theme?.palette?.warning['A200'] }}
                      value={formData.REGISTRATION}
                      onChange={(e) => {
                        let value = e.target.value;
                        setFormDataUpdated(true);
                        // Remove multiple spaces and allow only one space at the end
                        value = value
                          .replace(/\s+/g, ' ')
                          .replace(/( )+$/, ' ');
                        // Ensure value matches the allowed pattern (letters, numbers, single spaces)
                        const regex = /^[a-zA-Z0-9\s]*$/;
                        if (regex.test(value)) {
                          setFormData({
                            ...formData,
                            REGISTRATION: value.trim(), // Trim leading and trailing spaces
                          });
                        }
                      }}
                      InputLabelProps={{
                        shrink: formData.REGISTRATION ? true : false,
                      }}
                    />
                  </Box>
                )}

                {activeStep === 3 && (
                  <Box
                    mt={2}
                    sx={{
                      borderBottom: `1px solid ${theme.palette.warning['A100']}`,
                      pb: '10px',
                    }}
                  >
                    <FormControl>
                      <FormLabel
                        sx={{
                          fontSize: '12px',
                          fontWeight: '400',
                          color: theme.palette.warning['200'],
                          '&.Mui-focused': {
                            color: theme.palette.warning['200'],
                          },
                        }}
                        id="demo-row-radio-buttons-group-label"
                      >
                        {t('BOARD_ENROLMENT.EXAM_FEES_PAID')}
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={formData.FEES}
                        onChange={(e) => {
                          setFormData({ ...formData, FEES: e.target.value });
                          setFormDataUpdated(true);
                        }}
                      >
                        {formData.BOARD === 'NIOS' ? (
                          <>
                            <FormControlLabel
                              value="yes"
                              control={<Radio />}
                              label={t('COMMON.YES')}
                              sx={{ color: theme.palette.warning['300'] }}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio />}
                              label={t('FORM.NO')}
                              sx={{ color: theme.palette.warning['300'] }}
                            />
                          </>
                        ) : (
                          <FormControlLabel
                            value="na"
                            control={<Radio />}
                            label={t('COMMON.NA')}
                            sx={{ color: theme.palette.warning['300'] }}
                          />
                        )}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                )}

                {/* Button starts form here  */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    alignItems: 'center',
                    '@media (min-width: 900px)': {
                      justifyContent: 'flex-end',
                    },
                  }}
                >
                  <Button
                    sx={{
                      color: theme.palette.error.contrastText,
                      fontSize: '14px',
                      fontWeight: '500',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        border: `1px solid ${theme.palette.error.contrastText}`,
                      },
                      border: `1px solid ${theme.palette.error.contrastText}`,
                      mt: '15px',
                      width: 'fit-content',
                      px: '20px',
                    }}
                    className="one-line-text"
                    variant="outlined"
                    onClick={handleOpenModal}
                    disabled={activeStep === 0}
                  >
                    {t('GUIDE_TOUR.PREVIOUS')}
                  </Button>
                  <Button
                    sx={{
                      height: '40px',
                      fontSize: '14px',
                      fontWeight: '500',
                      mt: '15px',
                      width: 'fit-content',
                      px: '20px',
                    }}
                    className="one-line-text"
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={isNextDisabled()}
                    // onClick={navigateToStep}
                  >
                    {activeStep > 2
                      ? t('COMMON.SAVE')
                      : t('BOARD_ENROLMENT.SAVE_AND_NEXT')}
                  </Button>
                </Box>
                {/* Button end here  */}

                <ConfirmationModal
                  message={getMessage()}
                  handleAction={
                    backButtonClicked ? handleBackEvent : confirmBack
                  }
                  buttonNames={{
                    primary: t('COMMON.YES'),
                    secondary: t('COMMON.CANCEL'),
                  }}
                  handleCloseModal={handleCloseModel}
                  modalOpen={modalOpen}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              color: theme.palette.warning['400'],
              fontWeight: 500,
              fontSize: '12px',
              marginTop: 2,
              px: '16px',
              '@media (min-width: 900px)': {
                textAlign: 'center',
              },
            }}
          >
            {activeStep > 2
              ? t('BOARD_ENROLMENT.MANDATORY', {
                  FeesStepBoards: FeesStepBoards.join(', '),
                })
              : t('BOARD_ENROLMENT.TO_SAVE_YOUR_PROGRESS')}
          </Box>
        </>
      )}
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export default BoardEnrollmentDetail;
