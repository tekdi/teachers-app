import { FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';

import Box from '@mui/material/Box';
import Header from '@/components/Header';
import InputAdornment from '@mui/material/InputAdornment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const manageUser = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();

  const [value, setValue] = React.useState(1);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Header />
      <Box sx={{ padding: '0 18px' }} className="mt--4">
        <Box
          textAlign={'left'}
          fontSize={'22px'}
          p={'18px 0'}
          color={theme?.palette?.warning['300']}
        >
          {t('COMMON.MANAGE_USERS')}
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit" // Use "inherit" to apply custom color
          aria-label="secondary tabs example"
          sx={{
            fontSize: '14px',
            borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,

            '& .MuiTab-root': {
              color: theme.palette.warning['A200'],
              padding: '0 20px',
            },
            '& .Mui-selected': {
              color: theme.palette.warning['A200'],
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
          <Tab value={1} label={t('COMMON.FACILITATORS')} />
        </Tabs>
      </Box>
      <Box>
        {value === 1 && (
          <>
            <Grid
              px={'18px'}
              spacing={2}
              mt={1}
              sx={{ display: 'flex', alignItems: 'center' }}
              container
            >
              <Grid item xs={8}>
                <Box>
                  <TextField
                    className="input_search"
                    placeholder={t('COMMON.SEARCH_FACILITATORS')}
                    color="secondary"
                    focused
                    sx={{
                      borderRadius: '100px',
                      height: '40px',
                      // width: '225px',
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={4} marginTop={'8px'}>
                <Box>
                  <FormControl className="drawer-select" sx={{ width: '100%' }}>
                    <Select
                      displayEmpty
                      style={{
                        borderRadius: '0.5rem',
                        color: theme.palette.warning['200'],
                        width: '100%',
                        marginBottom: '0rem',
                      }}
                    >
                      <MenuItem className="text-dark-grey fs-14 fw-500">
                        {t('COMMON.FILTERS')}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>

            <Box>
              <Box
                px={'18px'}
                mt={3}
                borderBottom={`1px solid ${theme.palette.warning['A100']}`}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '15px',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}
                  >
                    <Box>
                      <Box
                        sx={{
                          fontSize: '16px',
                          color: theme.palette.warning['300'],
                        }}
                      >
                        Aditi Patel
                      </Box>
                      <Box
                        sx={{
                          fontSize: '12px',
                          color: theme.palette.warning['300'],
                          fontWeight: '500',
                          marginTop: '2px',
                        }}
                      >
                        Nagpur, Bhivapur
                      </Box>
                      <Box
                        sx={{
                          fontSize: '12px',
                          fontWeight: '500',
                          padding: '4px',
                          color: theme.palette.success.contrastText,
                        }}
                      >
                        Bhiwapur, Jabarbodi, Kargaon,
                        <span style={{ color: theme.palette.warning['400'] }}>
                          and 3 more
                        </span>
                      </Box>
                    </Box>
                  </Box>
                  <MoreVertIcon
                    sx={{
                      fontSize: '24px',
                      color: theme.palette.warning['300'],
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </>
        )}
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
export default manageUser;
