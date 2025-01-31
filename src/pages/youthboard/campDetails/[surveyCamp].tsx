import Header from '@/components/Header';
import BackHeader from '@/components/youthNet/BackHeader';
import { CAMP_DATA } from '@/components/youthNet/tempConfigs';
import { Box, Divider, Tab, Tabs, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import EntrySlider from '@/components/youthNet/EntrySlider';
import EntryContent from '@/components/youthNet/EntryContent';
import withRole from '@/components/withRole';
import { TENANT_DATA } from '../../../../app.config';

const SurveyClassDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme<any>();
  const { surveyCamp } = router.query;
  const [value, setValue] = React.useState(1);
  const [village, setVillage] = useState<string>('');
  const [camp, setCamp] = useState<string>('');

  const entry1 = [{ name: 'Anita Kulkarni', age: '', village: '', image: '' }];
  const entry2 = [{ name: 'Ananya Sen', age: '', village: '', image: '' }];
  const youthListUser1 = [
    { name: 'Ananya Gupta', age: '16', village: 'Female', image: '' },
    { name: 'Ankita Sharma', age: '15', village: 'Female', image: '' },
  ];
  const youthListUser2 = [
    { name: 'Ankita Sharma', age: '15', village: 'Female', image: '' },
    { name: 'Ananya Gupta', age: '16', village: 'Female', image: '' },
  ];
  const files = ['Uploaded_file1.mp4', 'Uploaded_file2.mp4'];

  useEffect(() => {
    if (surveyCamp) {
      const [villageName, ...rest] = (surveyCamp as string).split(/(?=[A-Z])/);
      const surveyTitle = rest.join('');

      setVillage(villageName);
      setCamp(surveyTitle);
    }
  }, [surveyCamp]);

  const handleBack = () => {
    router.back();
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
      <Box>
        <BackHeader
          headingOne={camp}
          headingTwo={village}
          showBackButton={true}
          onBackClick={handleBack}
        />
      </Box>
      <Box ml={2}>
        <Typography
          sx={{ fontSize: '14px', fontWeight: 400, fontStyle: 'italic' }}
        >
          {CAMP_DATA.ASSIGNED}
        </Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          aria-label="secondary tabs example"
          sx={{
            fontSize: '14px',
            borderBottom: `1px solid #EBE1D4`,
            '& .MuiTab-root': {
              color: '#4D4639',
              padding: '0 20px',
            },
            '& .Mui-selected': {
              color: '#4D4639',
            },
            '& .MuiTabs-indicator': {
              display: 'flex',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '100px',
              height: '3px',
            },
            '& .MuiTabs-scroller': {
              overflowX: 'unset !important',
            },
          }}
        >
          <Tab value={1} label={t('YOUTHNET_CAMP_DETAILS.SUBMISSION')} />
          <Tab value={2} label={t('YOUTHNET_CAMP_DETAILS.SUMMARY')} />
        </Tabs>
      </Box>
      {value === 1 && (
        <Box>
          <Box width="100%">
            <EntrySlider>
              <EntryContent
                date={CAMP_DATA.DATE1}
                users={entry1}
                theme="Science"
                files={files}
                youthListUsers={youthListUser1}
              />
              <EntryContent
                date={CAMP_DATA.DATE2}
                users={entry2}
                theme="Maths"
                files={files}
                youthListUsers={youthListUser2}
              />
              {/* Add more entries as needed */}
            </EntrySlider>
          </Box>
        </Box>
      )}
      {value === 2 && <Box>coming soon</Box>}
    </Box>
  );
};

export default withRole(TENANT_DATA.YOUTHNET)(SurveyClassDetails);
