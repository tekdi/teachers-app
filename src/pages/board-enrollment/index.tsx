import CenterSessionModal from '@/components/CenterSessionModal';
import CohortSelectionSection from '@/components/CohortSelectionSection';
import Header from '@/components/Header';
import HorizontalLinearStepper from '@/components/HorizontalLinearStepper';
import PieChartGraph from '@/components/PieChartGraph';
import SortingModal from '@/components/SortingModal';
import { showToastMessage } from '@/components/Toastify';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import {
  calculateStageCounts,
  debounce,
  handleKeyDown,
  toPascalCase,
} from '@/utils/Helper';
import { BoardEnrollmentStageCounts, ICohort, user } from '@/utils/Interfaces';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import EastIcon from '@mui/icons-material/East';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button, Grid, IconButton, InputBase, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { useDirection } from '../../hooks/useDirection';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import useStore from '@/store/store';
import { FormContext, FormContextType, limit, Status } from '@/utils/app.constant';
import { useQueryClient } from '@tanstack/react-query';
import { getFormRead } from '@/hooks/useFormRead';
import boardEnrollmentStore from '@/store/boardEnrollmentStore';
import NoDataFound from '@/components/common/NoDataFound';
import { usePathname } from 'next/navigation';

interface SourceDetails {
  externalsource?: string;
}

interface Field {
  label: string;
  name: string;
  fieldId: string;
  order: string;
  sourceDetails?: SourceDetails | null;
  type?: string;
}

interface FormResponse {
  formid: string;
  title: string;
  fields: Field[];
}

interface CustomField {
  fieldId: string;
  label: string;
  value: string | object;
  type?: string;
  sourceDetails?: object | null;
  order?: string | null | undefined;
}

interface FormattedMember {
  customField: CustomField[];
}

