import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from '@mui/material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { EventStatus } from '@/utils/app.constant';
import { RequisiteType } from '../../app.config';
import NoDataFound from './common/NoDataFound';
import router from 'next/router';
import RequisitesAccordion from './RequisitesAccordion';
import { showToastMessage } from './Toastify';
interface TopicDetailsProps {
  topic: string;
  subTopic: [];
  learningResources: any;
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

  // const content: any = [];
  // if (learningResources?.[topic]) {
  //   const subTopics = learningResources[topic];
  //   subTopic?.forEach((currentSubTopic: string) => {
  //     if (subTopics[currentSubTopic]) {
  //       const resources = subTopics[currentSubTopic];
  //       resources?.forEach((resource: any) => {
  //         content.push(resource);
  //       });
  //     }
  //   });
  // }

  const openTopicModal = () => {
    handleOpen();
  };

  const onRemoveTopicSubtopic = () => {
    console.log('remove');
    handleRemove();
  };

  const handlePlayers = (identifier: string) => {
    sessionStorage.setItem('previousPage', window.location.href);
    if (identifier !== undefined && identifier !== '') {
      router.push(`/play/content/${identifier}`);
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
                {topic}
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
          content={learningResources}
          handlePlayers={handlePlayers}
          theme={theme}
          subTopic={subTopic}
        />
        <RequisitesAccordion
          title={t('CENTER_SESSION.PREREQUISITES')}
          type={RequisiteType.PRE_REQUISITES}
          content={learningResources}
          handlePlayers={handlePlayers}
          theme={theme}
          subTopic={subTopic}
        />
        <RequisitesAccordion
          title={t('CENTER_SESSION.POST_REQUISITES')}
          type={RequisiteType.POST_REQUISITES}
          content={learningResources}
          handlePlayers={handlePlayers}
          theme={theme}
          subTopic={subTopic}
        />
      </Box>
    </>
  );
};

export default TopicDetails;
