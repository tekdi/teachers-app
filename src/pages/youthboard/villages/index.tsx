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
  users,
  villageList,
  youthList,
} from '@/components/youthNet/tempConfigs';
import { UserList } from '@/components/youthNet/UserCard';
const index = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [value, setValue] = useState<number>(1);
  const [searchInput, setSearchInput] = useState('');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
              gap={'2rem'}
              // justifyContent={'space-around'}
            >
              <SearchBar
                onSearch={setSearchInput}
                value={searchInput}
                placeholder={t('DASHBOARD.SEARCH_VILLAGES')}
                fullWidth={false}
              />
              <SortBy />
            </Box>
            <Box>
              <YouthAndVolunteers
                selectOptions={[
                  { label: 'As of today, 5th Sep', value: 'today' },
                  { label: 'As of yesterday, 4th Sep', value: 'yesterday' },
                ]}
                // data="577 Youth & Volunteers"
              />
            </Box>
            <Typography
              sx={{
                fontSize: '16px',
                color: 'black',
                marginLeft: '1rem',
                padding: '5px 5px',
              }}
            >
              52 Villages
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                color: 'textSecondary',
                marginLeft: '2rem',
                cursor: 'pointer',
                padding: '5px 5px',
              }}
            >
              Village Name
            </Typography>
            <UserList users={villageList} />
            {/* </Grid> */}
          </>
        )}
      </Box>
      <Box>
        {value === 2 && (
          <>
            {/* <Grid
              px={'18px'}
              spacing={2}
              mt={1}
              sx={{ display: 'flex', alignItems: 'center' }}
              container
            > */}
            <UserList users={youthList} />
            {/* </Grid> */}
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
export default index;
