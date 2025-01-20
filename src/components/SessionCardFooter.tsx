import { IResource } from '@/pages/curriculum-planner/center/[cohortId]';
import {
  fetchCourseIdFromSolution,
  getTargetedSolutions,
  getUserProjectDetails,
} from '@/services/CoursePlannerService';
import { editEvent } from '@/services/EventService';
import { fetchBulkContents } from '@/services/PlayerService';
import { convertUTCToIST, getBMG, getDayMonthYearFormat } from '@/utils/Helper';
import { EventStatus } from '@/utils/app.constant';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDirection } from '../hooks/useDirection';
import { CustomField, SessionCardFooterProps } from '../utils/Interfaces';
import CenterSessionModal from './CenterSessionModal';
import SelectTopic from './SelectTopic';
import { showToastMessage } from './Toastify';
import TopicDetails from './TopicDetails';
import { getCohortDetails } from '@/services/CohortServices';
import { usePathname } from 'next/navigation';

const SessionCardFooter: React.FC<SessionCardFooterProps> = ({
  item,
  cohortName,
  cohortId,
  isTopicSubTopicAdded,
  state,
  board,
  medium,
  grade,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const pathname = usePathname();
  const dashboard = pathname === '/dashboard';
  const [open, setOpen] = React.useState(false);
  const [editTopic, setEditTopic] = React.useState(false);
  // const [removeTopic, setRemoveTopic] = React.useState(false);
  const [topicList, setTopicList] = React.useState([]);
  const [transformedTasks, setTransformedTasks] = React.useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [learningResources, setLearningResources] = useState<any>();
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [eventStatus, setEventStatus] = React.useState('');
  const [CohortBMG, setCohortBMG] = React.useState<any>({});

  const EventDate = getDayMonthYearFormat(item?.startDateTime);
  let removeTopic = false;

  useEffect(() => {
    if (dashboard) {
      const classId = item?.metadata?.cohortId;
      const getCohortData = async () => {
        const response = await getCohortDetails(classId);

        let cohortData = null;

        if (response?.cohortData?.length) {
          cohortData = response?.cohortData[0];

          const bgm = getBMG(cohortData);
          if (bgm) {
            setCohortBMG(bgm);
          }
        }
      };
      if (classId) {
        getCohortData();
      }
    }
  }, [dashboard]);

  useEffect(() => {
    const fetchTopicSubtopic = async () => {
      try {
        if (
          // state &&
          medium &&
          grade &&
          board &&
          item?.metadata?.courseType &&
          item?.metadata?.subject
        ) {
          const response = await fetchTargetedSolutions();

          if (response?.result?.data == '') {
            setTopicList([]);
            return;
          }

          let courseData = response?.result?.data[0];
          let courseId = courseData._id;

          if (!courseId) {
            await fetchCourseIdFromSolution(
              courseData?.solutionId,
              cohortId as string
            );
            const response = await fetchTargetedSolutions();
            courseData = response?.result?.data[0];
            courseId = courseData._id;
          }

          const res = await getUserProjectDetails({
            id: courseId,
          });
          if (res?.result || res?.result.length > 0) {
            const tasks = res?.result?.tasks;
            const topics = tasks?.map((task: any) => ({
              id: task._id,
              name: task.name,
            }));
            setTopicList(topics);

            const subTopics = tasks?.reduce((acc: any[], task: any) => {
              const topicName = task?.name;
              const topicId = task?._id;
              const subtopicNames = task?.children.map(
                (child: any) => child?.name
              );

              acc.push({
                topicName: topicName,
                id: topicId,
                subtopics: subtopicNames,
              });

              return acc;
            }, []);

            setTransformedTasks(subTopics);
            const learningResources = tasks?.reduce((acc: any, task: any) => {
              acc[task.name] = task?.children.reduce(
                (subAcc: any, child: any) => {
                  subAcc[child?.name] = child?.learningResources?.map(
                    (resource: any) => ({
                      name: resource?.name,
                      link: resource?.link,
                      type: resource?.type || '',
                      id: resource?.id || '',
                      topic: task.name,
                      subtopic: child?.name,
                    })
                  );
                  return subAcc;
                },
                {}
              );
              return acc;
            }, {});
            const resources: IResource[] = extractResources(learningResources);
            const enrichedContent = await fetchLearningResources(resources);
            setLearningResources(enrichedContent);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTopicSubtopic();
  }, [item]);

  const extractResources = (learningResources: any): IResource[] => {
    const resources: IResource[] = [];

    Object.values(learningResources).forEach((childTasks: any) => {
      Object.values(childTasks).forEach((resourceArray: any) => {
        if (Array.isArray(resourceArray)) {
          resources.push(...resourceArray);
        }
      });
    });

    return resources;
  };

  const fetchLearningResources = async (resources: IResource[]) => {
    try {
      resources = resources.map((resource: IResource) => {
        return {
          ...resource,
          id: resource.id.toLowerCase(),
        };
      });
      const identifiers = resources?.map((resource: IResource) =>
        resource?.id?.toLowerCase()
      );
      const response = await fetchBulkContents(identifiers);

      resources = resources.map((resource: IResource) => {
        const content = response?.find(
          (content: any) => content?.identifier === resource?.id
        );
        return {
          ...resource,
          ...content,
          name: resource.name,
          topic: resource.topic,
          subtopic: resource.subtopic,
        };
      });

      // setResources(resources);
      return resources;
    } catch (error) {
      console.error('error', error);
    }
  };

  const handleComponentOpen = () => {
    setSelectedTopic(null);
    setSelectedSubtopics([]);
  };

  const fetchTargetedSolutions = async () => {
    const response = await getTargetedSolutions({
      // state: state,
      medium: dashboard ? CohortBMG?.medium : medium,
      class: dashboard ? CohortBMG?.grade : grade,
      board: dashboard ? CohortBMG?.board : board,
      courseType: item?.metadata?.courseType,
      subject: item?.metadata?.subject,
      entityId: cohortId,
    });
    return response;
  };

  const handleTopicSelection = (topic: any) => {
    setSelectedTopic(topic);
  };

  const handleSubtopicSelection = (subtopics: string[]) => {
    setSelectedSubtopics(subtopics);
  };

  const updateTopicSubtopic = async () => {
    try {
      let erMetaData;
      if (removeTopic) {
        erMetaData = {
          topic: null,
          subTopic: [],
        };
      } else {
        const selectedTopicNames = selectedTopic?.map(
          (topic: any) => topic.name
        );
        erMetaData = {
          topic: selectedTopicNames,
          subTopic: selectedSubtopics,
        };
      }

      let isMainEvent;
      if (item?.isRecurring === false && !item?.recurrencePattern['interval']) {
        isMainEvent = true;
      } else if (
        item?.isRecurring === true &&
        item?.recurrencePattern['interval']
      ) {
        isMainEvent = false;
      }
      const userId = localStorage.getItem('userId');
      const eventRepetitionId = item?.eventRepetitionId;
      if (isMainEvent !== undefined && userId && eventRepetitionId) {
        const apiBody = {
          isMainEvent: isMainEvent,
          updatedBy: userId,
          erMetaData: erMetaData,
        };
        const response = await editEvent(eventRepetitionId, apiBody);
        if (response) {
          if (erMetaData?.topic === undefined || erMetaData?.topic === null) {
            showToastMessage(
              t('CENTER_SESSION.TOPIC_SUBTOPIC_REMOVED_SUCCESSFULLY'),
              'success'
            );
            // setRemoveTopic(false);
            removeTopic = false;
          } else {
            showToastMessage(
              t('CENTER_SESSION.TOPIC_SUBTOPIC_ADDED_SUCCESSFULLY'),
              'success'
            );
            setEditTopic(false);
          }
          if (isTopicSubTopicAdded) {
            isTopicSubTopicAdded();
          }
        } else {
          showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        }
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenSelectTopic = () => {
    setOpen(true);
    setEditTopic(true);
  };

  const handleError = () => {
    if (eventStatus !== EventStatus.UPCOMING) {
      showToastMessage(
        t('CENTER_SESSION.CANT_SELECT_AS_EVENT_PASSED_LIVE'),
        'error'
      );
    } else if (!topicList || topicList?.length === 0) {
      showToastMessage(
        t('CENTER_SESSION.COURSE_PLANNER_NOT_AVAILABLE', {
          subject: item?.metadata?.subject,
        }),
        'error'
      );
    }
  };

  const handleRemovetTopicSubTopic = () => {
    // setRemoveTopic(true);
    removeTopic = true;
    updateTopicSubtopic();
  };

  const handleClick = () => {
    handleComponentOpen();
    if (
      topicList?.length >= 1 &&
      transformedTasks &&
      eventStatus === EventStatus.UPCOMING
    ) {
      handleOpen();
    } else {
      handleError();
    }
  };

  useEffect(() => {
    const startDateTime = convertUTCToIST(item?.startDateTime);
    const startDate = startDateTime.date;
    const startTime = startDateTime.time;
    setStartTime(startTime);
    setStartDate(startDate);

    const endDateTime = convertUTCToIST(item?.endDateTime);
    const endDate = endDateTime.date;
    const endTime = endDateTime.time;
    setEndTime(endTime);

    const currentTime = new Date();
    const eventStart = new Date(item?.startDateTime);
    const eventEnd = new Date(item?.endDateTime);

    if (currentTime < eventStart) {
      setEventStatus(EventStatus.UPCOMING);
    } else if (currentTime >= eventStart && currentTime <= eventEnd) {
      setEventStatus(EventStatus.LIVE);
    } else if (currentTime > eventEnd) {
      setEventStatus(EventStatus.PASSED);
    }
  }, [item]);

  return (
    <>
      {item?.erMetaData?.topic ? (
        <Box
          sx={{
            background: theme.palette.background.default,
            padding: '1px 16px',
            borderRadius: '8px',
          }}
        >
          <Accordion
            // defaultExpanded
            sx={{
              boxShadow: 'none',
              border: 'none',
              background: 'none',
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{ color: theme?.palette?.warning['300'] }}
                />
              }
              aria-controls="panel1-content"
              id="panel1-header"
              className="accordion-summary"
              sx={{
                px: 0,
                m: 0,
                '&.Mui-expanded': {
                  minHeight: '35px',
                },
              }}
            >
              <Typography fontWeight="500" fontSize="14px" className="text-7C">
                {t('COMMON.TO_BE_TAUGHT')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: '0px',
                // height: '117px',
                overflowY: 'auto',
              }}
            >
              <Box
                onClick={handleOpen}
                sx={{ display: 'flex', gap: '10px', cursor: 'pointer' }}
              >
                <MenuBookIcon
                  sx={{ color: theme.palette.secondary.main, fontSize: '18px' }}
                />
                <Typography color={theme.palette.secondary.main} variant="h5">
                  {item?.erMetaData?.topic?.join(', ')}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '5px',
                  marginLeft: '10px',
                  cursor: 'pointer',
                }}
                onClick={handleOpen}
              >
                <SubdirectoryArrowRightIcon
                  sx={{
                    color: theme.palette.secondary.main,
                    fontSize: '18px',
                    marginTop: '-4px',
                    marginLeft: '-5px',
                  }}
                />
                <Typography color={theme.palette.secondary.main} variant="h5">
                  {item?.erMetaData?.subTopic?.join(', ')}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            background: theme.palette.background.default,
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            alignItems: 'center',
          }}
          onClick={handleClick}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PriorityHighIcon
              sx={{ color: theme.palette.error.main, fontSize: '18px' }}
            />
            <Box
              fontSize={'14px'}
              fontWeight={500}
              color={theme.palette.secondary.main}
              ml={1}
              className="one-line-text"
            >
              {t('COMMON.SELECT_TOPIC')}
            </Box>
          </Box>
          <ArrowForwardIcon
            sx={{
              color: theme.palette.secondary.main,
              fontSize: '18px',
              transform: isRTL ? ' rotate(180deg)' : 'unset',
            }}
          />
        </Box>
      )}
      <CenterSessionModal
        open={open}
        handleClose={handleClose}
        title={item?.metadata?.framework?.subject || item?.metadata?.subject}
        center={cohortName}
        date={EventDate}
        primary={t('COMMON.SAVE')}
        handlePrimaryModel={updateTopicSubtopic}
      >
        {item?.erMetaData?.topic && !editTopic ? (
          <TopicDetails
            topic={item?.erMetaData?.topic}
            subTopic={item?.erMetaData?.subTopic}
            learningResources={learningResources}
            handleOpen={handleOpenSelectTopic}
            handleRemove={handleRemovetTopicSubTopic}
            eventStatus={eventStatus}
          />
        ) : (
          <SelectTopic
            topics={topicList}
            subTopicsList={transformedTasks}
            selectedTopics={selectedTopic}
            selectedSubTopics={selectedSubtopics}
            onTopicSelected={handleTopicSelection}
            onSubtopicSelected={handleSubtopicSelection}
          />
        )}
      </CenterSessionModal>
    </>
  );
};

export default SessionCardFooter;
