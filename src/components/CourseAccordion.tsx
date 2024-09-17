import React from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme } from '@mui/material/styles';
import CoursePlannerCards from './CoursePlannerCards';

interface CourseAccordionProps {
  title: any;
  type: string;
  resources: any; 
}

const CourseAccordion: React.FC<CourseAccordionProps> = ({ title, type, resources }) => {
  const theme = useTheme<any>();

  return (
    <Box sx={{ mt: 2, mb: 1.5 }}>
      <Accordion
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
          <Typography
            fontWeight="500"
            fontSize="14px"
            sx={{ color: theme?.palette?.warning['300'] }}
          >
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: '0px',
            background: theme?.palette?.warning['A400'],
          }}
        >
          <CoursePlannerCards resources={resources} type={type} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CourseAccordion;
