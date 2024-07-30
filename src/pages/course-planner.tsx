import Header from '@/components/Header';
import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useRouter } from 'next/router';

const CoursePlanner = () => {
  const [value, setValue] = React.useState(1);
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const router = useRouter();
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
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box minHeight={'100vh'}>
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
        width={'100%'}
      >
        <Typography textAlign={'left'} fontSize={'22px'}>
          {t('COURSE_PLANNER.COURSE_PLANNER')}
        </Typography>
      </Box>

      <Grid sx={{ display: 'flex', alignItems: 'center' }} container>
        <Grid item md={6} xs={12}>
          <Box sx={{ mt: 2, px: '20px' }}>
            <Box sx={{ flexBasis: '70%' }}>
              <FormControl className="drawer-select" sx={{ width: '100%' }}>
                <Select
                  className="SelectLanguages"
                  displayEmpty
                  style={{
                    borderRadius: '0.5rem',
                    color: theme.palette.warning['200'],
                    width: '100%',
                    marginBottom: '0rem',
                  }}
                >
                  <MenuItem className="text-truncate">
                    Khapari Dharmu (Chimur, Chandrap {/* will come from API */}
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Grid>
        <Grid item md={6} xs={12}>
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
                placeholder={t('COMMON.SEARCH_STUDENT') + '..'}
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

      <Box sx={{ mt: 2 }}>
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            aria-label="secondary tabs example"
            sx={{
              fontSize: '14px',
              borderBottom: `1px solid ${theme.palette.primary.contrastText}`,

              '& .MuiTab-root': {
                color: '#4D4639',
                padding: '0 20px',
              },
              '& .Mui-selected': {
                color: '#4D4639',
              },
              '& .MuiTabs-indicator': {
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '100px',
                height: '3px',
              },
              '& .MuiTabs-scroller': {
                overflowX: 'unset !important',
              },
            }}
          >
            <Tab value={1} label={t('COURSE_PLANNER.FOUNDATION_COURSE')} />
            <Tab value={2} label={t('COURSE_PLANNER.MAIN_COURSE')} />
          </Tabs>
        </Box>
        {value === 1 && (
          <Box sx={{ px: '16px', mt: 2 }}>
            <Box
              sx={{
                background: theme.palette.action.selected,
                padding: '14px',
                borderRadius: '8px',
              }}
            >
              <Box
                sx={{
                  border: `1px solid ${theme.palette.warning.A100}`,
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  router.push(`/course-planner-detail`); // Check route
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{ position: 'relative', display: 'inline-flex' }}
                      >
                        <Box sx={{ width: '40px', height: '40px' }}>
                          <CircularProgressbar
                            value={10}
                            strokeWidth={10}
                            styles={buildStyles({
                              pathColor: '#06A816',
                              trailColor: '#E6E6E6',
                              strokeLinecap: 'round',
                            })}
                          />
                        </Box>

                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            component="div"
                            sx={{
                              fontSize: '11px',
                              color: theme.palette.warning['300'],
                              fontWeight: '500',
                            }}
                          >
                            10%
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          fontSize: '16px',
                          color: theme.palette.warning['300'],
                        }}
                      >
                        Mathematics {/*  will come form API */}
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <KeyboardArrowRightIcon
                      sx={{ color: theme.palette.warning['300'] }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
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
export default CoursePlanner;
