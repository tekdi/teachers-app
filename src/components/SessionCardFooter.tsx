import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import CenterSessionModal from './CenterSessionModal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import React, { useEffect, useState } from 'react';
import SelectTopic from './SelectTopic';
import { SessionCardFooterProps } from '../utils/Interfaces';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import TopicDetails from './TopicDetails';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  getTargetedSolutions,
  getUserProjectDetails,
} from '@/services/CoursePlannerService';

const SessionCardFooter: React.FC<SessionCardFooterProps> = ({
  item,
  cohortName,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [topicList, setTopicList] = React.useState([]);
  const [transformedTasks, setTransformedTasks] = React.useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);

  useEffect(() => {
    const fetchTopicSubtopic = async () => {
      try {
        const response = await getTargetedSolutions({
          subject: 'Tamil',
          class: '4',
          state: 'Maharashtra',
          board: 'TQKR',
          type: 'mainCourse',
          medium: 'Telugu',
        });

        const courseData = response?.result?.data[0];
        let courseId = courseData._id;

        const res = await getUserProjectDetails({
          id: courseId,
        });
        const tasks = res?.result?.tasks;
        const topics = tasks?.map((task: any) => task?.name);
        setTopicList(topics);
        const subTopics = tasks.reduce((acc: any, task: any) => {
          acc[task.name] = task.children.map((child: any) => child.name);
          return acc;
        }, {});
        setTransformedTasks(subTopics);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTopicSubtopic();
  }, [item]);

  const updateTopicSubtopic = () => {
    console.log('updateTopicSubtopic');
  };
  const handleTopicSelection = (topic: string) => {
    setSelectedTopic(topic);
    console.log(topic);
  };

  const handleSubtopicSelection = (subtopics: string[]) => {
    setSelectedSubtopics(subtopics);
    console.log(subtopics);
  };

  return (
    <>
      {item?.topic ? (
        <Box
          sx={{
            background: theme.palette.background.default,
            padding: '1px 16px',
            borderRadius: '8px',
          }}
        >
          <Accordion
            //defaultExpanded
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
            <AccordionDetails sx={{ padding: '0px' }}>
              <Box
                onClick={handleOpen}
                sx={{ display: 'flex', gap: '10px', cursor: 'pointer' }}
              >
                <MenuBookIcon
                  sx={{ color: theme.palette.secondary.main, fontSize: '18px' }}
                />
                <Typography color={theme.palette.secondary.main} variant="h5">
                  {item?.topic}
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
                  {item?.subtopic}
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
          onClick={handleOpen}
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
            >
              {t('COMMON.SELECT_TOPIC')}
            </Box>
          </Box>
          <ArrowForwardIcon
            sx={{ color: theme.palette.secondary.main, fontSize: '18px' }}
          />
        </Box>
      )}
      <CenterSessionModal
        open={open}
        handleClose={handleClose}
        title={item?.metadata?.framework?.subject || item?.metadata?.subject}
        center={cohortName}
        date={'25 May, 2024'}
        primary={t('COMMON.SAVE')}
        handlePrimaryModel={updateTopicSubtopic}
      >
        {item?.topic ? (
          <TopicDetails />
        ) : (
          <SelectTopic
            topics={topicList}
            subTopicsList={transformedTasks}
            onTopicSelected={handleTopicSelection}
            onSubtopicSelected={handleSubtopicSelection}
          />
        )}
      </CenterSessionModal>
    </>
  );
};

export default SessionCardFooter;
