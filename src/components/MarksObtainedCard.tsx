import React, { useState } from 'react';
import {
  Box,
  BoxProps,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import { MarksObtainedCardProps } from '@/utils/Interfaces';
import { useTheme, Theme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTranslation } from 'next-i18next';
interface SmallCardProps {
  item: {
    question: string;
    mark_obtained: number;
    totalMarks: number;
  };
}

const SmallCard: React.FC<SmallCardProps> = ({ item }) => {
  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ borderRadius: '8px' }}>
      <Typography
        mt={1}
        fontSize={'12px'}
        fontWeight={500}
        lineHeight={'16px'}
        textAlign={'center'}
      >
        {item.question}
      </Typography>
      <Typography
        //   variant="h6"
        fontSize={'11px'}
        textAlign={'center'}
        color={
          item.mark_obtained > 0
            ? theme.palette.success.main
            : theme.palette.error.main
        }
      >{`${item.mark_obtained}/${item.totalMarks}`}</Typography>
    </Card>
  );
};

const MarksObtainedCard: React.FC<MarksObtainedCardProps> = ({ data }) => {
  const [showAllData, setShowAllData] = useState(false);
  const { t } = useTranslation();

  const limitedData = showAllData ? data : data?.slice(0, 12);

  return (
    <div>
      <Grid container spacing={1}>
        {data &&
          limitedData?.map((item, i) => (
            <Grid key={i} item xs={2}>
              <SmallCard item={item} />
            </Grid>
          ))}
      </Grid>
      {data?.length > 12 && (
        <Box display="flex" justifyContent="center" mt={2}>
          {!showAllData ? (
            <>
              <Button onClick={() => setShowAllData(true)}>
                {t('PROFILE.VIEW_MORE')}
                <KeyboardArrowDownIcon fontSize="small" />
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setShowAllData(false)}>
                {t('PROFILE.VIEW_LESS')}{' '}
                <KeyboardArrowDownIcon fontSize="small" />
              </Button>
            </>
          )}
        </Box>
      )}
    </div>
  );
};

export default MarksObtainedCard;
