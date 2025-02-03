import Header from '@/components/Header';
import BackHeader from '@/components/youthNet/BackHeader';
import {
  Box,
  Button,
  Divider,
  Grid,
  Radio,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect, useState } from 'react';
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
  mentorList,
  YOUTHNET_USER_ROLE,
  reAssignVillages,
  SURVEY_DATA,
} from '@/components/youthNet/tempConfigs';
import { UserList } from '@/components/youthNet/UserCard';
import DownloadIcon from '@mui/icons-material/Download';
import withRole from '@/components/withRole';
import { BOTTOM_DRAWER_CONSTANTS, TENANT_DATA } from '../../../../app.config';
import Dropdown from '@/components/youthNet/DropDown';
import { useRouter } from 'next/router';
import BottomDrawer from '@/components/youthNet/BottomDrawer';
import Loader from '@/components/Loader';
import {
  fetchBlockData,
  fetchDistrictData,
} from '@/services/youthNet/Dashboard/VillageServices';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AddIcon from '@mui/icons-material/Add';
import SimpleModal from '@/components/SimpleModal';
import Surveys from '@/components/youthNet/Surveys';
import { useDirection } from '@/hooks/useDirection';
import GenericForm from '@/components/youthNet/GenericForm';
import ExamplePage from '@/components/youthNet/BlockItem';
import VillageSelector from '@/components/youthNet/VillageSelector';

