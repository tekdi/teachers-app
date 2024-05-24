import React, { useEffect } from 'react';
import Modal from '@mui/material/Modal';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import CloseIcon from '@mui/icons-material/Close';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ProfileField from '@/components/ProfileField';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useParams, usePathname } from 'next/navigation';
import { getUserDetails } from '@/services/ProfileService';
import { UserData, updateCustomField } from '@/utils/Interfaces';

const LearnerDetails = () => {
  // const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = React.useState(true);
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [customFieldsData, setCustomFieldsData] = React.useState<
    updateCustomField[]
  >([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dummyData = [
    { label: 'Full Name', value: 'Ananya Gupta' },
    { label: 'Age', value: '19' },
    { label: 'Gender', value: 'Female' },
    { label: 'Type Of Learner', value: 'Regular' },
    { label: 'Enrollment Number', value: '1002365362' },
    { label: 'Learner Primary work', value: 'Self Employed' },
    { label: 'contact Number', value: '945454665' },
  ];

  const fetchUserDetails = async () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      // const userId = localStorage.getItem('userId');

      try {
        if (userId) {
          const response = await getUserDetails(userId, true);

          if (response?.statusCode === 200) {
            const data = response?.data;
            if (data) {
              const userData = data?.userData;
              setUserData(userData);
              const customDataFields = userData?.customFields;
              if (customDataFields?.length > 0) {
                setCustomFieldsData(customDataFields);
              }
            } else {
              console.log('No data Found');
            }
          } else {
            console.log('No Response Found');
          }
        }
      } catch (error) {
        console.error('Error fetching  user details:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const theme = useTheme<any>();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleGoFullProfile = () => {
    if (pathname !== `/learner-profile/${user}`) {
      router.push(`/learner-profile/${user}`);
    }
  };

  const labelValueArray = customFieldsData?.map(({ label, value }) => ({
    label,
    value,
  }));

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isDesktop ? 500 : 400,
    bgcolor: 'warning.A400',
    p: 4,
    textAlign: 'center',
    height: 'auto',
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-profile-modal"
        aria-describedby="edit-profile-description"
      >
        <Box
          sx={style}
          gap="10px"
          display="flex"
          flexDirection="column"
          borderRadius={'1rem'}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h2"
              style={{
                textAlign: 'left',
                color: theme.palette.warning['A400'],
              }}
            >
              Learner Details
              {/* {t('PROFILE.LEARNER_DETAILS')} */}
            </Typography>

            <IconButton
              edge="end"
              color="inherit"
              // onClick={handleClose}
              aria-label="close"
              style={{
                justifyContent: 'flex-end',
              }}
            >
              <CloseIcon cursor="pointer" />
            </IconButton>
          </Box>
          <Divider />
          <Box style={{ border: '1px solid gray', borderRadius: '16px' }} p={2}>
            <ProfileField data={labelValueArray} />
          </Box>

          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              sx={{
                borderColor: theme.palette.warning['A400'],
                borderRadius: '1px',
              }}
              onClick={handleClose}
              variant="outlined"
            >
              Close
              {/* {t('PROFILE.CLOSE')} */}
            </Button>
            <Button
              sx={{
                borderColor: theme.palette.warning['A400'],
              }}
              // onClick={handleGoFullProfile}
              variant="contained"
            >
              View Full Profile
              {/* {t('PROFILE.VIEW_FULL_PROFILE')} */}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
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

export default LearnerDetails;
