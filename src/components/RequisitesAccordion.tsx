import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NoDataFound from './common/NoDataFound';
import ContentCard from './ContentCard';

interface RequisitesAccordionProps {
  title: string;
  type: string;
  content: any[];
  handlePlayers: (id: string) => void;
  theme: any;
  subTopic: string[];
}

const RequisitesAccordion: React.FC<RequisitesAccordionProps> = ({
  title,
  type,
  content,
  handlePlayers,
  theme,
  subTopic,
}) => {
  return (
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
          <ArrowDropDownIcon sx={{ color: theme?.palette?.warning['300'] }} />
        }
        aria-controls={`${type}-content`}
        id={`${type}-header`}
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
        sx={{ padding: '0px', background: theme?.palette?.warning['A400'] }}
      >
        <Grid container spacing={2} sx={{ px: '16px !important' }}>
          {content.filter((item) => item.type === type).length > 0 ? (
            content
              .filter((item) => item.type === type)
              .map((item) => (
                <Grid item xs={6} sx={{ mt: 2 }} key={item.name}>
                  {/* <Box
                    className="facilitator-bg"
                    sx={{
                      backgroundImage: `url(${item?.appIcon ? item.appIcon : '/decorationBg.png'})`,
                      position: 'relative',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      // backgroundSize: 'contain',
                    }}
                    onClick={() => handlePlayers(item?.id)}
                  >
                    <Box
                      sx={{
                        fontSize: '16px',
                        fontWeight: '500',
                        // color: theme?.palette?.warning['A400'],
                      }}
                    >
                      {item?.name || subTopic.join(', ')}
                    </Box>
                  </Box> */}

                  <ContentCard name={item?.name} subTopic={subTopic}/>
                </Grid>
              ))
          ) : (
            <NoDataFound />
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default RequisitesAccordion;