const BoardEnrollment = () => {
  const theme = useTheme<any>();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { dir, isRTL } = useDirection();
  const router = useRouter();
  const pathname = usePathname();
  const store = useStore();
  const isActiveYear = store.isActiveYearSelected;
  const searchRef = useRef<HTMLDivElement>(null);
  const setBoardEnrollmentData = boardEnrollmentStore(
    (state: { setBoardEnrollmentData: any }) => state.setBoardEnrollmentData
  );
  const [boardEnrollmentList, setBoardEnrollmentList] = useState<any>([]);
  const [classId, setClassId] = React.useState('');
  const [cohortsData, setCohortsData] = React.useState<Array<ICohort>>([]);
  const [manipulatedCohortData, setManipulatedCohortData] =
    React.useState<Array<ICohort>>(cohortsData);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [displayStudentList, setDisplayStudentList] = React.useState<
    Array<user>
  >([]);
  const [searchWord, setSearchWord] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [statusReason, setStatusReason] = useState<string | null>(null);
  const [totalLearners, setTotalLearners] = useState<number | null>(0);
  const [stagesCount, setStagesCount] = useState<BoardEnrollmentStageCounts>({
    board: 0,
    subjects: 0,
    registration: 0,
    fees: 0,
    completed: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      setClassId(localStorage.getItem('classId') ?? '');
      const classId = localStorage.getItem('classId') ?? '';
      localStorage.setItem('cohortId', classId);
      setLoading(false);
      if (token) {
        if (isActiveYear) {
          router.push('/board-enrollment');
        } else {
          router.push('/centers');
        }
      } else {
        router.push('/login', undefined, { locale: 'en' });
      }
    }
  }, []);

  useEffect(() => {
    if (classId) fetchCohortMembers(classId);
  }, [classId]);

  // Fetch Form Data Declaration
  const fetchFormData = async (): Promise<FormResponse> => {
    try {
      const response = await queryClient.fetchQuery({
        queryKey: [
          'formRead',
          FormContext.COHORT_MEMBER,
          FormContextType.COHORT_MEMBER,
        ],
        queryFn: () =>
          getFormRead(FormContext.COHORT_MEMBER, FormContextType.COHORT_MEMBER),
      });
      return response;
    } catch (error) {
      console.error('Error fetching form data:', error);
      throw error;
      // handleFetchError(error);
    }
  };

  // Use fetchFormData with await in fetchCohortMembers
  const fetchCohortMembers = async (classId: string) => {
    setLoading(true);

    try {
      const members = await fetchMemberList(classId);
      const filteredMembers = filterMembersByDate(members);
      const formattedMembers = formatMemberData(filteredMembers);
      // setDisplayStudentList(formattedMembers);
      setTotalLearners(formattedMembers.length);
      if (formattedMembers.length === 0) {
        setDisplayStudentList([]);
        setBoardEnrollmentList([]);
      }

      if (formattedMembers.length > 0) {
        const formData = await fetchFormData();
        const extractFieldData = (data: FormResponse) => {
          return data?.fields?.map(
            ({ label, name, fieldId, order, sourceDetails }) => ({
              label,
              name,
              fieldId,
              order,
              sourceDetails,
            })
          );
        };

        const resultData = extractFieldData(formData);
        const updatedMemberData = updateFormattedMember(
          formattedMembers,
          resultData
        );

        const checkStageCompletion = (data: any[]) => {
          return data.map((item) => {
            // Count fields with non-empty values
            const completedStep = item.customField.reduce(
              (count: number, field: any) => {
                if (field.value && field.value !== '') {
                  return count + 1;
                }
                return count;
              },
              0
            );

            return {
              ...item,
              completedStep,
            };
          });
        };
        const processedData = checkStageCompletion(updatedMemberData);
        setBoardEnrollmentList(processedData);
        setDisplayStudentList(processedData);
        setBoardEnrollmentData(processedData);
        const stageCounts = calculateStageCounts(processedData);
        setStagesCount(stageCounts);
      }
    } catch (error) {
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberList = async (classId: string) => {
    const response = await getMyCohortMemberList({
      limit,
      page: 0,
      filters: { cohortId: classId },
    });
    return response?.result?.userDetails || [];
  };

  const filterMembersByDate = (members: any[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return members.filter((entry: any) => {
      const createdAtDate = new Date(entry.createdAt);
      createdAtDate.setHours(0, 0, 0, 0);
      return createdAtDate <= today;
    });
  };

  const formatMemberData = (members: any[]) => {
    return members.map((entry: any) => ({
      userId: entry.userId,
      cohortMembershipId: entry.cohortMembershipId,
      name: toPascalCase(entry?.firstName || '') + ' ' + (entry?.lastName ? toPascalCase(entry.lastName) : ""),

      
      memberStatus: entry.status,
      statusReason: entry.statusReason,
      customField: entry.customField,
    }));
  };

  const handleFetchError = (error: any) => {
    console.error('Error fetching cohort list:', error);
    showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
  };

  const updateFormattedMember = (
    formattedMember: FormattedMember[],
    formData: Field[]
  ): FormattedMember[] => {
    // Identify fields that need parsing
    const parseFields = new Set(
      formData
        .filter(
          (formField) =>
            formField.label === 'BOARD' || formField.label === 'SUBJECTS'
        )
        .map((formField) => formField.fieldId)
    );

    const formDataFieldMap = new Map<string, Field>(
      formData.map((field) => [field.fieldId, field])
    );

    // Update each member's customField array
    formattedMember.forEach((member) => {
      // Convert customField array to a Map for easy fieldId access
      const customFieldMap = new Map<string, CustomField>(
        member.customField.map((field) => [field.fieldId, field])
      );

      // Ensure all fields from formData are in customField
      member.customField = Array.from(formDataFieldMap.values()).map(
        (formField) => {
          const existingField = customFieldMap.get(formField.fieldId);

          const field: CustomField = {
            fieldId: formField.fieldId,
            label: formField.label,
            value: existingField?.value || '',
            type: existingField?.type || 'text', // Default type to 'text'
            sourceDetails: formField.sourceDetails || null,
            order: formField.order || null,
          };

          // Parse JSON if the fieldId is in parseFields
          if (parseFields.has(field.fieldId)) {
            try {
              field.value = JSON.parse(field.value as string);
            } catch (error) {
              console.warn(
                `Unable to parse value for fieldId ${field.fieldId}:`,
                error
              );
            }
          }
          return field;
        }
      );
    });

    return formattedMember;
  };

  const handleOpen = (reason: string | null) => {
    setStatusReason(reason);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setStatusReason(null);
  };
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSearchSubmit = () => {
    const filteredList = boardEnrollmentList?.filter((user: any) =>
      user.name.toLowerCase().includes(searchWord.toLowerCase())
    );
    setDisplayStudentList(filteredList);
  };

  const debouncedSearch = debounce((value: string) => {
    const filteredList = boardEnrollmentList?.filter((user: any) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayStudentList(filteredList || []);
  }, 200);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = event.target.value.replace(/\s{2,}/g, ' ').trimStart();
    setSearchWord(trimmedValue);
    if (trimmedValue.length >= 3) {
      debouncedSearch(trimmedValue);
    } else if (trimmedValue === '') {
      // If search is cleared, show the full list
      debouncedSearch.cancel();
      setDisplayStudentList(boardEnrollmentList);
    } else {
      setDisplayStudentList(boardEnrollmentList);
    }
  };

  const handleSearchClear = () => {
    setSearchWord('');
    debouncedSearch.cancel();
    setDisplayStudentList(boardEnrollmentList);
  };

  const handleScrollDown = () => {
    if (inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const scrollMargin = 20;
      const scrollY = window.scrollY;
      const targetY = inputRect.top + scrollY - scrollMargin;
      window.scrollTo({ top: targetY - 170, behavior: 'smooth' });
    }
  };

  const handleSorting = (
    sortByName: string,
    sortByAttendance: string,
    sortByClassesMissed: string,
    sortByAttendanceNumber: string,
    sortByStages: string
  ) => {
    handleCloseModal();
    let filteredData = [...boardEnrollmentList];

    // Sorting by name
    switch (sortByName) {
      case 'asc':
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'desc':
        filteredData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    // Filtering by stages
    switch (sortByStages) {
      case 'board':
        filteredData = filteredData.filter((item) => item.completedStep === 0);
        break;
      case 'subjects':
        filteredData = filteredData.filter((item) => item.completedStep === 1);
        break;
      case 'registration':
        filteredData = filteredData.filter((item) => item.completedStep === 2);
        break;
      case 'fee':
        filteredData = filteredData.filter((item) => item.completedStep === 3);
        break;
      case 'completed':
        filteredData = filteredData.filter((item) => item.completedStep === 4);
        break;
      default:
        break;
    }

    setDisplayStudentList(filteredData);
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          px: '16px',
          color: theme.palette.warning['A200'],
          fontSize: '22px',
          fontWeight: '400',
          mt: 3,
        }}
      >
        {t('BOARD_ENROLMENT.BOARD_ENROLLMENT')}
      </Box>

      <Box sx={{ px: '16px' }}>
        <Grid container sx={{ mt: '20px', alignItems: 'flex-end' }}>
          <Grid item xs={8}>
            <Box>
              <CohortSelectionSection
                classId={classId}
                setClassId={setClassId}
                userId={userId}
                setUserId={setUserId}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                loading={loading}
                setLoading={setLoading}
                cohortsData={cohortsData}
                setCohortsData={setCohortsData}
                manipulatedCohortData={manipulatedCohortData}
                setManipulatedCohortData={setManipulatedCohortData}
                isManipulationRequired={false}
                // blockName={blockName}
                // setBlockName={setBlockName}
                isCustomFieldRequired={true}
                showFloatingLabel={true}
                showDisabledDropDown={true}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {totalLearners !== 0 ? <PieChartGraph stagesCount={stagesCount} /> : null}

      <Box
        color={theme.colorSchemes.dark.palette.warning.A400}
        fontWeight={500}
        fontSize={'12px'}
        mt={2}
        pl={'16px'}
      >
        {t('BOARD_ENROLMENT.TOTAL_LEARNERS')}: {totalLearners}
      </Box>

      <Box sx={{mr:'20px'}}>
        <Grid container alignItems={'end'} spacing={2}>
          <Grid item xs={8} ref={searchRef}>
            <Box sx={{ px: '16px', mt: 2 }}>
              <Paper
                component="form"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSearchSubmit();
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '100px',
                  background: theme.palette.warning.A700,
                  boxShadow: 'none',
                }}
              >
                <InputBase
                  ref={inputRef}
                  value={searchWord}
                  sx={{
                    ml: isRTL ? 0 : 3,
                    mr: isRTL ? 3 : 0,
                    flex: 1,
                    mb: '0',
                    fontSize: '14px',
                  }}
                  placeholder={t('COMMON.SEARCH_STUDENT') + '..'}
                  inputProps={{ 'aria-label': t('ASSESSMENTS.SEARCH_STUDENT') }}
                  onChange={handleSearch}
                  onClick={handleScrollDown}
                  onKeyDown={handleKeyDown}
                />
                <IconButton
                  type="button"
                  sx={{ p: '10px' }}
                  aria-label="search"
                  onClick={handleSearchSubmit}
                >
                  <SearchIcon />
                </IconButton>

                {searchWord?.length > 0 && (
                  <IconButton
                    type="button"
                    aria-label="Clear"
                    onClick={handleSearchClear}
                  >
                    <ClearIcon
                      sx={{
                        color: theme.palette.warning['A200'],
                      }}
                    />
                  </IconButton>
                )}
              </Paper>
            </Box>
          </Grid>
          <Grid
            sx={{ display: 'flex', justifyContent: 'flex-end', }}
            xs={4}
            item
          >
            <Button
              onClick={handleOpenModal}
              sx={{
                color: theme.palette.warning.A200,
                '& .MuiButton-endIcon': {
                  marginLeft: isRTL ? '0px !important' : '8px !important',
                  marginRight: isRTL ? '8px !important' : '-2px !important',
                },
                borderRadius: '10px',
                fontSize: '14px',
              }}
              endIcon={<ArrowDropDownSharpIcon />}
              size="small"
              variant="outlined"
              className="one-line-text"
            >
              {t('COMMON.FILTERS')}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Grid container sx={{ my: 4, px: '16px' }} spacing={2}>
        {displayStudentList.length >= 1 ? (
          <>
            {displayStudentList?.map((item: any, index: any) => {
              return (
                <Grid key={index} item xs={12} sm={12} md={6} lg={4}>
                  <Box
                    sx={{
                      border: `1px solid ${theme.palette.warning['A100']}`,
                      minHeight: '143px',
                      borderRadius: '8px',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      if (item?.memberStatus === Status.DROPOUT) {
                        handleOpen(item?.statusReason);
                      } else {
                        router.push(
                          `/board-enrollment/student-detail/${item?.userId}`
                        );
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: '12px 16px 0',
                        gap: '6px',
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: '16px',
                          fontWeight: '400',
                          color:
                            item?.memberStatus === Status.DROPOUT
                              ? theme.palette.warning['400']
                              : theme.palette.warning['300'],
                        }}
                      >
                        {item?.name}
                      </Box>
                      <EastIcon
                        sx={{
                          color:
                            item.memberStatus === Status.DROPOUT
                              ? theme.palette.warning['400']
                              : theme.palette.warning['300'],
                          transform: isRTL ? ' rotate(180deg)' : 'unset',
                        }}
                      />
                    </Box>
                    {/* <Box
                  sx={{
                    color: theme.palette.warning['400'],
                    fontWeight: '500',
                    fontSize: '12px',
                    mt: 0.5,
                    px: '16px',
                  }}
                >
                  {item.center}
                </Box> */}
                    {item?.memberStatus === Status.DROPOUT ? (
                      <Box
                        mt={2}
                        sx={{
                          background: theme.palette.error.light,
                          p: '4px 8px',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: theme.palette.warning['300'],
                          fontWeight: '500',
                          gap: '5px',
                          mb: '12px',
                          mx: '16px',
                          mt: 4,
                        }}
                      >
                        {t('COMMON.DROPPED_OUT')}{' '}
                        <InfoOutlinedIcon
                          sx={{
                            color: theme.palette.warning['300'],
                            fontSize: '22px',
                          }}
                        />
                      </Box>
                    ) : (
                      <Box mt={2} pb={'12px'}>
                        <HorizontalLinearStepper
                          activeStep={item.completedStep}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>
              );
            })}
            <CenterSessionModal
              open={open}
              handleClose={handleClose}
              title={t('COMMON.DROPPED_OUT')}
            >
              <Box sx={{ p: '16px' }}>
                <Box
                  sx={{
                    color: theme.palette.warning['400'],
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {t('COMMON.REASON_FOR_DROPOUT')}
                </Box>
                <Box
                  sx={{
                    color: theme.palette.warning['300'],
                    fontSize: '16px',
                    fontWeight: 500,
                    mt: '8px',
                  }}
                >
                  {statusReason}
                </Box>
              </Box>
            </CenterSessionModal>
          </>
        ) : (
          <NoDataFound />
        )}
      </Grid>

        <SortingModal
          isModalOpen={modalOpen}
          handleCloseModal={handleCloseModal}
          handleSorting={handleSorting}
          routeName={pathname}
        />
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

export default BoardEnrollment;
