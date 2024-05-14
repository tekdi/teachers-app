import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {
  Box,
  //   Button,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "next-i18next";
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
// import Header from '../components/Header.tsx';
// import StudentStatsCard from '../components/StudentStatsCard.tsx';
// import { editEditUser, getUser } from '../services/profileService.ts';
// import { UserData } from '../utils/Interfaces.ts';
import defaultUser from '/default_user.png';
import prathamProfile from '../assets/images/prathamProfile.png';
import imageOne from '../assets/images/imageOne.jpg';
import Header from '@/components/Header';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Image, { StaticImageData } from 'next/image';
import { getUser, getUserDetails } from '@/services/ProfileService';
import { Label } from '@mui/icons-material';
const MyProfile = () => {
  // Assuming imageOne is of type StaticImageData
  const imageUrl: string = imageOne.src;
  const prathamProfileUrl: string = prathamProfile.src;
  interface CustomField {
    fieldId: string;
    label: string;
    value: string;
    options: Record<string, any>;
    type: string;
  }

  interface updateCustomField {
    fieldId: string;
    value: string;
  }
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [bio, setBio] = useState<string>(
    'Teaching for a decade, my mission is to make math enjoyable and accessible, turning each lesson into a mathematical adventure.'
  );
  const [userData, setUserData] = useState<any | null>(null);
  const [updatedName, setUpdatedName] = useState<string | null>(null);
  const [updatedPhone, setUpdatedPhone] = useState<string | null>(null);
  const [updatedEmail, setUpdatedEmail] = useState<string | null>(null);
  const [updatedCustomFields, setUpdatedCustomFields] = useState<
    updateCustomField[]
  >([]);
  const [loading, setLoading] = useState(false);

  const [customFieldsData, setCustomFieldsData] = useState<CustomField[]>([]);
  const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputBio = event.target.value;
    if (inputBio.length <= 150) {
      setBio(inputBio);
    }
  };
  const charCount = bio.length;
  const theme = useTheme<any>();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'warning.A400',
    p: 4,
    textAlign: 'center',
    height: '85vh',
  };

  const backButtonEvent = () => {
    window.history.back();
  };
  const handleUpdateClick = async () => {
    setLoading(true);
    try {
      const userDetails = {
        userData: {
          name: updatedName ?? userData?.name,
          email: updatedEmail ?? userData?.email,
        },
        customFields:
          updatedCustomFields.length > 0
            ? updatedCustomFields
            : customFieldsData,
      };
      const userId = localStorage.getItem('userId');
      if (userId) {
        // await editEditUser(userId, userDetails);
        await fetchUserDetails();
      }
      setOpen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };
  const handleFieldChange = (fieldId: string, value: string) => {
    const newData: updateCustomField[] = [
      {
        fieldId: fieldId,
        value: value,
      },

      // Add more objects as needed
    ];
    setUpdatedCustomFields(newData);
  };

  const fetchUserDetails = async () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userId = localStorage.getItem('userId');

      try {
        if (userId) {
          const response = await getUserDetails(userId, true);
          console.log('userId', response);
          if (response?.statusCode === 200) {
            const data = response?.data;
            if (data) {
              const userData = data?.userData;
              setUserData(userData);
              const customDataFields = userData?.customFields;
              console.log('customDataFields', customDataFields);
              if (customDataFields?.length > 0) {
                setCustomFieldsData(customDataFields);
              }
            } else {
              console.log('No data Found');
            }
          } else {
            console.log('No Response Found');
          }

          // console.log(response?.result?.userData?.customFields);
        }
      } catch (error) {
        console.error('Error fetching  user details:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const ageField: any = customFieldsData?.find(
    (field) => field.label === 'Age'
  );
  const genderField: any = customFieldsData?.find(
    (field) => field.label === 'Gender'
  );

  const YearOfJoingScp: any = customFieldsData?.find(
    (field) => field.label === 'Year of joining SCP'
  );

  const designation: any = customFieldsData?.find(
    (field) => field.label === 'Designation'
  );
  const noOfClusters: any = customFieldsData?.find(
    (field) => field.label === 'No of clusters in which you teach'
  );

  const techSubjects = customFieldsData?.find(
    (field) => field.label === 'Which subjects do you teach currently?'
  );

  const mainSubject = customFieldsData?.find(
    (field) => field.label === 'Which are your main subjects?'
  );

  const allLabels = [
    'Age',
    'Gender',
    'Year of joining SCP',
    'Designation',
    'No of clusters in which you teach',
    'Which subjects do you teach currently?',
    'Which are your main subjects?',
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      minWidth={'100%'}
    >
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        padding={2}
        gap={'10px'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Box
          sx={{ flex: '1', minWidth: '100%' }}
          display="flex"
          flexDirection="row"
          gap="5px"
        >
          <Typography
            variant="h3"
            style={{
              letterSpacing: '0.1px',
              textAlign: 'left',
              marginBottom: '2px',
            }}
          >
            {t('PROFILE.MY_PROFILE')}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: '1',
            // textAlign: 'center',
            border: '2px solid',
            borderColor: theme.palette.warning['A100'],
          }}
          minWidth={'100%'}
          borderRadius={'12px'}
          border={'1px'}
          bgcolor="warning.A400"
          display="flex"
          flexDirection="row"
        >
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <img src={imageUrl} alt="user" />
            </Grid>
            <Grid item xs={8}>
              <Typography margin={0} variant="h2">
                <br />

                {userData?.name}
              </Typography>
              <Box display={'flex'}>
                <PlaceOutlinedIcon
                  sx={{ fontSize: '1rem', marginTop: '1px' }}
                />
                <Typography variant="h5" margin={0} color={'#4D4639'}>
                  {userData?.district},{userData?.state}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Button
          sx={{
            minWidth: '100%',

            padding: '10px 24px 10px 16px',
            gap: '8px',
            borderRadius: '12px',
            marginTop: '10px',
            flex: '1',
            textAlign: 'center',
            color: 'black',
            border: '1px solid black',
            borderColor: 'black',
            backgroundColor: 'warning.A400',
            '&:hover': {
              backgroundColor: 'warning.A400',
            },
          }}
          startIcon={<CreateOutlinedIcon />}
          onClick={handleOpen}
        >
          {t('PROFILE.EDIT_PROFILE')}
        </Button>

        {/* modal for edit profile */}
        <Box
          sx={{
            flex: '1',
            // textAlign: 'center',
            border: '2px solid',
            borderColor: theme.palette.warning['A100'],
            padding: '10px',
          }}
          minWidth={'100%'}
          borderRadius={'12px'}
          border={'1px'}
          bgcolor="warning.A400"
          display="flex"
          flexDirection="row"
        >
          {/* <Card>
            <CardContent sx={{ alignItems: 'center' }}> */}

          <Grid container spacing={5}>
            <Grid item xs={6}>
              {/*  question */}
              <Typography variant="h4" margin={0} color={'#4D4639'}>
                Designation
              </Typography>

              {/* value  */}
              <Typography variant="h4" margin={0}>
                {designation?.value}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h4" margin={0} color={'#4D4639'}>
                Year of Joining SCP
              </Typography>
              <Typography variant="h4" margin={0}>
                {YearOfJoingScp?.value}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4" margin={0} color={'#4D4639'}>
                Age
              </Typography>
              <Typography variant="h4" margin={0}>
                {ageField?.value}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4" margin={0} color={'#4D4639'}>
                Gender
              </Typography>
              <Typography variant="h4" margin={0}>
                {genderField?.value}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" margin={0} color={'#4D4639'}>
                Subject | Teach
              </Typography>
              <Box mt={2}>
                <Grid
                  container
                  spacing={2}
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={4}>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        backgroundColor: '#EFC570',
                        borderRadius: '4px',
                        color: '#4D4639',
                      }}
                    >
                      {techSubjects?.value}
                    </Button>
                  </Grid>
                  {/* <Grid item xs={4}>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        backgroundColor: '#EFC570',
                        borderRadius: '4px',
                        color: '#4D4639',
                        // width: '100%',
                        fontSize: '0.8rem',
                      }}
                    >
                      Home Science
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        backgroundColor: '#EFC570',
                        borderRadius: '4px',
                        color: '#4D4639',
                      }}
                    >
                      Math
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: '4px',
                        color: '#4D4639',
                      }}
                    >
                      Hindi
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: '4px',
                        color: '#4D4639',
                      }}
                    >
                      Science
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: '4px',
                        color: '#4D4639',
                        fontSize: '0.8rem',
                      }}
                    >
                      Social Science
                    </Button>
                  </Grid> */}
                  <Grid item xs={4}>
                    {techSubjects?.value !== mainSubject?.value ? (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: '4px',
                          color: '#4D4639',
                        }}
                      >
                        {mainSubject?.value}
                      </Button>
                    ) : (
                      ''
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" margin={0} color={'#4D4639'}>
                Number of Clusters | Teach
              </Typography>
              <Typography variant="h4" margin={0}>
                {noOfClusters?.value}
              </Typography>
            </Grid>
          </Grid>

          {/* </CardContent>
          </Card> */}
        </Box>
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
                mb: 2,
              }}
            >
              <Typography
                variant="h2"
                style={{
                  textAlign: 'left',
                  color: '#4D4639',
                }}
              >
                {t('PROFILE.EDIT_PROFILE')}
              </Typography>

              <IconButton
                edge="end"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
                style={{
                  justifyContent: 'flex-end',
                }}
              >
                <CloseIcon cursor="pointer" />
              </IconButton>
            </Box>
            <Box
              style={{
                overflowY: 'auto',
              }}
              id="modal-modal-description"
            >
              <Box
                sx={{
                  //flex: '1',
                  textAlign: 'center',
                  marginLeft: '5%',
                }}
                borderRadius={'12px'}
                border={'1px'}
                bgcolor="warning.A400"
                display="flex"
                flexDirection="column"
              >
                <Image
                  src={prathamProfileUrl}
                  alt="user"
                  height={100}
                  width={100}
                  style={{ marginLeft: '35%' }}
                />
                {/* <img
                  src={prathamProfileUrl}
                  alt="user"
                  style={{ marginLeft: '35%' }}
                  height={'100px'}
                  width={'100px'}
                />{' '} */}
                <Box>
                  <Button
                    sx={{
                      minWidth: '100%',

                      padding: '10px 24px 10px 16px',
                      borderRadius: '12px',
                      marginTop: '10px',
                      flex: '1',
                      textAlign: 'center',
                      color: 'black',
                      border: '1px solid black',
                      borderColor: 'black',
                      backgroundColor: 'warning.A400',
                      '&:hover': {
                        backgroundColor: 'warning.A400',
                      },
                    }}
                  >
                    {t('PROFILE.UPDATE_PICTURE')}
                  </Button>
                </Box>
              </Box>
              <TextField
                sx={{
                  marginTop: '20px',
                }}
                label={t('PROFILE.FULL_NAME')}
                variant="outlined"
                defaultValue={userData?.name}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
              {/* <TextField
                label={t('PROFILE.PHONE')}
                variant="outlined"
                onChange={(e) => setUpdatedPhone(e.target.value)}
              />
              <TextField
                label={t('PROFILE.EMAIL_ID')}
                variant="outlined"
                defaultValue={userData?.email}
                onChange={(e) => setUpdatedEmail(e.target.value)}
              /> */}
              {/* {customFieldsData &&
                customFieldsData.map((field) => (
                  <Grid item xs={12} key={field.fieldId}>
                    {field.type === 'text' && (
                      <TextField
                        fullWidth
                        name={field.fieldId}
                        label={field.label}
                        variant="outlined"
                        defaultValue={field.value}
                        onChange={(e) =>
                          handleFieldChange(field.fieldId, e.target.value)
                        }
                      />
                    )}
                  </Grid>
                ))} */}
              <Box>
                {/* <TextField
                  label={t('PROFILE.BIO')}
                  multiline
                  rows={4}
                  InputProps={{
                    inputProps: { maxLength: 150 }
                  }}
                  value={bio}
                  onChange={handleBioChange}
                  variant="outlined"
                /> */}

                {/* <FormHelperText
                  style={{ textAlign: 'right' }}
                >{`${charCount}/150`}</FormHelperText> */}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                sx={{
                  minWidth: '100%',

                  color: 'black',
                  backgroundColor: 'containedSecondary',
                  '&:hover': {
                    backgroundColor: 'containedSecondary',
                  },
                }}
                onClick={handleUpdateClick}
                variant="contained"
              >
                {t('COMMON.UPDATE')}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default MyProfile;
