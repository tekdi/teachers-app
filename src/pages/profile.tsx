import CloseIcon from '@mui/icons-material/Close';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import user_placeholder from '../assets/images/user_placeholder.png';
import userPicture from '@/assets/images/imageOne.jpg';
import Header from '@/components/Header';
import { editEditUser, getUserDetails } from '@/services/ProfileService';
import { updateCustomField } from '@/utils/Interfaces';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
const TeacherProfile = () => {
  const user_placeholder_img: string = user_placeholder.src;

  interface CustomField {
    fieldId: string;
    label: string;
    value: string;
    options: Record<string, any>;
    type: string;
    order: number;
  }

  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme<any>();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [userData, setUserData] = useState<any | null>(null);
  const [updatedCustomFields, setUpdatedCustomFields] = useState<any>([]);
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dropdownValues, setDropdownValues] = useState<any>({});
  const [customFieldsData, setCustomFieldsData] = useState<CustomField[]>([]);

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(user_placeholder_img);
  const [gender, setGender] = React.useState('');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleFieldChange = (
    fieldId: string,
    value: string | string[],
    type: string
  ) => {
    const updatedFields = [...updatedCustomFields];
    const index = updatedFields?.findIndex(
      (field) => field.fieldId === fieldId
    );

    if (index !== -1) {
      if (type === 'checkbox' && Array.isArray(value)) {
        updatedFields[index].values = value;
      } else {
        updatedFields[index].value = value as string;
      }
      updatedFields[index].type = type;
    } else {
      const newField = {
        fieldId,
        type,
        ...(type === 'checkbox' && Array.isArray(value)
          ? { values: value }
          : { value: value as string }),
      };
      updatedFields.push(newField);
    }

    setUpdatedCustomFields(updatedFields);
  };

  const handleCheckboxChange = (
    fieldId: string,
    optionName: string,
    checked: boolean
  ) => {
    const existingField = updatedCustomFields.find(
      (field: any) => field.fieldId === fieldId
    );

    let updatedValues: string[] = [];

    if (existingField && Array.isArray(existingField.values)) {
      updatedValues = [...existingField.values];
      if (checked) {
        updatedValues.push(optionName);
      } else {
        updatedValues = updatedValues.filter((value) => value !== optionName);
      }
    } else {
      if (checked) {
        updatedValues.push(optionName);
      }
    }

    handleFieldChange(fieldId, updatedValues, 'checkbox');
  };

  const handleDropdownChange = (fieldId: any, value: any) => {
    setDropdownValues({
      ...dropdownValues,
      [fieldId]: value,
    });
    handleFieldChange(fieldId, value, 'dropdown');
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isDesktop ? 700 : 400,
    bgcolor: 'warning.A400',
    p: 4,
    textAlign: 'center',
    height: '85vh',
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
    }
  }, []);

  const handleUpdateClick = async () => {
    setLoading(true);

    try {
      // Transform the custom fields based on their types
      const transformedFields = updatedCustomFields?.map((field: any) => {
        if (field.type === 'checkbox' && Array.isArray(field.value)) {
          return {
            ...field,
            value: field.value.join(', '),
          };
        }
        return field;
      });

      const userDetails = {
        customFields:
          transformedFields.length > 0 ? transformedFields : customFieldsData,
      };

      const userId = localStorage.getItem('userId');
      if (userId) {
        await editEditUser(userId, userDetails);
        await fetchUserDetails();
      }
      setOpen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const fetchUserDetails = async () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userId = localStorage.getItem('userId');

      try {
        if (userId) {
          const response = await getUserDetails(userId, true);

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
        }
      } catch (error) {
        console.error('Error fetching  user details:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleClickImage = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handleImageUpload = (e: any) => {
    const image: any[] = [e.target.files[0]];
    const newImageUrl: any = [];
    image.forEach((dataImage: any) =>
      newImageUrl.push(URL.createObjectURL(dataImage))
    );
    setImage(newImageUrl);
  };

  // render subjects i teach
  const techSubjectsField = customFieldsData?.find(
    (field) => field.label === 'Subjects I Teach'
  );
  const mainSubjectsField = customFieldsData?.find(
    (field) => field.label === 'My Main Subjects'
  );

  const techSubjects = techSubjectsField?.value?.split(', ') || [];
  const mainSubjects = mainSubjectsField?.value?.split(', ') || [];

  const mutualSubjects = techSubjects.filter((subject) =>
    mainSubjects.includes(subject)
  );
  const remainingSubjects = techSubjects.filter(
    (subject) => !mainSubjects.includes(subject)
  );
  const orderedSubjects = [...mutualSubjects, ...remainingSubjects];

  // Define the desired order
  const order = [1, 4, 2, 3, 5, 7];

  const orderedFields = customFieldsData
    ?.filter((field) => order?.includes(field.order))
    ?.sort((a, b) => order.indexOf(a.order) - order?.indexOf(b.order));

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
            fontSize={'22px'}
            fontWeight={'400'}
            lineHeight={'28px'}
          >
            {t('PROFILE.MY_PROFILE')}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: '1',
            border: '2px solid',
            borderColor: theme.palette.warning['A100'],
          }}
          minWidth={'100%'}
          borderRadius={'12px'}
          border={'1px'}
          bgcolor={theme.palette.warning.A400}
          display="flex"
          flexDirection="row"
        >
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Box m={2}>
                <Image
                  src={user_placeholder_img}
                  alt="user"
                  width={100}
                  height={100}
                />
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Box>
                <Typography
                  ml={0.5}
                  fontSize={'16px'}
                  lineHeight={'16px'}
                  fontWeight={'500'}
                >
                  <br />

                  {userData?.name}
                </Typography>
              </Box>
              <Box display={'flex'} mt={'3px'}>
                {userData?.district || userData?.state ? (
                  <PlaceOutlinedIcon
                    sx={{
                      fontSize: '1rem',
                      marginTop: '1px',
                      fontWeight: '11.7px',
                      height: '14.4px',
                    }}
                  />
                ) : (
                  ''
                )}

                <Typography
                  margin={0}
                  color={theme.palette.warning.A200}
                  fontSize={'12px'}
                  fontWeight={'500'}
                  lineHeight={'16px'}
                >
                  {userData?.district && userData?.state
                    ? `${userData.district}, ${userData.state}`
                    : `${userData?.district || ''}${userData?.state || ''}`}
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
            backgroundColor: theme.palette.warning.A400,
            '&:hover': {
              backgroundColor: theme.palette.warning.A400,
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
          display="flex"
          flexDirection="row"
        >
          <Grid container spacing={4}>
            {orderedFields?.map((item, index) => {
              if (item.order === 5) {
                return (
                  <Grid item xs={12}>
                    <Typography
                      fontSize={'12px'}
                      fontWeight={'600'}
                      margin={0}
                      lineHeight={'16px'}
                      letterSpacing={'0.5px'}
                    >
                      {item?.label}
                    </Typography>
                    <Box
                      mt={2}
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {orderedSubjects &&
                        orderedSubjects?.map((subject, index) => (
                          <Button
                            key={index}
                            size="small"
                            variant={
                              mainSubjects?.includes(subject)
                                ? 'contained'
                                : 'outlined'
                            }
                            sx={{
                              backgroundColor: mainSubjects?.includes(subject)
                                ? theme.palette.info.contrastText
                                : 'none',
                              borderRadius: '8px',
                              color: theme.palette.warning.A200,
                              whiteSpace: 'nowrap',
                              boxShadow: 'none',
                              border: `1px solid ${theme.palette.warning[900]}`,
                            }}
                          >
                            {subject}
                          </Button>
                        ))}
                    </Box>
                  </Grid>
                );
              } else if (item.order === 7) {
                return (
                  <Grid item xs={12} key={index}>
                    <Typography
                      variant="h4"
                      margin={0}
                      lineHeight={'16px'}
                      fontSize={'12px'}
                      fontWeight={'600'}
                      letterSpacing={'0.5px'}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="h4"
                      margin={0}
                      color={theme.palette.warning.A200}
                    >
                      {item.value}
                    </Typography>
                  </Grid>
                );
              } else {
                return (
                  <Grid item xs={6} key={index}>
                    <Typography
                      variant="h4"
                      margin={0}
                      lineHeight={'16px'}
                      fontSize={'12px'}
                      fontWeight={'600'}
                      letterSpacing={'0.5px'}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="h4"
                      margin={0}
                      color={theme.palette.warning.A200}
                    >
                      {item.value}
                    </Typography>
                  </Grid>
                );
              }
            })}
          </Grid>
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
                  color: theme.palette.warning.A200,
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
                  flex: '1',
                  textAlign: 'center',
                  marginLeft: '5%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                borderRadius={'12px'}
                border={'1px'}
                bgcolor="warning.A400"
                display="flex"
                flexDirection="column"
              >
                <Image
                  src={user_placeholder_img}
                  alt="user"
                  height={100}
                  width={100}
                  style={{ alignItems: 'center' }}
                />

                <Box>
                  <input
                    id=""
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
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
                      backgroundColor: theme.palette.warning.A400,
                      '&:hover': {
                        backgroundColor: theme.palette.warning.A400,
                      },
                    }}
                    onClick={handleClickImage}
                  >
                    {t('PROFILE.UPDATE_PICTURE')}
                  </Button>
                </Box>
              </Box>

              {customFieldsData &&
                customFieldsData.map((field) => (
                  <Grid item xs={12} key={field.fieldId}>
                    {field.type === 'text' || field.type === 'numeric' ? (
                      <TextField
                        sx={{ marginTop: '20px' }}
                        fullWidth
                        name={field.value}
                        label={field.label}
                        variant="outlined"
                        defaultValue={field.value}
                        onChange={(e) => {
                          handleFieldChange(
                            field.fieldId,
                            e.target.value,
                            field.type
                          );
                        }}
                      />
                    ) : field.type === 'checkbox' ? (
                      <Box marginTop={3}>
                        <Typography
                          textAlign={'start'}
                          variant="h4"
                          margin={0}
                          color={theme.palette.warning.A200}
                        >
                          {field.label}
                        </Typography>

                        {field?.options?.map((option: any) => (
                          <FormGroup key={option.order}>
                            <FormControlLabel
                              sx={{ color: theme.palette.warning[300] }}
                              control={
                                <Checkbox
                                  color="default"
                                  checked={
                                    (
                                      updatedCustomFields?.find(
                                        (f: any) => f.fieldId === field.fieldId
                                      )?.values || []
                                    ).includes(option.name) || false
                                  }
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      field.fieldId,
                                      option.name,
                                      e.target.checked
                                    )
                                  }
                                />
                              }
                              label={option.name}
                            />
                          </FormGroup>
                        ))}
                      </Box>
                    ) : field.type === 'Drop Down' ? (
                      <Box marginTop={3} textAlign={'start'}>
                        <FormControl fullWidth>
                          <InputLabel id={`select-label-${field.fieldId}`}>
                            {field.label}
                          </InputLabel>
                          <Select
                            labelId={`select-label-${field.fieldId}`}
                            id={`select-${field.fieldId}`}
                            value={dropdownValues[field.fieldId] || ''}
                            label={field.label}
                            onChange={(e) =>
                              handleDropdownChange(
                                field.fieldId,
                                e.target.value
                              )
                            }
                          >
                            {field.options?.map((option: any) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    ) : null}
                  </Grid>
                ))}

              <Box></Box>
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

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default TeacherProfile;
