import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import React from 'react';
import CoursePlannerCards from './CoursePlannerCards';

interface CourseAccordionProps {
  title: any;
  type: string;
  resources: any;
  expanded: boolean;
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void;
}

const CourseAccordion: React.FC<CourseAccordionProps> = ({
  title,
  type,
  resources,
  expanded,
  onChange,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();



  
  return (
    <Box sx={{ mt: 2, mb: 1.5 }}>
      <Accordion
        defaultExpanded
        sx={{
          boxShadow: 'none !important',
          border: 'none !important',
          mt: 1.5,
          background: theme?.palette?.action?.selected,
          '&.MuiAccordion-root': {
            marginTop: 0,
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ArrowDropDownIcon sx={{ color: theme?.palette?.warning['300'] }} />
          }
          aria-controls="panel-content"
          id="panel-header"
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
          <Box sx={{display:'flex' , gap:'5px', alignItems:'center'}}>
            <Typography
              fontWeight="500"
              fontSize="14px"
              sx={{ color: theme?.palette?.warning['300'] }}
            >
              {title}
            </Typography>
            <Box
              fontWeight="600"
              fontSize="14px"
              sx={{ color: theme?.palette?.success?.main }}
            >
              {resources?.length > 0 && `( ${resources?.length} )`}
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: '0px',
            background: theme?.palette?.warning['A400'],
          }}
        >
          <CoursePlannerCards resources={resources} type={type} />

          {resources?.length === 0 && (
            <Typography sx={{ p: '10px', mt: 2, fontSize: '12px' }}>
              {t('COURSE_PLANNER.NO_RESOURCES_FOUND')}
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CourseAccordion;
