import Header from '@/components/Header';
import BackHeader from '@/components/youthNet/BackHeader';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import SearchBar from '@/components/Searchbar';
import SortBy from '@/components/youthNet/SortBy';
import YouthAndVolunteers from '@/components/youthNet/YouthAndVolunteers';
import {
  DROPDOWN_NAME,
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
import BottomDrawer from '@/components/youthNet/BottomDrawer';
import Loader from '@/components/Loader';
import {
  fetchBlockData,
  fetchDistrictData,
} from '@/services/youthNet/Dashboard/VillageServices';

interface FilterSectionProps {
  districtData: { DISTRICT_NAME: string; DISTRICT_OPTIONS: string[] } | null;
  blockData: { BLOCK_NAME: string; BLOCK_OPTIONS: string[] } | null;
}

const FilterSection = ({ districtData, blockData }: FilterSectionProps) => (
  <Box display={'flex'} flexDirection={'row'} sx={{ p: '20px' }}>
    <Box sx={{ width: '50%', mr: '20px' }}>
      {districtData ? (
        <Dropdown
          name={districtData?.DISTRICT_NAME}
          values={districtData?.DISTRICT_OPTIONS}
          defaultValue={districtData?.DISTRICT_OPTIONS[0]}
          onSelect={(value) => console.log('Selected:', value)}
        />
      ) : (
        <Loader showBackdrop />
      )}
    </Box>
    <Box sx={{ width: '50%' }}>
      {blockData ? (
        <Dropdown
          name={blockData?.BLOCK_NAME}
          values={blockData?.BLOCK_OPTIONS}
          defaultValue={blockData?.BLOCK_OPTIONS[0]}
          onSelect={(value) => console.log('Selected:', value)}
        />
      ) : (
        <Loader showBackdrop />
      )}
    </Box>
  </Box>
);

const Index = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [value, setValue] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [toggledUser, setToggledUser] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [districtData, setDistrictData] = useState(null);
  const [blockData, setBlockData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setDistrictData(await fetchDistrictData());
      setBlockData(await fetchBlockData());
    };
    getData();
  }, []);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) =>
    setValue(newValue);

  const handleUserClick = (name: string) =>
    router.push(`/youthboard/volunteer-profile/${name}`);

  interface HandleToggledUserClick {
    (name: string): void;
  }

  const handleToggledUserClick: HandleToggledUserClick = (name) => {
    setToggledUser(name);
    setOpenDrawer((prev) => !prev);
  };

  return (
    <Box minHeight="100vh">
      <Header />
      <Box ml={2}>
        <BackHeader headingOne={t('DASHBOARD.VILLAGES_AND_YOUTH')} />
      </Box>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="inherit"
        sx={{ borderBottom: `1px solid #EBE1D4` }}
      >
        <Tab value={1} label={t('DASHBOARD.VILLAGES')} />
        <Tab value={2} label={t('DASHBOARD.YOUTH_VOLUNTEERS')} />
      </Tabs>
      {TENANT_DATA.LEADER && (
        <FilterSection districtData={districtData} blockData={blockData} />
      )}
      {value === 1 ? (
        <Box>
          <Box display="flex" flexDirection="row" pr={2}>
            <SearchBar
              onSearch={setSearchInput}
              value={searchInput}
              placeholder={t('DASHBOARD.SEARCH_VILLAGES')}
              fullWidth
            />
            <SortBy />
          </Box>
          <YouthAndVolunteers
            selectOptions={[
              { label: 'As of today, 5th Sep', value: 'today' },
              { label: 'As of yesterday, 4th Sep', value: 'yesterday' },
            ]}
          />
          <Box display="flex" justifyContent="space-between">
            <Typography sx={{ fontSize: '16px', color: 'black', ml: 2 }}>
              52 Villages
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                pr: 2,
                color: '#0D599E',
                '&:hover': { color: '#074d82' },
              }}
            >
              <Typography sx={{ fontSize: '16px' }}>CSV</Typography>
              <DownloadIcon />
            </Box>
          </Box>
          <UserList layout="list" users={villageList} />
        </Box>
      ) : (
        <Box px={2}>
          <Dropdown
            name={DROPDOWN_NAME}
            values={VILLAGE_OPTIONS}
            defaultValue={VILLAGE_OPTIONS[0]}
            onSelect={(value) => console.log('Selected:', value)}
          />
          <Box display="flex" flexDirection="row" pr={2}>
            <SearchBar
              onSearch={setSearchInput}
              value={searchInput}
              placeholder={t('DASHBOARD.SEARCH_VILLAGES')}
              fullWidth
            />
            <SortBy />
          </Box>
          <UserList
            layout="list"
            users={youthList}
            onUserClick={handleUserClick}
            onToggleUserClick={handleToggledUserClick}
          />
          <BottomDrawer
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            title={toggledUser}
            buttonLabel={t('YOUTHNET_PROFILE.MARK_AS_VOLUNTEER')}
            onAction={() => setOpenDrawer(false)}
          />
        </Box>
      )}
    </Box>
  );
};

export async function getStaticProps({ locale }: any) {
  return { props: { ...(await serverSideTranslations(locale, ['common'])) } };
}

export default withRole(TENANT_DATA.YOUTHNET)(Index);
