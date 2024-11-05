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

  const content: any = [];
  if (learningResources?.[topic]) {
    const subTopics = learningResources[topic];
    subTopic?.forEach((currentSubTopic: string) => {
      if (subTopics[currentSubTopic]) {
        const resources = subTopics[currentSubTopic];
        resources?.forEach((resource: any) => {
          content.push(resource);
        });
      }
    });
  }

  const openTopicModal = () => {
    handleOpen();
  };

  const onRemoveTopicSubtopic = () => {
    console.log('remove');
    handleRemove();
  };

  const handlePlayers = (identifier: string) => {
    sessionStorage.setItem('previousPage', window.location.href);
    router.push(`/play/content/${identifier}`);
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
        {/* Facilitator's Requisite */}
        <Accordion
          defaultExpanded
          sx={{
            boxShadow: 'none !important',
            border: 'none !important',
            mt: 1.5,
            background: theme?.palette?.action?.selected,
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDropDownIcon
                sx={{ color: theme?.palette?.warning['300'] }}
              />
            }
            aria-controls="facilitator-content"
            id="facilitator-header"
            className="accordion-summary"
            sx={{
              m: 0,
              background: theme?.palette?.action?.selected,
              px: '16px',
              height: '10px !important',
              '&.Mui-expanded': {
                minHeight: '48px',
              },
            }}
          >
            <Typography
              fontWeight="500"
              fontSize="14px"
              sx={{ color: theme?.palette?.warning['300'] }}
            >
              {t('CENTER_SESSION.FACILITATOR_REQUISITES')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ padding: '0px', background: theme?.palette?.warning['A400'] }}
          >
            <Grid container spacing={2} sx={{ px: '16px !important' }}>
              {content.filter((item: any) => item.type === '').length > 0 ? (
                content
                  .filter((item: any) => item.type === '')
                  .map((item: any) => (
                    <Grid item xs={6} sx={{ mt: 2 }} key={item.name}>
                      <Box
                        className="facilitator-bg"
                        onClick={() => handlePlayers(item?.link)}
                      >
                        <Box
                          sx={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: theme?.palette?.warning['A400'],
                          }}
                        >
                          {item?.name || subTopic.join(', ')}
                        </Box>
                      </Box>
                    </Grid>
                  ))
              ) : (
                <NoDataFound />
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Learner Prerequisites */}
        <Accordion
          sx={{
            boxShadow: 'none !important',
            border: 'none !important',
            mt: 1.5,
            background: theme?.palette?.action?.selected,
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDropDownIcon
                sx={{ color: theme?.palette?.warning['300'] }}
              />
            }
            aria-controls="prerequisite-content"
            id="prerequisite-header"
            className="accordion-summary"
            sx={{
              m: 0,
              background: theme?.palette?.action?.selected,
              px: '16px',
              height: '10px !important',
              '&.Mui-expanded': {
                minHeight: '48px',
              },
            }}
          >
            <Typography
              fontWeight="500"
              fontSize="14px"
              sx={{ color: theme?.palette?.warning['300'] }}
            >
              {t('CENTER_SESSION.LEARNER_PREREQUISITES')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ padding: '0px', background: theme?.palette?.warning['A400'] }}
          >
            <Grid container spacing={2} sx={{ px: '16px !important' }}>
              {content.filter(
                (item: any) => item.type === RequisiteType.PRE_REQUISITES
              ).length > 0 ? (
                content
                  .filter(
                    (item: any) => item.type === RequisiteType.PRE_REQUISITES
                  )
                  .map((item: any) => (
                    <Grid item xs={6} sx={{ mt: 2 }} key={item.name}>
                      <Box
                        className="facilitator-bg"
                        onClick={() => handlePlayers(item?.link)}
                      >
                        <Box
                          sx={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: theme?.palette?.warning['A400'],
                          }}
                        >
                          {item?.name || subTopic.join(', ')}
                        </Box>
                      </Box>
                    </Grid>
                  ))
              ) : (
                <NoDataFound />
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Learner Postrequisites */}
        <Accordion
          sx={{
            boxShadow: 'none !important',
            border: 'none !important',
            mt: 1.5,
            background: theme?.palette?.action?.selected,
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDropDownIcon
                sx={{ color: theme?.palette?.warning['300'] }}
              />
            }
            aria-controls="postrequisite-content"
            id="postrequisite-header"
            className="accordion-summary"
            sx={{
              m: 0,
              background: theme?.palette?.action?.selected,
              px: '16px',
              height: '10px !important',
              '&.Mui-expanded': {
                minHeight: '48px',
              },
            }}
          >
            <Typography
              fontWeight="500"
              fontSize="14px"
              sx={{ color: theme?.palette?.warning['300'] }}
            >
              {t('CENTER_SESSION.LEARNER_POSTREQUISITES')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ padding: '0px', background: theme?.palette?.warning['A400'] }}
          >
            <Grid container spacing={2} sx={{ px: '16px !important' }}>
              {content.filter(
                (item: any) => item.type === RequisiteType.POST_REQUISITES
              ).length > 0 ? (
                content
                  .filter(
                    (item: any) => item.type === RequisiteType.POST_REQUISITES
                  )
                  .map((item: any) => (
                    <Grid item xs={6} sx={{ mt: 2 }} key={item.name}>
                      <Box
                        className="facilitator-bg"
                        onClick={() => handlePlayers(item?.link)}
                      >
                        <Box
                          sx={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: theme?.palette?.warning['A400'],
                          }}
                        >
                          {item?.name || subTopic.join(', ')}
                        </Box>
                      </Box>
                    </Grid>
                  ))
              ) : (
                <NoDataFound />
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};

export default TopicDetails;
