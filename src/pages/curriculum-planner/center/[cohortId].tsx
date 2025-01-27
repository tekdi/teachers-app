import FacilitatorDrawer from '@/components/FacilitatorDrawer';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import {
  getSolutionDetails,
  getTargetedSolutions,
  getUserProjectDetails,
  getUserProjectTemplate,
  UserStatusDetails,
} from '@/services/CoursePlannerService';
import useCourseStore from '@/store/coursePlannerStore';
import {
  AssessmentStatus,
  Role,
  TelemetryEventType,
} from '@/utils/app.constant';
import { logEvent } from '@/utils/googleAnalytics';
import withAccessControl from '@/utils/hoc/withAccessControl';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
// import { accessControl } from '../../app.config';
import useDeterminePathColor from '@/hooks/useDeterminePathColor';
import { fetchBulkContents } from '@/services/PlayerService';
import taxonomyStore from '@/store/taxonomyStore';
import { telemetryFactory } from '@/utils/telemetry';
import { GetStaticPaths } from 'next';
import { accessControl } from '../../../../app.config';
import { useDirection } from '../../../hooks/useDirection';

export interface IResource {
  name: string;
  link: string;
  app: string;
  type: string;
  id: string;
  topic?: string;
  subtopic?: string;
}

const CoursePlannerDetail = () => {
  const theme = useTheme<any>();
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const setSelectedResource = useCourseStore(
    (state) => state.setSelectedResource
  );
  const setResources = useCourseStore((state) => state.setResources);
  const store = useCourseStore();
  const tStore = taxonomyStore();
  const [loading, setLoading] = useState(false);
  const determinePathColor = useDeterminePathColor();
  const { cohortId }: any = router.query;

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
  const [userProjectDetails, setUserProjectDetails] = useState<any>();
  const [statusData, setStatusData] = useState<any>();

  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [currentSubtopic, setCurrentSubtopic] = useState<{
    topid: any;
    subid: any;
  } | null>(null);
  const [selectedSubtopics, setSelectedSubtopics] = useState<
    { topid: string; subid: string }[]
  >([]);
  const [selectedCount, setSelectedCount] = React.useState(0);

  const fetchCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTargetedSolutions({
        subject: tStore?.taxonomySubject,
        class: tStore?.grade,
        board: tStore?.board,
        courseType: tStore?.type,
        medium: tStore?.medium,
        entityId: cohortId,
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

  useEffect(() => {
    const calculateProgress = (tasks: any[]) => {
      let completionPercentage = 0;
      const weightage = Number((100 / tasks.length).toFixed());
      tasks.forEach((task: any) => {
        if (task.status === AssessmentStatus.COMPLETED_SMALL) {
          completionPercentage += weightage;
        } else {
          const subtasks = task.children || [];
          const subtaskWeightage = Number(
            (weightage / subtasks.length).toFixed()
          );
          subtasks.forEach((subtask: any) => {
            if (subtask.status === AssessmentStatus.COMPLETED_SMALL) {
              completionPercentage += subtaskWeightage;
            }
          });
        }
      });
      setCompletionPercentage(completionPercentage);
    };
    if (userProjectDetails?.tasks?.length) {
      calculateProgress(userProjectDetails.tasks);
    }
  }, [userProjectDetails]);

  const fetchCourseIdFromSolution = async (
    solutionId: string
  ): Promise<string> => {
    try {
      const solutionResponse = await getSolutionDetails({
        id: solutionId,
        role: 'Teacher',
      });

      const externalId = solutionResponse?.result?.externalId;
      await getUserProjectTemplate({
        templateId: externalId,
        solutionId,
        role: Role.TEACHER,
        cohortId,
      });

      const updatedResponse = await getTargetedSolutions({
        subject: tStore?.taxonomySubject,
        class: tStore?.grade,
        board: tStore?.board,
        courseType: tStore?.type,
        medium: tStore?.medium,
        entityId: cohortId,
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
    if (typeof window !== 'undefined' && window.localStorage) {
      const classId = localStorage.getItem('classId');
      router.push(`/curriculum-planner?center=${classId}`);
    }
    // window.history.back();
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
    const windowUrl = window.location.pathname;

    const cleanedUrl = windowUrl.replace(/^\//, '');
    const env = cleanedUrl.split('/')[0];

    const telemetryInteract = {
      context: {
        env: env,
        cdata: [],
      },
      edata: {
        id: 'change-filter:',

        type: TelemetryEventType.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const toggleDrawer =
    (open: boolean, selectedCount: number = 0) =>
    (event?: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerState({ ...drawerState, bottom: open });
      setIsDrawerOpen(open);
      setSelectedCount(selectedCount);
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

  const markMultipleStatuses = async (
    data: any,
    selectedSubtopics: { topid: string; subid: string }[]
  ) => {
    const updatedData = { ...data };

    selectedSubtopics.forEach(({ topid, subid }) => {
      updatedData.tasks = updatedData.tasks.map(
        (task: { status: string; _id: string; children: any[] }) => {
          if (task._id === topid) {
            task.children = task.children.map((child: { _id: string }) => {
              if (child._id === subid) {
                return { ...child, status: AssessmentStatus.COMPLETED_SMALL };
              }
              return child;
            });

            const allSubtasksCompleted = task.children.every(
              (child: { status: string }) =>
                child.status === AssessmentStatus.COMPLETED_SMALL
            );

            if (allSubtasksCompleted) {
              task.status = AssessmentStatus.COMPLETED_SMALL;
            }
          }
          return task;
        }
      );
    });

    setStatusData(updatedData);

    try {
      const response = await UserStatusDetails({
        data: updatedData,
        id: updatedData._id,
        lastDownloadedAt: updatedData.lastDownloadedAt,
      });

      setUserProjectDetails(updatedData);
      setSelectedSubtopics([]);
      toggleDrawer(false)();
    } catch (err) {
      console.log(err);
    }
  };

  const isStatusCompleted = (taskId: any, isSubtask: boolean = true) => {
    if (isSubtask) {
      const taskWithChildren = userProjectDetails.tasks.find(
        (task: { children: any[] }) =>
          task.children.some((child: { _id: any }) => child._id === taskId)
      );

      if (taskWithChildren) {
        const child = taskWithChildren.children.find(
          (child: { _id: any }) => child._id === taskId
        );
        return child && child.status === AssessmentStatus.COMPLETED_SMALL;
      }
    } else {
      const task = userProjectDetails.tasks.find(
        (task: { _id: any }) => task._id === taskId
      );
      return task && task.status === AssessmentStatus.COMPLETED_SMALL;
    }

    return false;
  };

  const fetchLearningResources = async (
    subtopic: any,
    resources: IResource[]
  ) => {
    try {
      resources = resources.map((resource: IResource) => {
        return {
          ...resource,
          id: resource.id ? resource.id.toLowerCase() : resource.id,
        };
      });
      const identifiers = resources.map((resource: IResource) =>
        resource?.id?.toLowerCase()
      );
      const response = await fetchBulkContents(identifiers);

      resources = resources.map((resource: IResource) => {
        const content = response?.find(
          (content: any) =>
            content?.identifier?.toLowerCase() === resource?.id?.toLowerCase()
        );
        return { ...resource, ...content };
      });
      setSelectedResource(subtopic?.name);
      setResources(resources);
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <>
      <Box
        sx={{
          height: '100vh',
          overflowY: 'auto',
        }}
      >
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
            sx={{
              color: theme.palette.warning['A200'],
              transform: isRTL ? ' rotate(180deg)' : 'unset',
            }}
          />
          {!userProjectDetails?.tasks?.length && (
            <Box
              sx={{
                fontSize: '16px',
                color: theme.palette.warning['300'],
              }}
            >
              {tStore?.taxonomySubject}
            </Box>
          )}
          {userProjectDetails?.tasks?.length > 0 && (
            <>
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
                        value={completionPercentage}
                        strokeWidth={10}
                        styles={buildStyles({
                          pathColor: determinePathColor(completionPercentage),
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
                        {completionPercentage}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      fontSize: '16px',
                      color: theme.palette.warning['300'],
                    }}
                  >
                    {tStore?.taxonomySubject}
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>

        {userProjectDetails?.tasks?.length > 0 && (
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
                <ArrowDropDownIcon
                  sx={{ color: theme.palette.warning['300'] }}
                />
              )}
            </Box>
          </Box>
        )}

        <div
          style={{
            marginBottom: drawerState.bottom ? '115px' : '0px',
            transition: 'padding-bottom 0.3s ease',
          }}
        >
          {loading ? (
            <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
          ) : (
            <>
              <Box mt={2}>
                {userProjectDetails?.tasks?.length > 0 ? (
                  userProjectDetails.tasks.map((topic: any, index: number) => (
                    <Box key={topic._id} sx={{ borderRadius: '8px', mb: 2 }}>
                      <Accordion
                        expanded={
                          expandedPanels[`panel${index}-header`] || false
                        }
                        onChange={() =>
                          setExpandedPanels((prev) => ({
                            ...prev,
                            [`panel${index}-header`]:
                              !prev[`panel${index}-header`],
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
                            <ArrowDropDownIcon
                              sx={{ color: theme.palette.warning['300'] }}
                            />
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
                              {/* Check if the parent task is completed and show a black tick */}
                              {/*isStatusCompleted(topic._id, false) ? (
                                <CheckCircleIcon
                                  sx={{ fontSize: '15px', color: 'black' }}
                                />
                              ) : (
                                <RadioButtonUncheckedIcon
                                  sx={{ fontSize: '15px' }}
                                />
                              )*/}
                              <Typography
                                fontWeight="500"
                                fontSize="14px"
                                color={theme.palette.warning['300']}
                              >
                                {`Topic ${index + 1} - ${topic.name}`}
                              </Typography>
                            </Box>

                            <Typography
                              fontWeight="600"
                              fontSize="12px"
                              color="#7C766F"
                            >
                              {getAbbreviatedMonth(
                                topic?.metaInformation?.startDate
                              )}
                              ,{' '}
                              {getAbbreviatedMonth(
                                topic?.metaInformation?.endDate
                              )}
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
                                      fetchLearningResources(
                                        subTopic,
                                        subTopic?.learningResources
                                      );

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
                                          const alreadySelected =
                                            selectedSubtopics.find(
                                              (s) => s.subid === subTopic._id
                                            );

                                          if (alreadySelected) {
                                            setSelectedSubtopics(
                                              selectedSubtopics.filter(
                                                (s) => s.subid !== subTopic._id
                                              )
                                            );

                                            toggleDrawer(
                                              true,
                                              selectedSubtopics.length - 1
                                            )();
                                          } else {
                                            setSelectedSubtopics([
                                              ...selectedSubtopics,
                                              {
                                                topid: topic._id,
                                                subid: subTopic._id,
                                              },
                                            ]);

                                            toggleDrawer(
                                              true,
                                              selectedSubtopics.length + 1
                                            )();
                                          }
                                        }
                                      }}
                                      sx={{
                                        fontSize: '20px',
                                        color: selectedSubtopics.find(
                                          (s) => s.subid === subTopic._id
                                        )
                                          ? '#FF9800'
                                          : isStatusCompleted(subTopic._id)
                                            ? '#4CAF50'
                                            : '#7C766e',
                                        cursor: isStatusCompleted(subTopic._id)
                                          ? 'default'
                                          : 'pointer',
                                        pointerEvents: isStatusCompleted(
                                          subTopic._id
                                        )
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
                                    // setResources(subTopic);
                                    fetchLearningResources(
                                      subTopic,
                                      subTopic?.learningResources
                                    );
                                    router.push(`/topic-detail-view`);
                                  }}
                                  // onClick={() => {
                                  //   // router.push(`/topic-detail-view`);
                                  // }}
                                >
                                  <Box
                                    sx={{ fontSize: '12px', fontWeight: '500' }}
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
                  <Typography
                    sx={{ mt: 5, textAlign: 'center', color: '#7C766F' }}
                  >
                    {t('ASSESSMENTS.NO_DATA_FOUND')}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </div>
        <FacilitatorDrawer
          secondary={t('COMMON.CANCEL')}
          primary={`${t('COURSE_PLANNER.MARK_AS_COMPLETED')} (${selectedCount})`}
          toggleDrawer={toggleDrawer}
          drawerState={drawerState}
          onPrimaryClick={() => {
            if (selectedSubtopics.length > 0) {
              // Mark all selected subtopics as complete
              markMultipleStatuses(userProjectDetails, selectedSubtopics);
              toggleDrawer(false)();
            }
          }}
          onSecondaryClick={() => {
            setSelectedSubtopics([]);
            toggleDrawer(false)();
          }}
          selectedCount={selectedCount}
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
      </Box>
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

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export default withAccessControl(
  'accessCoursePlannerDetails',
  accessControl
)(CoursePlannerDetail);
