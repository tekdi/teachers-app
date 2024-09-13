import ConfirmationModal from '@/components/ConfirmationModal';
import FacilitatorDrawer from '@/components/FacilitatorDrawer';
import Header from '@/components/Header';
import { logEvent } from '@/utils/googleAnalytics';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useRouter } from 'next/router';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import {
  getSolutionDetails,
  getTargetedSolutions,
  getUserProjectDetails,
  getUserProjectTemplate,
  UserStatusDetails,
} from '@/services/CoursePlannerService';
import useCourseStore from '@/store/coursePlannerStore';
import dayjs from 'dayjs';
import { AssessmentStatus, Role } from '@/utils/app.constant';
import Loader from '@/components/Loader';
import withAccessControl from '@/utils/hoc/withAccessControl';
import { accessControl } from '../../app.config';
import taxonomyStore from '@/store/taxonomyStore';

const CoursePlannerDetail = () => {
  const theme = useTheme<any>();
  const router = useRouter();
  const { t } = useTranslation();
  const setResources = useCourseStore((state) => state.setResources);
  const store = useCourseStore();
  const tStore = taxonomyStore();
  const [loading, setLoading] = useState(false);
  // Initialize the panels' state, assuming you have a known set of panel IDs
  const [expandedPanels, setExpandedPanels] = useState<{
    [key: string]: boolean;
  }>({
    'panel0-header': true,
    'panel1-header': true,
    'panel2-header': true,
    'panel3-header': true,
  });
  const [drawerState, setDrawerState] = React.useState({ bottom: false });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [courseDetails, setCourseDetails] = useState(null);
  const [userProjectDetails, setUserProjectDetails] = useState<any>();
  const [statusData, setStatusData] = useState<any>();


  const fetchCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTargetedSolutions({
        subject: tStore?.taxonomySubject,
        class: tStore?.grade,
        state: tStore?.state,
        board: tStore?.board,
        type: tStore?.type,
        medium: tStore?.medium,
      });

      if (response?.result?.data == '') {
        setLoading(false);
        return;
      }

      const courseData = response?.result?.data[0];

      let courseId = courseData._id;

      if (!courseId) {
        courseId = await fetchCourseIdFromSolution(courseData?.solutionId);
      }

      await fetchAndSetUserProjectDetails(courseId);
    } catch (error) {
      console.error('Error fetching course planner:', error);
    }
  }, [statusData]);

  const fetchCourseIdFromSolution = async (
    solutionId: string
  ): Promise<string> => {
    try {
      const solutionResponse = await getSolutionDetails({
        id: solutionId,
        role: 'Teacher',
      });

      const externalId = solutionResponse?.result?.externalId;

      const templateResponse = await getUserProjectTemplate({
        templateId: externalId,
        solutionId,
        role: Role.TEACHER,
      });

      const updatedResponse = await getTargetedSolutions({
        subject: tStore?.taxonomySubject,
        class: tStore?.grade,
        state: tStore?.state,
        board: tStore?.board,
        type: tStore?.type,
        medium: tStore?.medium,
      });
      setLoading(false);

      return updatedResponse?.result?.data[0]?._id;
    } catch (error) {
      console.error('Error fetching solution details:', error);
      throw error;
    }
  };

  const fetchAndSetUserProjectDetails = async (courseId: string) => {
    try {
      setLoading(true);
      const userProjectDetailsResponse = await getUserProjectDetails({
        id: courseId,
      });
      setUserProjectDetails(userProjectDetailsResponse?.result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user project details:', error);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const handleBackEvent = () => {
    window.history.back();
    logEvent({
      action: 'back-button-clicked-attendance-overview',
      category: 'Attendance Overview Page',
      label: 'Back Button Clicked',
    });
  };

  const handleToggleAll = () => {
    const allOpen = Object.values(expandedPanels).every(Boolean);
    const newState = Object.keys(expandedPanels).reduce(
      (acc, key) => {
        acc[key] = !allOpen;
        return acc;
      },
      {} as { [key: string]: boolean }
    );
    setExpandedPanels(newState);
  };
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerState({ ...drawerState, bottom: open });
      setIsDrawerOpen((prevIsDrawerOpen) => !prevIsDrawerOpen);
    };

  const handleCloseModel = () => {
    setModalOpen(false);
  };
  // const handleOpenModel = () => {
  //   setModalOpen(true);
  // };

  const getAbbreviatedMonth = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const months = Array.from({ length: 12 }, (_, i) =>
      dayjs().month(i).format('MMM')
    );
    return months[date.getMonth()];
  };

  const markStatus = async (data: any, topid: any, subid: any) => {
    const updatedData = { ...data };

    updatedData.tasks = updatedData?.tasks.map(
      (task: { _id: any; children: any[] }) => {
        if (task._id === topid) {
          task.children = task?.children?.map((child: { _id: any }) => {
            if (child._id === subid) {
              return { ...child, status: AssessmentStatus.COMPLETED_SMALL };
            }
            return child;
          });
        }
        return task;
      }
    );

    updatedData.tasks = updatedData?.tasks?.filter(
      (task: { children: any[] }) =>
        task?.children?.some(
          (child: { status: string }) =>
            child.status === AssessmentStatus.COMPLETED_SMALL
        )
    );

    const lastDownloadedAt = updatedData?.lastDownloadedAt;
    const id = updatedData?._id;
    setStatusData(updatedData);
    try {
      const response = await UserStatusDetails({
        data: updatedData,
        id,
        lastDownloadedAt,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const isStatusCompleted = (subTopicId: any) => {
    const taskWithChildren = userProjectDetails.tasks.find(
      (task: { children: any[] }) =>
        task.children.some((child: { _id: any }) => child._id === subTopicId)
    );

    if (taskWithChildren) {
      const child = taskWithChildren.children.find(
        (child: { _id: any }) => child._id === subTopicId
      );

      return child && child.status === 'completed';
    }

    return false;
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          color: theme.palette.warning['A200'],
          padding: '15px 16px 5px',
          gap: '15px',
        }}
        width={'100%'}
      >
        <KeyboardBackspaceOutlinedIcon
          onClick={handleBackEvent}
          cursor={'pointer'}
          sx={{ color: theme.palette.warning['A200'] }}
        />
        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <Box sx={{ width: '40px', height: '40px' }}>
                <CircularProgressbar
                  value={10}
                  strokeWidth={10}
                  styles={buildStyles({
                    pathColor: '#06A816',
                    trailColor: '#E6E6E6',
                    strokeLinecap: 'round',
                  })}
                />
              </Box>

              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    fontSize: '11px',
                    color: theme.palette.warning['300'],
                    fontWeight: '500',
                  }}
                >
                  10%
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                fontSize: '16px',
                color: theme.palette.warning['300'],
              }}
            >
              {store.subject}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          pr: '16px',
          alignItems: 'center',
        }}
        mt={2}
      >
        <Box
          sx={{
            fontSize: '12px',
            fontWeight: '500',
            color: theme.palette.warning['300'],
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onClick={handleToggleAll}
        >
          {Object.values(expandedPanels).every(Boolean)
            ? t('COURSE_PLANNER.COLLAPSE_ALL')
            : t('COURSE_PLANNER.EXPAND_ALL')}
          {Object.values(expandedPanels).every(Boolean) ? (
            <ArrowDropUpIcon sx={{ color: theme.palette.warning['300'] }} />
          ) : (
            <ArrowDropDownIcon sx={{ color: theme.palette.warning['300'] }} />
          )}
        </Box>
      </Box>

      <div>
        {loading ? (
          <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
        ) : (
          <>
            <Box mt={2}>
  {userProjectDetails?.tasks?.length > 0 ? (
    userProjectDetails.tasks.map((topic: any, index: number) => (
      <Box key={topic._id} sx={{ borderRadius: '8px', mb: 2 }}>
        <Accordion
          expanded={expandedPanels[`panel${index}-header`] || false}
          onChange={() =>
            setExpandedPanels((prev) => ({
              ...prev,
              [`panel${index}-header`]: !prev[`panel${index}-header`],
            }))
          }
          sx={{
            boxShadow: 'none',
            background: '#F1E7D9',
            border: 'none',
            transition: '0.3s',
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDropDownIcon sx={{ color: theme.palette.warning['300'] }} />
            }
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
            className="accordion-summary"
            sx={{
              px: '16px',
              m: 0,
              '&.Mui-expanded': {
                minHeight: '48px',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                pr: '5px',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <RadioButtonUncheckedIcon sx={{ fontSize: '15px' }} />
                <Typography
                  fontWeight="500"
                  fontSize="14px"
                  color={theme.palette.warning['300']}
                >
                  {`Topic ${index + 1} - ${topic.name}`}
                </Typography>
              </Box>
              <Typography fontWeight="600" fontSize="12px" color="#7C766F">
                {getAbbreviatedMonth(topic?.metaInformation?.startDate)},{' '}
                {getAbbreviatedMonth(topic?.metaInformation?.endDate)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: '0',
              transition: 'max-height 0.3s ease-out',
            }}
          >
            {topic.children.map((subTopic: any) => (
              <Box
                key={subTopic._id}
                sx={{
                  borderBottom: `1px solid ${theme.palette.warning['A100']}`,
                }}
              >
                <Box
                  sx={{
                    py: '10px',
                    px: '16px',
                    background: theme.palette.warning['A400'],
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '20px',
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '16px',
                        fontWeight: '400',
                        color: theme.palette.warning['300'],
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setResources(subTopic);
                        router.push(`/topic-detail-view`);
                      }}
                    >
                      {subTopic.name}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Box
                        sx={{
                          padding: '5px',
                          background: '  #C1D6FF',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#4D4639',
                          borderRadius: '8px',
                        }}
                      >
                        {getAbbreviatedMonth(
                          subTopic?.metaInformation?.startDate
                        )}
                      </Box>
                      <CheckCircleIcon
                        onClick={() => {
                          if (!isStatusCompleted(subTopic._id)) {
                            markStatus(userProjectDetails, topic._id, subTopic._id);
                          }
                        }}
                        sx={{
                          fontSize: '20px',
                          color: isStatusCompleted(subTopic._id)
                            ? '#4CAF50'
                            : '#7C766e',
                          cursor: isStatusCompleted(subTopic._id)
                            ? 'default'
                            : 'pointer',
                          pointerEvents: isStatusCompleted(subTopic._id)
                            ? 'none'
                            : 'auto',
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      color: theme.palette.secondary.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      mt: 0.8,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      router.push(`/topic-detail-view`);
                    }}
                  >
                    <Box
                      sx={{ fontSize: '12px', fontWeight: '500' }}
                      onClick={() => {
                        setResources(subTopic);
                        router.push(`/topic-detail-view`);
                      }}
                    >
                      {`${subTopic?.learningResources?.length} ${t(
                        'COURSE_PLANNER.RESOURCES'
                      )}`}
                    </Box>
                    <ArrowForwardIcon sx={{ fontSize: '16px' }} />
                  </Box>
                </Box>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      </Box>
    ))
  ) : (
    <Typography sx={{ mt: 2, textAlign: 'center', color: '#7C766F' }}>
     {t('ASSESSMENTS.NO_DATA_FOUND')}
    </Typography>
  )}
</Box>

          </>
        )}
      </div>
      <FacilitatorDrawer
        secondary={'Cancel'}
        primary={'Mark as Complete (2)'}
        toggleDrawer={toggleDrawer}
        drawerState={drawerState}
      />

      {/* <ConfirmationModal
        message={
          'You are unchecking this topic as complete. Are you sure you want to save this change?'
        }
        buttonNames={{
          primary: ' Yes',
          secondary: 'No, go back',
        }}
        handleCloseModal={handleCloseModel}
        modalOpen={modalOpen}
      /> */}
    </>
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

export default withAccessControl(
  'accessCoursePlannerDetails',
  accessControl
)(CoursePlannerDetail);
