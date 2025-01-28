import Header from '@/components/Header';
import BackHeader from '@/components/youthNet/BackHeader';
import { Box, Grid, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import SearchBar from '@/components/Searchbar';
import SortBy from '@/components/youthNet/SortBy';
import YouthAndVolunteers from '@/components/youthNet/YouthAndVolunteers';
import {
  DROPDOWN_NAME,
  users,
  VILLAGE_OPTIONS,
  villageList,
  youthList,
} from '@/components/youthNet/tempConfigs';
import { UserList } from '@/components/youthNet/UserCard';
import DownloadIcon from '@mui/icons-material/Download';
import withRole from '@/components/withRole';
import { TENANT_DATA } from '../../../../app.config';
import Dropdown from '@/components/youthNet/DropDown';
import { useRouter } from 'next/router';

const index = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const [value, setValue] = useState<number>(1);
  const [searchInput, setSearchInput] = useState('');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleUserClick = (name: any) => {
    console.log('Clicked user:', name);
    router.push(`/youthboard/student/${name}`);
  };

  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
      <Box ml={2}>
        <BackHeader headingOne={t('DASHBOARD.VILLAGES_AND_YOUTH')} />
      </Box>
      <Box sx={{ width: '100%' }}>
        {value && (
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit" // Use "inherit" to apply custom color
            aria-label="secondary tabs example"
            sx={{
              fontSize: '14px',
              borderBottom: (theme) => `1px solid #EBE1D4`,

              '& .MuiTab-root': {
                color: theme.palette.warning['A200'],
                padding: '0 20px',
                flexGrow: 1,
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
            <Tab value={1} label={t('DASHBOARD.VILLAGES')} />
            <Tab value={2} label={t('DASHBOARD.YOUTH_VOLUNTEERS')} />
          </Tabs>
        )}
      </Box>

      <Box>
        {value === 1 && (
          <>
            {/* <Grid
              px={'18px'}
              spacing={2}
              mt={1}
              sx={{ display: 'flex', alignItems: 'center' }}
              container
            > */}
            <Box
              display={'flex'}
              flexDirection={'row'}
              sx={{
                pr: '20px',
              }}
              // justifyContent={'space-around'}
            >
              <SearchBar
                onSearch={setSearchInput}
                value={searchInput}
                placeholder={t('DASHBOARD.SEARCH_VILLAGES')}
                fullWidth={true}
              />
              <SortBy />
            </Box>
            <Box>
              <YouthAndVolunteers
                selectOptions={[
                  { label: 'As of today, 5th Sep', value: 'today' },
                  { label: 'As of yesterday, 4th Sep', value: 'yesterday' },
                ]}
              />
            </Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  fontSize: '16px',
                  color: 'black',
                  marginLeft: '2rem',
                }}
              >
                52 Villages
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  pr: '20px',
                  color: '#0D599E',
                  '&:hover': {
                    color: '#074d82',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '16px',
                  }}
                >
                  CSV
                </Typography>
                <DownloadIcon />
              </Box>
            </Box>
            <Box display={'flex'} mt={2} justifyContent={'space-between'}>
              <Typography
                sx={{
                  fontSize: '16px',
                  color: 'textSecondary',
                  marginLeft: '2rem',
                  cursor: 'pointer',
                  pr: '20px',
                }}
                className="one-line-text"
              >
                Village Name
              </Typography>

              <Typography
                sx={{
                  fontSize: '16px',
                  color: 'textSecondary',
                  cursor: 'pointer',
                  pr: '20px',
                }}
              >
                Total Count (+ New Registrations today)
              </Typography>
            </Box>
            <Box
              sx={{
                pr: '20px',
                mt: '15px',
              }}
            >
              <UserList layout="list" users={villageList} />
            </Box>
          </>
        )}
      </Box>
      <Box>
        {value === 2 && (
          <>
            <Box
              sx={{
                px: '20px',
                mt: '15px',
              }}
            >
              <Dropdown
                name={DROPDOWN_NAME}
                values={VILLAGE_OPTIONS}
                onSelect={(value) => console.log('Selected:', value)}
              />
            </Box>
            <Box
              display={'flex'}
              flexDirection={'row'}
              sx={{
                pr: '20px',
              }}
              // justifyContent={'space-around'}
            >
              <SearchBar
                onSearch={setSearchInput}
                value={searchInput}
                placeholder={t('DASHBOARD.SEARCH_VILLAGES')}
                fullWidth={true}
              />
              <SortBy />
            </Box>
            <Box
              sx={{
                px: '20px',
                mt: '15px',
              }}
            >
              <UserList
                layout="list"
                users={youthList}
                onUserClick={handleUserClick}
              />
            </Box>
          </>
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

export default withRole(TENANT_DATA.YOUTHNET)(index);