const Index = () => {
  const { isRTL } = useDirection();
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const [value, setValue] = useState<number>(1);
  const [searchInput, setSearchInput] = useState('');
  const [toggledUser, setToggledUser] = useState('');
  const [openMentorDrawer, setOpenMentorDrawer] = useState(false);

  const [toggledMentor, setToggledMentor] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);

  const [openReassignDistrict, setOpenReassignDistrict] = useState(false);
  const [openReassignVillage, setOpenReassignVillage] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [count, setCount] = useState(0);

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [districtData, setDistrictData] = useState<any>(null);
  const [blockData, setBlockData] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const districtData = await fetchDistrictData();
      const blockData = await fetchBlockData();
      setDistrictData(districtData);
      setBlockData(blockData);
    };

    getData();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleUserClick = (name: any) => {
    console.log('Clicked user:', name);
    router.push(`/youthboard/volunteer-profile/${name}`);
  };

  const handleToggledUserClick = (name: any) => {
    console.log('Toggled user:', name);
    setToggledUser(name);
    setOpenDrawer((prev) => !prev);
  };

  const handleToggledMentorClick = (name: any) => {
    console.log('Toggled user:', name);
    setToggledMentor(name);
    setOpenMentorDrawer((prev) => !prev);
  };
  const handleToggleClose = () => {
    setOpenDrawer(false);
    setOpenMentorDrawer(false);
  };

  const onClose = () => {
    setOpenDelete(false);
    setOpenReassignDistrict(false);
    setOpenReassignVillage(false);
    setAddNew(false);
    setCount(0)
  };

  const handleButtonClick = (actionType: string) => {
    console.log(actionType);

    switch (actionType) {
      case BOTTOM_DRAWER_CONSTANTS.MARK_VOLUNTEER:
        setOpenDrawer(false);
        break;

      case BOTTOM_DRAWER_CONSTANTS.ADD_REASSIGN:
        setOpenMentorDrawer(false);
        setOpenReassignVillage(true);
        break;

      case BOTTOM_DRAWER_CONSTANTS.REQUEST_REASSIGN:
        setOpenMentorDrawer(false);
        setOpenReassignDistrict(true);
        break;

      case BOTTOM_DRAWER_CONSTANTS.DELETE:
        setOpenMentorDrawer(false);
        setOpenDelete(true);
        break;

      default:
        console.warn(BOTTOM_DRAWER_CONSTANTS.UNKNOWN_ACTION, actionType);
    }
  };

  const buttons = [
    {
      label: t('YOUTHNET_USERS_AND_VILLAGES.MARK_AS_VOLUNTEER'),
      icon: <SwapHorizIcon />,
      onClick: () => handleButtonClick(BOTTOM_DRAWER_CONSTANTS.MARK_VOLUNTEER),
    },
  ];

  const mentorActions = [
    {
      label: t('YOUTHNET_USERS_AND_VILLAGES.ADD_OR_REASSIGN_VILLAGES'),
      action: BOTTOM_DRAWER_CONSTANTS.ADD_REASSIGN,
    },
    {
      label: t('YOUTHNET_USERS_AND_VILLAGES.REQUEST_TO_REASSIGN_DISTRICT'),
      action: BOTTOM_DRAWER_CONSTANTS.REQUEST_REASSIGN,
    },
    {
      label: t('YOUTHNET_USERS_AND_VILLAGES.DELETE_USER_PERMANENTLY'),
      action: BOTTOM_DRAWER_CONSTANTS.DELETE,
    },
  ];

  const Mentorbuttons = mentorActions.map(({ label, action }) => ({
    label,
    icon: <SwapHorizIcon />,
    onClick: () => handleButtonClick(action),
  }));

  const reasons = [
    { value: 'Incorrect Data Entry', label: t('COMMON.INCORRECT_DATA_ENTRY') },
    { value: 'Duplicated User', label: t('COMMON.DUPLICATED_USER') },
    { value: 'Resignation', label: t('COMMON.RESIGNATION') },
  ];

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

  const formFields = [
    { type: 'text', label: 'Full Name' },
    { type: 'number', label: 'Contact Number' },
    {
      type: 'radio',
      label: 'Gender',
      options: [
        { value: 'female', label: 'Female' },
        { value: 'male', label: 'Male' },
      ],
    },
    { type: 'number', label: 'Age' },
    { type: 'email', label: "Mentor's Email ID" },
  ];

  const handleOpenNew = () => {
    setAddNew(true);
  };

  const handleNext = () => {
    // setCount(count + 1)
    setCount((prev) => prev + 1);
  };
  console.log('count', count);

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
            textColor="inherit"
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
            {YOUTHNET_USER_ROLE.MENTOR_LEAD === TENANT_DATA.LEADER && (
              <Tab value={1} label={t('YOUTHNET_USERS_AND_VILLAGES.MENTORS')} />
            )}

            <Tab value={2} label={t('DASHBOARD.VILLAGES')} />
            <Tab value={3} label={t('DASHBOARD.YOUTH_VOLUNTEERS')} />
          </Tabs>
        )}
      </Box>

      <Box>
        {value === 1 && (
          <>
            <Box
              display={'flex'}
              flexDirection={'row'}
              sx={{
                p: '20px',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  mr: '20px',
                }}
              >
                {districtData ? (
                  <Dropdown
                    name={districtData?.DISTRICT_NAME}
                    values={districtData?.DISTRICT_OPTIONS}
                    defaultValue={districtData?.DISTRICT_OPTIONS[0]}
                    onSelect={(value) => console.log('Selected:', value)}
                  />
                ) : (
                  <Loader showBackdrop={true} />
                )}
              </Box>
            </Box>

            <Box
              display={'flex'}
              flexDirection={'row'}
              sx={{
                pr: '20px',
              }}
            >
              <SearchBar
                onSearch={setSearchInput}
                value={searchInput}
                placeholder={t('YOUTHNET_USERS_AND_VILLAGES.SEARCH_MENTORS')}
                fullWidth={true}
              />
              <SortBy />
            </Box>

            <Box mt={'18px'} px={'18px'} ml={'10px'}>
              <Button
                sx={{
                  border: `1px solid ${theme.palette.error.contrastText}`,
                  borderRadius: '100px',
                  height: '40px',
                  width: '8rem',
                  color: theme.palette.error.contrastText,
                  '& .MuiButton-endIcon': {
                    marginLeft: isRTL ? '0px !important' : '8px !important',
                    marginRight: isRTL ? '8px !important' : '-2px !important',
                  },
                }}
                className="text-1E"
                // onClick={handleOpenAddFaciModal}
                endIcon={<AddIcon />}
                onClick={handleOpenNew}
              >
                {t('COMMON.ADD_NEW')}
              </Button>
            </Box>

            <Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography
                  sx={{
                    fontSize: '16px',
                    color: 'black',
                    margin: '20px',
                  }}
                >
                  {SURVEY_DATA.FOUR} {''}
                  {t('YOUTHNET_USERS_AND_VILLAGES.MENTORS')}
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
                    {t('YOUTHNET_USERS_AND_VILLAGES.CSV')}
                  </Typography>
                  <DownloadIcon />
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                px: '20px',
              }}
            >
              <UserList
                layout="list"
                users={mentorList}
                onUserClick={handleUserClick}
                onToggleUserClick={handleToggledMentorClick}
              />
            </Box>
            <BottomDrawer
              open={openMentorDrawer}
              onClose={handleToggleClose}
              title={toggledMentor}
              buttons={Mentorbuttons}
            />
            <SimpleModal
              open={openReassignVillage}
              onClose={onClose}
              showFooter={true}
              modalTitle={t(
                'YOUTHNET_USERS_AND_VILLAGES.ADD_OR_REASSIGN_VILLAGES'
              )}
              primaryText={t('YOUTHNET_USERS_AND_VILLAGES.SAVE_PROGRESS')}
              secondaryText={t('YOUTHNET_USERS_AND_VILLAGES.FINISH_ASSIGN')}

              //pass function handler as props
            >
              <Box>
                <Box mt={2}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: theme.palette.warning['300'],
                    }}
                  >
                    {t(
                      'YOUTHNET_USERS_AND_VILLAGES.ASSIGN_VILLAGES_FROM_BLOCK'
                    )}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: theme.palette.warning['300'],
                      marginTop: '10px',
                    }}
                  >
                    {t(
                      'YOUTHNET_USERS_AND_VILLAGES.ASSIGN_VILLAGES_FROM_BLOCK_INFO'
                    )}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={2} p={2}>
                  {reAssignVillages?.map((survey, index) => (
                    <Surveys
                      key={index}
                      title={survey.title}
                      date={survey.date}
                    />
                  ))}
                </Box>
              </Box>
            </SimpleModal>
            <SimpleModal
              open={openReassignDistrict}
              onClose={onClose}
              showFooter={true}
              modalTitle={t(
                'YOUTHNET_USERS_AND_VILLAGES.REQUEST_USER_TO_DIFFERENT_MENTOR'
              )}
              primaryText={t('COMMON.SEND_REQUEST')}
              //pass function handler as props
            >
              <Box>
                <Box m={2}>
                  <Typography sx={{ color: theme.palette.warning['A200'] }}>
                    {t(
                      'YOUTHNET_USERS_AND_VILLAGES.SEND_REQUEST_TO_ADMIN_TEXT'
                    )}
                  </Typography>
                </Box>
                <Box m={2}>
                  <Dropdown
                    name={t('YOUTHNET_USERS_AND_VILLAGES.SELECT_STATE')}
                    // values={districtData?.DISTRICT_OPTIONS}
                    // defaultValue={t('YOUTHNET_USERS_AND_VILLAGES.SELECT_STATE')}
                    onSelect={(value) => console.log('Selected:', value)}
                  />
                </Box>
                <Box m={2}>
                  <Dropdown
                    name={t('YOUTHNET_USERS_AND_VILLAGES.SELECT_DISTRICT')}
                    // values={blockData?.BLOCK_OPTIONS}
                    // defaultValue={t('YOUTHNET_USERS_AND_VILLAGES.SELECT')}
                    onSelect={(value) => console.log('Selected:', value)}
                  />
                </Box>
              </Box>
            </SimpleModal>
            <SimpleModal
              open={openDelete}
              onClose={onClose}
              showFooter={true}
              modalTitle={t(
                'YOUTHNET_USERS_AND_VILLAGES.DELETE_USER_PERMANENTLY'
              )}
              primaryText={t('COMMON.DELETE_USER_WITH_REASON')}
            >
              <Box>
                <Box mt={2}>
                  <Typography sx={{ fontSize: '14px' }}>
                    {t('COMMON.REASON_FOR_DELETION')}
                  </Typography>
                </Box>
                <Box>
                  {reasons.map((option, index) => (
                    <>
                      <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                      >
                        <Typography
                          sx={{
                            color: theme.palette.warning['A200'],
                            fontSize: '16px',
                            fontWeight: 400,
                          }}
                          component="h2"
                        >
                          {option.label}
                        </Typography>

                        <Radio
                          sx={{ pb: '20px' }}
                          onChange={() => handleRadioChange(option.value)}
                          value={option.value}
                          checked={selectedValue === option.value}
                        />
                      </Box>
                      {reasons?.length - 1 !== index && <Divider />}
                    </>
                  ))}
                </Box>
              </Box>
            </SimpleModal>

            <SimpleModal
              open={addNew}
              onClose={onClose}
              showFooter={true}
              modalTitle={'New Mentor'}
              handleNext={handleNext}
              primaryText={count === 0 ? 'Next' : 'Finish & Assign'}
              secondaryText={count === 1 ? 'Save Progress' : ''}
       
            >
              {count === 0 && (
                <Box>
                  <Box mt={2}>
                    <GenericForm fields={formFields} />
                  </Box>
                </Box>
              )}
              {count === 1 && (
                <Box>
                  <Box mt={2}>
                    <ExamplePage handleNext={handleNext} />
                  </Box>
                </Box>
              )}
              {count === 2 && (
                <Box>
                  <Box mt={2}>
                    <VillageSelector />
                  </Box>
                </Box>
              )}
            </SimpleModal>
          </>
        )}
      </Box>

      <Box>
        {value === 2 && (
          <>
            {YOUTHNET_USER_ROLE.MENTOR_LEAD === TENANT_DATA.LEADER && (
              <Box
                display={'flex'}
                flexDirection={'row'}
                sx={{
                  p: '20px',
                }}
              >
                <Box
                  sx={{
                    width: '50%',
                    mr: '20px',
                  }}
                >
                  {districtData ? (
                    <Dropdown
                      name={districtData?.DISTRICT_NAME}
                      values={districtData?.DISTRICT_OPTIONS}
                      defaultValue={districtData?.DISTRICT_OPTIONS[0]}
                      onSelect={(value) => console.log('Selected:', value)}
                    />
                  ) : (
                    <Loader showBackdrop={true} />
                  )}
                </Box>
                <Box
                  sx={{
                    width: '50%',
                  }}
                >
                  {blockData ? (
                    <Dropdown
                      name={blockData?.BLOCK_NAME}
                      values={blockData?.BLOCK_OPTIONS}
                      defaultValue={blockData?.BLOCK_OPTIONS[0]}
                      onSelect={(value) => console.log('Selected:', value)}
                    />
                  ) : (
                    <Loader showBackdrop={true} />
                  )}
                </Box>
              </Box>
            )}
            <Box
              display={'flex'}
              flexDirection={'row'}
              sx={{
                pr: '20px',
              }}
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
        {value === 3 && (
          <>
            {YOUTHNET_USER_ROLE.MENTOR_LEAD === TENANT_DATA.LEADER && (
              <Box
                display={'flex'}
                flexDirection={'row'}
                sx={{
                  p: '20px 20px 0px 20px',
                }}
              >
                <Box
                  sx={{
                    width: '50%',
                    mr: '20px',
                  }}
                >
                  {districtData ? (
                    <Dropdown
                      name={districtData?.DISTRICT_NAME}
                      values={districtData?.DISTRICT_OPTIONS}
                      defaultValue={districtData?.DISTRICT_OPTIONS[0]}
                      onSelect={(value) => console.log('Selected:', value)}
                    />
                  ) : (
                    <Loader showBackdrop={true} />
                  )}
                </Box>
                <Box
                  sx={{
                    width: '50%',
                  }}
                >
                  {blockData ? (
                    <Dropdown
                      name={blockData?.BLOCK_NAME}
                      values={blockData?.BLOCK_OPTIONS}
                      defaultValue={blockData?.BLOCK_OPTIONS[0]}
                      onSelect={(value) => console.log('Selected:', value)}
                    />
                  ) : (
                    <Loader showBackdrop={true} />
                  )}
                </Box>
              </Box>
            )}
            <Box
              sx={{
                px: '20px',
                mt: '15px',
              }}
            >
              <Dropdown
                name={DROPDOWN_NAME}
                values={VILLAGE_OPTIONS}
                defaultValue={VILLAGE_OPTIONS[0]}
                onSelect={(value) => console.log('Selected:', value)}
              />
            </Box>
            <Box
              display={'flex'}
              flexDirection={'row'}
              sx={{
                pr: '20px',
              }}
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
                onToggleUserClick={handleToggledUserClick}
              />
            </Box>
            <BottomDrawer
              open={openDrawer}
              onClose={handleToggleClose}
              title={toggledUser}
              buttons={buttons}
            />
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

export default withRole(TENANT_DATA.YOUTHNET)(Index);
