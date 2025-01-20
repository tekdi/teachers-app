import { Box } from '@mui/material';

import { EventStatus } from '@/utils/app.constant';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { RequisiteType } from '../../app.config';
import RequisitesAccordion from './RequisitesAccordion';
import { showToastMessage } from './Toastify';

interface LearningResource {
  topic: string;
  subtopic: string;
  [key: string]: any;
}
interface TopicDetailsProps {
  topic: string[];
  subTopic: string[];
  learningResources: LearningResource[];
  handleOpen: any;
  handleRemove: any;
  eventStatus?: string;
}

const TopicDetails: React.FC<TopicDetailsProps> = ({
  topic,
  subTopic,
  learningResources,
  handleOpen,
  handleRemove,
  eventStatus,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const [contentData, setContentData] = useState<LearningResource[]>([]);

  useEffect(() => {
    const content = learningResources?.filter((resource: any) => {
      return (
        topic.includes(resource.topic) && subTopic.includes(resource.subtopic)
      );
    });
    if (content) {
      setContentData(content);
    }
  }, [learningResources]);

  const openTopicModal = () => {
    handleOpen();
  };

  const onRemoveTopicSubtopic = () => {
    handleRemove();
  };

  const filterByIdentifier = (contentData: any[], identifier: string) => {
    return contentData.filter((item) => item.identifier === identifier);
  };

  const handlePlayers = (identifier: string) => {
    sessionStorage.setItem('previousPage', window.location.href);
    if (identifier !== undefined && identifier !== '') {
      const filteredData = filterByIdentifier(contentData, identifier);
      if (filteredData && filteredData.length > 0) {
        if (
          filteredData[0]?.identifier !== undefined ||
          filteredData[0]?.identifier !== ''
        ) {
          if (filteredData[0].resourceType === 'Course') {
            router.push(`/course-hierarchy/${filteredData[0].identifier}`);
          } else {
            router.push(
              `/play/content/${filteredData?.[0].identifier.toLowerCase()}`
            );
          }
        }
      } else {
        showToastMessage(t('CENTER_SESSION.IDENTIFIER_NOT_FOUND'), 'error');
      }
    } else {
      showToastMessage(t('CENTER_SESSION.IDENTIFIER_NOT_FOUND'), 'error');
    }
  };

  return (
    <>
      <Box sx={{ padding: '8px 16px' }}>
        <Box
          sx={{
            background: theme?.palette?.action?.selected,
            borderRadius: '16px',
            padding: '16px 8px',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Box
                sx={{ fontSize: '12px', color: '#969088', fontWeight: '600' }}
              >
                {t('CENTER_SESSION.TOPIC')}
              </Box>
              <Box
                sx={{ fontSize: '16px', fontWeight: '400', color: '#4D4639' }}
              >
                {topic?.join(', ')}
              </Box>
            </Box>
            {eventStatus === EventStatus.UPCOMING && (
              <CreateOutlinedIcon
                sx={{ fontSize: '18px', color: '#0D599E', cursor: 'pointer' }}
                onClick={openTopicModal}
              />
            )}
          </Box>

          <Box
            sx={{
              fontSize: '12px',
              color: '#969088',
              fontWeight: '600',
              mt: '8px',
            }}
          >
            {t('CENTER_SESSION.SUBTOPIC')}
          </Box>
          <Box sx={{ fontSize: '16px', fontWeight: '400', color: '#4D4639' }}>
            {subTopic?.join(', ')}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '5px',
            mt: 2,
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              fontSize: '14px',
              color:
                eventStatus === EventStatus.UPCOMING
                  ? theme?.palette?.secondary.main
                  : theme?.palette?.grey[500],
              fontWeight: '500',
              cursor:
                eventStatus === EventStatus.UPCOMING
                  ? 'pointer'
                  : 'not-allowed',
              pointerEvents:
                eventStatus === EventStatus.UPCOMING ? 'auto' : 'none',
            }}
            onClick={
              eventStatus === EventStatus.UPCOMING
                ? onRemoveTopicSubtopic
                : undefined
            }
          >
            {t('CENTER_SESSION.REMOVE_TOPIC_SUBTOPIC')}
          </Box>
          <DeleteOutlineIcon
            sx={{
              fontSize: '18px',
              color: theme?.palette?.error.main,
            }}
          />
        </Box>
      </Box>
      <Box sx={{ mb: 1.5 }}>
        <RequisitesAccordion
          title={t('CENTER_SESSION.FACILITATOR_REQUISITES')}
          type={RequisiteType.FACILITATOR_REQUISITE}
          content={contentData}
          handlePlayers={handlePlayers}
          theme={theme}
          subTopic={subTopic}
        />
        <RequisitesAccordion
          title={t('CENTER_SESSION.PREREQUISITES')}
          type={RequisiteType.PRE_REQUISITES}
          content={contentData}
          handlePlayers={handlePlayers}
          theme={theme}
          subTopic={subTopic}
        />
        <RequisitesAccordion
          title={t('CENTER_SESSION.POST_REQUISITES')}
          type={RequisiteType.POST_REQUISITES}
          content={contentData}
          handlePlayers={handlePlayers}
          theme={theme}
          subTopic={subTopic}
        />
      </Box>
    </>
  );
};

export default TopicDetails;
