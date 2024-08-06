import Header from '@/components/Header';
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import SearchIcon from '@mui/icons-material/Search';
const Assessments = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleScrollDown = () => {
    if (inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const scrollMargin = 20;
      const scrollY = window.scrollY;
      const targetY = inputRect.top + scrollY - scrollMargin;
      window.scrollTo({ top: targetY - 70, behavior: 'smooth' });
    }
  };
  return (
    <>
      <Box>
        <Header />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          color: '#4D4639',
          padding: '20px 20px 5px',
        }}
        width="100%"
      >
        <Typography textAlign="left" fontSize="22px">
          {t('ASSESSMENTS.ASSESSMENTS')}
        </Typography>
      </Box>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2, px: '20px' }}>
            <Paper
              component="form"
              className="100"
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '100px',
                background: theme.palette.warning.A700,
                boxShadow: 'none',
              }}
            >
              <InputBase
                ref={inputRef}
                sx={{ ml: 3, flex: 1, mb: '0', fontSize: '14px' }}
                placeholder="Search.."
                inputProps={{ 'aria-label': 'search student' }}
                onClick={handleScrollDown}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2, px: '20px' }}>
            <FormControl fullWidth>
              <InputLabel
                style={{
                  color: theme?.palette?.warning['A200'],
                  background: theme?.palette?.warning['A400'],
                  paddingLeft: '2px',
                  paddingRight: '2px',
                }}
                id="demo-simple-select-label"
              >
                {t('ASSESSMENTS.CENTER')}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={t('ASSESSMENTS.CENTER')}
                style={{ borderRadius: '4px' }}
              >
                {/* <MenuItem value={'Mathematics'}>Mathematics</MenuItem> */}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2, px: '20px' }}>
            <FormControl fullWidth>
              <InputLabel
                style={{
                  color: theme?.palette?.warning['A200'],
                  background: theme?.palette?.warning['A400'],
                  paddingLeft: '2px',
                  paddingRight: '2px',
                }}
                id="demo-simple-select-label"
              >
                {t('ASSESSMENTS.ASSESSMENT_TYPE')}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={t('ASSESSMENTS.ASSESSMENT_TYPE')}
                style={{ borderRadius: '4px' }}
              >
                {/* <MenuItem value={'Mathematics'}>Mathematics</MenuItem> */}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      <Box
        sx={{
          mt: 3,
          px: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>20/24 completed the assessment</Box>
        <Box>sort by</Box>
      </Box>

      <Box sx={{ background: '#FBF4E4', padding: '20px' }}>
        <Box>
          <Box
            sx={{
              border: ' 1px solid',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                flexBasis: '20%',
                background: '#FFDEA1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box>icon </Box>
            </Box>
            <Box sx={{ flexBasis: '80%' }}>
              <Box
                sx={{
                  px: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Box>shreyas shinde</Box>
                <Box>arrow</Box>
              </Box>
            </Box>
          </Box>
        </Box>
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

export default Assessments;
