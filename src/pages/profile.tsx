import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { CustomField, UserDatas, updateCustomField } from '@/utils/Interfaces';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';
import { editEditUser, getUserDetails } from '@/services/ProfileService';
import { useTheme, withStyles } from '@mui/material/styles';

import Button from '@mui/material/Button';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloseIcon from '@mui/icons-material/Close';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import Header from '@/components/Header';
import Image from 'next/image';
import Loader from '@/components/Loader';
import Modal from '@mui/material/Modal';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { getLabelForValue } from '@/utils/Helper';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import userPicture from '@/assets/images/imageOne.jpg';
import user_placeholder from '../assets/images/user_placeholder.png';
import { logEvent } from '@/utils/googleAnalytics';
import { showToastMessage } from '@/components/Toastify';

interface FieldOption {
  name: string;
  label: string;
  value: string;
  order: string;
}

interface UserData {
  name: string;
}

interface EditFormProps {
  userData: UserData;
  customFieldsData: CustomField[];
  updateUser: (payload: any) => void;
}

const TeacherProfile = () => {
  const user_placeholder_img: string = user_placeholder.src;

  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme<any>();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    logEvent({
      action: 'edit-teacher-profile-modal-open',
      category: 'Profile Page',
      label: 'Edit Teacher Profile Modal Open',
    });
  };
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const handleClose = () => {
    setOpen(false);
    initialFormData();
    setHasInputChanged(false);
    setHasErrors(false);
    setErrors({});
    logEvent({
      action: 'edit-teacher-profile-modal-close',
      category: 'Profile Page',
      label: 'Edit Teacher Profile Modal Close',
    });
  };
  const [userData, setUserData] = useState<any | null>(null);
  const [userName, setUserName] = useState<any | null>(null);
  const [updatedCustomFields, setUpdatedCustomFields] = useState<any>([]);
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dropdownValues, setDropdownValues] = useState<any>({});
  const [customFieldsData, setCustomFieldsData] = useState<CustomField[]>([]);

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(user_placeholder_img);
  const [gender, setGender] = React.useState('');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [unitName, setUnitName] = useState('');
  const [blockName, setBlockName] = useState('');
  const [radioValues, setRadioValues] = useState<any>([]);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [isData, setIsData] = React.useState<boolean>(false);
  const [hasInputChanged, setHasInputChanged] = React.useState<boolean>(false);
  const [isValidationTriggered, setIsValidationTriggered] =
    React.useState<boolean>(false);

  const handleNameFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserName(value);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    width: '85%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: theme.palette.warning.A400,
    height: '526px',
    textAlign: 'center',
    '@media (min-width: 600px)': {
      width: '450px',
    },
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

  // find Address
  const getFieldValue = (data: any, label: string) => {
    const field = data.find((item: any) => item.label === label);
    return field ? field.value[0] : null;
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    if (typeof window !== 'undefined' && window.localStorage) {
      const userId = localStorage.getItem('userId');

      try {
        if (userId) {
          const response = await getUserDetails(userId, true);
          console.log('response', response);

          const data = response?.result;

          if (data) {
            const userData = data?.userData;
            setUserData(userData);
            setUserName(userData?.name);
            const customDataFields = userData?.customFields;
            setIsData(true);
            if (customDataFields?.length > 0) {
              setCustomFieldsData(customDataFields);

              const unitName = getFieldValue(customDataFields, 'Unit Name');
              setUnitName(unitName);
              const blockName = getFieldValue(customDataFields, 'Block Name');
              setBlockName(blockName);
              setLoading(false);
            }
          } else {
            setLoading(false);
            setIsData(false);
            console.log('No data Found');
          }
        }
        setIsError(false);
      } catch (error) {
        setLoading(false);
        setIsError(true);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
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

  // Find fields for "Subjects I Teach" and "My Main Subjects"
  const teachSubjectsField = customFieldsData?.find(
    (field) => field.name === 'subject_taught'
  );
  const mainSubjectsField = customFieldsData?.find(
    (field) => field.name === 'main_subject'
  );

  const teachSubjects: string[] = Array.isArray(teachSubjectsField?.value)
    ? teachSubjectsField?.value
    : [];
  const mainSubjects: string[] = Array.isArray(mainSubjectsField?.value)
    ? mainSubjectsField?.value
    : [];

  // Find mutual and remaining subjects
  const mutualSubjects = teachSubjects?.filter((subject) =>
    mainSubjects?.includes(subject)
  );
  const remainingSubjects = teachSubjects?.filter(
    (subject) => !mainSubjects?.includes(subject)
  );
  const orderedSubjects = [...mutualSubjects, ...remainingSubjects];

  // Function to get label for a subject from the options array
  const getLabelForSubject = (subject: string) => {
    const option = teachSubjectsField?.options?.find(
      (opt: any) => opt.value === subject
    );
    return option ? option.label : subject;
  };

  //fields  for view profile by order
  const filteredSortedForView = [...customFieldsData]
    ?.filter((field) => field.order !== 0 && field.name !== 'main_subject')
    ?.sort((a, b) => a.order - b.order);

  // fields for showing in  basic details
  const getLabelForValue = (field: any, value: string) => {
    if (
      field.type === 'radio' ||
      field.type === 'Radio' ||
      field.type === 'drop_down' ||
      field.type === 'dropdown'
    ) {
      const option = field?.options?.find((opt: any) => opt?.value === value);
      return option ? option?.label : value;
    }
    return value;
  };

  // address find
  const address = [unitName, blockName, userData?.district, userData?.state]
    ?.filter(Boolean)
    ?.join(', ');

  //------------edit teacher profile------------

  const [formData, setFormData] = useState<{
    userData: UserDatas;
    customFields: { fieldId: string; type: string; value: string[] | string }[];
  }>({
    userData: {
      name: userName || '',
    },
    customFields: customFieldsData?.map((field) => ({
      fieldId: field.fieldId,
      type: field.type,
      value: field.value ? field.value : '',
    })),
  });

  const initialFormData = () => {
    setFormData({
      userData: {
        name: userName || '',
      },
      customFields: customFieldsData?.map((field) => ({
        fieldId: field.fieldId,
        type: field.type,
        value: field.value ? field.value : '',
      })),
    });
  };

  useEffect(() => {
    initialFormData();
  }, [userData, customFieldsData]);

  const [hasErrors, setHasErrors] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const sanitizedValue = value
      .replace(/[^a-zA-Z_ ]/g, '')
      .replace(/^\s+/, '')
      .replace(/\s+/g, ' ');

    setFormData((prevData) => ({
      ...prevData,
      userData: {
        ...prevData.userData,
        name: sanitizedValue,
      },
    }));
    setHasInputChanged(true);
    setIsValidationTriggered(true);
    validateFields();
    // setHasErrors(!sanitizedValue.trim());
  };

  //fields  for edit popup by order
  const filteredSortedForEdit = [...customFieldsData]
    ?.filter((field) => field.isEditable)
    ?.sort((a, b) => a.order - b.order);

  const validateFields = () => {
    const newErrors: { [key: string]: boolean } = {};

    filteredSortedForEdit?.forEach((field) => {
      const value =
        formData?.customFields?.find((f) => f.fieldId === field.fieldId)
          ?.value[0] || '';

      if (field.type === 'text') {
        newErrors[field.fieldId] = !value.trim();
      } else if (field.type === 'numeric') {
        newErrors[field.fieldId] = !/^\d{1,4}$/.test(value);
      } else if (field.type === 'dropdown' || field.type === 'drop_down') {
        newErrors[field.fieldId] = !value.trim();
      }
    });

    newErrors['name'] = !formData.userData.name.trim();

    setErrors(newErrors);
    setHasErrors(Object.values(newErrors).some((error) => error));
  };

  useEffect(() => {
    if (hasInputChanged) {
      validateFields();
    }
  }, [formData, customFieldsData]);

  const handleFieldChange = (fieldId: string, value: string) => {
    const sanitizedValue = value.replace(/^\s+/, '').replace(/\s+/g, ' ');

    setFormData((prevState) => ({
      ...prevState,
      customFields: prevState.customFields.map((field) =>
        field.fieldId === fieldId
          ? { ...field, value: [sanitizedValue] }
          : field
      ),
    }));
    setHasInputChanged(true);
    setIsValidationTriggered(true);
    validateFields();
  };

  const handleCheckboxChange = (
    fieldId: string,
    optionName: string,
    isChecked: boolean
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      customFields: prevState.customFields.map((field) =>
        field.fieldId === fieldId
          ? {
              ...field,
              value: isChecked
                ? [...(field.value as string[]), optionName]
                : (field.value as string[]).filter(
                    (item) => item !== optionName
                  ),
            }
          : field
      ),
    }));
    setHasInputChanged(true);
    setIsValidationTriggered(true);
    validateFields();
  };

  const handleDropdownChange = (fieldId: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      customFields: prevState.customFields.map((field) =>
        field.fieldId === fieldId ? { ...field, value: [value] } : field
      ),
    }));
    setHasInputChanged(true);
    setIsValidationTriggered(true);
    validateFields();
  };

  const handleRadioChange = (fieldId: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      customFields: prevState.customFields.map((field) =>
        field.fieldId === fieldId ? { ...field, value: [value] } : field
      ),
    }));
    setHasInputChanged(true);
    setIsValidationTriggered(true);
    validateFields();
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    logEvent({
      action: 'save-button-clicked-edit-teacher-profile',
      category: 'Profile Page',
      label: 'Teacher Profile Save Button Clicked',
    });
    setLoading(true);
    const userId = localStorage.getItem('userId');
    const data = {
      userData: formData?.userData,
      customFields: formData?.customFields?.map((field) => ({
        fieldId: field.fieldId,
        // type: field.type,
        value: Array.isArray(field?.value)
          ? field?.value?.length > 0
            ? field?.value
            : ''
          : field?.value,
      })),
    };
    let userDetails = data;
    try {
      if (userId) {
        const response = await editEditUser(userId, userDetails);
        ReactGA.event('edit-teacher-profile-successful', { userId: userId });
        if (response.responseCode !== 200 || response.params.err) {
          ReactGA.event('edit-teacher-profile-error', { userId: userId });
          throw new Error(
            response.params.errmsg ||
              'An error occurred while updating the user.'
          );
        }

        handleClose();

        console.log(response.params.successmessage);
        fetchUserDetails();
        setIsError(false);
        setLoading(false);
      }
    } catch (error) {
      setIsError(true);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      console.error('Error:', error);
    }

    console.log('payload', data);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        minWidth={'100%'}
      >
        <Header />
        {loading && (
          <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
        )}
        {isData && isData ? (
          <Box
            display="flex"
            flexDirection="column"
            // padding={2}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Box
              sx={{ flex: '1', minWidth: '100%' }}
              display="flex"
              flexDirection="row"
              gap="5px"
              padding="25px 19px  20px"
            >
              <Typography
                // variant="h3"
                style={{
                  letterSpacing: '0.1px',
                  textAlign: 'left',
                  marginBottom: '2px',
                }}
                fontSize={'22px'}
                fontWeight={'400'}
                lineHeight={'28px'}
                color={theme.palette.warning['A200']}
              >
                {t('PROFILE.MY_PROFILE')}
              </Typography>
            </Box>

            <Box padding="5px 19px" className="w-100">
              <Box
                sx={{
                  flex: '1',
                  border: '1px solid #D0C5B4',
                  boxShadow: '0px 1px 2px 0px #0000004D',

                  borderColor: theme.palette.warning['A100'],
                }}
                minWidth={'100%'}
                borderRadius={'12px'}
                border={'1px'}
                bgcolor={theme.palette.warning.A400}
                display="flex"
                gap={'25px'}
                alignItems={'center'}
              >
                <Image
                  src={user_placeholder_img}
                  alt="user"
                  width={116}
                  height={120}
                  style={{
                    borderTopLeftRadius: '12px',
                    borderBottomLeftRadius: '12px',
                  }}
                />
                <Box width={'100%'}>
                  <Box>
                    <Box
                      fontSize={'16px'}
                      lineHeight={'16px'}
                      className="text-4d"
                      width={'100%'}
                      fontWeight={'500'}
                    >
                      <Typography
                        sx={{ wordBreak: 'break-word' }}
                        className="text-4d two-line-text"
                        mr={'40px'}
                      >
                        {userData?.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display={'flex'} gap={'4px'} mt={'5px'}>
                    {address ? (
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
                      className="text-4d"
                    >
                      {address}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              className="linerGradient"
              sx={{ padding: '10px 16px 21px', mt: 3 }}
            >
              <Button
                sx={{
                  fontSize: '14px',
                  lineHeight: '20px',
                  minWidth: '100%',
                  padding: '10px 24px 10px 16px',
                  gap: '8px',
                  borderRadius: '100px',
                  marginTop: '10px',
                  flex: '1',
                  textAlign: 'center',
                  color: theme.palette.warning.A200,
                  border: `1px solid #4D4639`,
                }}
                onClick={handleOpen}
              >
                <Typography
                  variant="h3"
                  style={{
                    letterSpacing: '0.1px',
                    textAlign: 'left',
                    marginBottom: '2px',
                  }}
                  fontSize={'14px'}
                  fontWeight={'500'}
                  lineHeight={'20px'}
                >
                  {t('PROFILE.EDIT_PROFILE')}
                </Typography>
                <Box>
                  <CreateOutlinedIcon sx={{ fontSize: '18px' }} />
                </Box>
              </Button>

              <Box
                mt={2}
                sx={{
                  flex: '1',
                  // textAlign: 'center',
                  border: '1px solid',
                  borderColor: theme.palette.warning['A100'],
                  padding: '16px',
                }}
                className="bg-white"
                minWidth={'100%'}
                borderRadius={'16px'}
                border={'1px'}
                display="flex"
                flexDirection="row"
              >
                <Grid container spacing={4}>
                  {filteredSortedForView?.map((item, index) => {
                    if (item.order === 5) {
                      return (
                        <Grid item xs={12}>
                          <Typography
                            fontSize={'12px'}
                            fontWeight={'600'}
                            margin={0}
                            lineHeight={'16px'}
                            letterSpacing={'0.5px'}
                            sx={{ wordBreak: 'break-word' }}
                            color={theme.palette.warning['500']}
                          >
                            {item?.label && item.name
                              ? t(
                                  `FIELDS.${item.name.toUpperCase()}`,
                                  item.label
                                )
                              : item.label}
                            {/* {item?.label} */}
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
                                    backgroundColor: mainSubjects?.includes(
                                      subject
                                    )
                                      ? theme.palette.info.contrastText
                                      : 'none',
                                    borderRadius: '8px',
                                    color: theme.palette.warning.A200,
                                    whiteSpace: 'nowrap',
                                    boxShadow: 'none',
                                    border: `1px solid ${theme.palette.warning[900]}`,
                                    pointerEvents: 'none',
                                  }}
                                >
                                  {getLabelForSubject(subject)}
                                  {/* {subject} */}
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
                            color={theme.palette.warning['500']}
                          >
                            {item?.label && item.name
                              ? t(
                                  `FIELDS.${item.name.toUpperCase()}`,
                                  item.label
                                )
                              : item.label}
                            {/* {item.label} */}
                          </Typography>
                          <Typography
                            variant="h4"
                            margin={0}
                            color={theme.palette.warning.A200}
                            sx={{ wordBreak: 'break-word' }}
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
                            color={theme.palette.warning['500']}
                          >
                            {item?.label && item.name
                              ? t(
                                  `FIELDS.${item.name.toUpperCase()}`,
                                  item.label
                                )
                              : item.label}
                            {/* {item.label} */}
                          </Typography>
                          <Typography
                            variant="h4"
                            margin={0}
                            color={theme.palette.warning.A200}
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {getLabelForValue(item, item.value[0])}
                          </Typography>
                        </Grid>
                      );
                    }
                  })}
                </Grid>
              </Box>
            </Box>
            {/* modal for edit profile */}
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
                {loading && (
                  <Loader
                    showBackdrop={true}
                    loadingText={t('COMMON.LOADING')}
                  />
                )}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 20px 6px',
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
                <Divider />
                <Box
                  style={{
                    overflowY: 'auto',
                    padding: '0px 20px 10px',
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
                    bgcolor={theme.palette.warning.A400}
                    display="flex"
                    flexDirection="column"
                  >
                    {/* <Image
                    src={user_placeholder_img}
                    alt="user"
                    height={80}
                    width={70}
                    style={{ alignItems: 'center' }}
                  /> */}

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
                      {/* ------- comment for temp 
                    <Button
                      sx={{
                        minWidth: '100%',
                        padding: '10px 24px 10px 16px',
                        borderRadius: '12px',
                        marginTop: '10px',
                        flex: '1',
                        textAlign: 'center',
                        border: '1px solid ',
                      }}
                      disabled // commment for temp
                      onClick={handleClickImage}
                    >
                      {t('PROFILE.UPDATE_PICTURE')}
                    </Button> */}
                    </Box>
                  </Box>
                  <TextField
                    sx={{ marginTop: '20px' }}
                    type="text"
                    fullWidth
                    name="name"
                    label={t('PROFILE.FULL_NAME')}
                    variant="outlined"
                    value={formData.userData.name}
                    inputProps={{
                      pattern: '^[A-Za-z_ ]+$', // Only allow letters, underscores, and spaces
                      title: t('PROFILE.AT_REQUIRED_LETTER'),
                      required: true,
                    }}
                    error={!formData.userData.name.trim()} // Show error if the input is empty
                    helperText={
                      !formData.userData.name.trim() && t('PROFILE.ENTER_NAME')
                    }
                    onChange={handleInputChange}
                  />

                  {customFieldsData
                    ?.filter((field) => field.isEditable)
                    ?.sort((a, b) => a.order - b.order)
                    ?.map((field) => {
                      const fieldValue =
                        formData?.customFields?.find(
                          (f) => f.fieldId === field.fieldId
                        )?.value[0] || '';
                      const isError = errors[field.fieldId];

                      return (
                        <Grid item xs={12} key={field.fieldId}>
                          {field.type === 'text' ? (
                            <TextField
                              type="text"
                              inputProps={{ maxLength: 3 }}
                              sx={{ marginTop: '20px' }}
                              fullWidth
                              name={field.name}
                              label={
                                field?.label && field.name
                                  ? t(
                                      `FIELDS.${field.name.toUpperCase()}`,
                                      field.label
                                    )
                                  : field.label
                              }
                              variant="outlined"
                              value={fieldValue}
                              onChange={(e) => {
                                handleFieldChange(
                                  field.fieldId,
                                  e.target.value
                                );
                                validateFields();
                              }}
                              error={isError}
                              helperText={
                                isError && t('PROFILE.ENTER_CHARACTER')
                              }
                            />
                          ) : field.type === 'numeric' ? (
                            <TextField
                              type="number"
                              inputProps={{ maxLength: 3 }}
                              sx={{ marginTop: '20px' }}
                              fullWidth
                              name={field.name}
                              label={
                                field?.label && field.name
                                  ? t(
                                      `FIELDS.${field.name.toUpperCase()}`,
                                      field.label
                                    )
                                  : field.label
                              }
                              variant="outlined"
                              value={fieldValue}
                              onKeyDown={(e) => {
                                // Allow only numeric keys, Backspace, and Delete
                                if (
                                  !(
                                    (
                                      /[0-9]/.test(e.key) ||
                                      e.key === 'Backspace' ||
                                      e.key === 'Delete'
                                    ) // Allow decimal point if needed
                                  )
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                if (/^\d{0,4}$/.test(inputValue)) {
                                  handleFieldChange(field.fieldId, inputValue);
                                  validateFields();
                                }
                              }}
                              error={isError}
                              helperText={isError && t('PROFILE.ENTER_NUMBER')}
                            />
                          ) : field.type === 'checkbox' ? (
                            <Box marginTop={3}>
                              <Typography
                                textAlign={'start'}
                                variant="h4"
                                margin={0}
                                color={theme.palette.warning.A200}
                              >
                                {field?.label && field.name
                                  ? t(
                                      `FIELDS.${field.name.toUpperCase()}`,
                                      field.label
                                    )
                                  : field.label}
                              </Typography>
                              {field.options?.map((option: any) => (
                                <FormGroup key={option.value}>
                                  <FormControlLabel
                                    sx={{ color: theme.palette.warning[300] }}
                                    control={
                                      <Checkbox
                                        color="default"
                                        checked={(
                                          formData?.customFields.find(
                                            (f) => f.fieldId === field.fieldId
                                          )?.value || []
                                        )?.includes(option.value)}
                                        onChange={(e) =>
                                          handleCheckboxChange(
                                            field.fieldId,
                                            option.value,
                                            e.target.checked
                                          )
                                        }
                                      />
                                    }
                                    label={option.label}
                                  />
                                </FormGroup>
                              ))}
                            </Box>
                          ) : field.type === 'drop_down' ||
                            field.type === 'dropdown' ? (
                            <Box marginTop={3} textAlign={'start'}>
                              <FormControl fullWidth>
                                <InputLabel
                                  id={`select-label-${field.fieldId}`}
                                >
                                  {field?.label && field.name
                                    ? t(
                                        `FIELDS.${field.name.toUpperCase()}`,
                                        field.label
                                      )
                                    : field.label}
                                </InputLabel>
                                <Select
                                  labelId={`select-label-${field.fieldId}`}
                                  id={`select-${field.fieldId}`}
                                  value={fieldValue}
                                  label={
                                    field?.label && field.name
                                      ? t(
                                          `FIELDS.${field.name.toUpperCase()}`,
                                          field.label
                                        )
                                      : field.label
                                  }
                                  onChange={(e) =>
                                    handleDropdownChange(
                                      field.fieldId,
                                      e.target.value
                                    )
                                  }
                                >
                                  {field?.options?.map((option: any) => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors[field.fieldId] && (
                                  <FormHelperText
                                    sx={{ color: theme.palette.error.main }}
                                  >
                                    {t('PROFILE.SELECT_OPTION')}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Box>
                          ) : field.type === 'radio' ||
                            field.type === 'Radio' ? (
                            <Box marginTop={3}>
                              <Typography
                                textAlign={'start'}
                                variant="h4"
                                margin={0}
                                color={theme.palette.warning.A200}
                              >
                                {field?.label && field.name
                                  ? t(
                                      `FIELDS.${field.name.toUpperCase()}`,
                                      field.label
                                    )
                                  : field.label}
                              </Typography>
                              <RadioGroup
                                name={field.fieldId}
                                value={fieldValue}
                                onChange={(e) =>
                                  handleRadioChange(
                                    field.fieldId,
                                    e.target.value
                                  )
                                }
                              >
                                <Box
                                  display="flex"
                                  flexWrap="wrap"
                                  color={theme.palette.warning.A200}
                                >
                                  {field?.options?.map((option: any) => (
                                    <FormControlLabel
                                      key={option.value}
                                      value={option.value}
                                      control={<Radio color="default" />}
                                      label={option.label}
                                    />
                                  ))}
                                </Box>
                              </RadioGroup>
                            </Box>
                          ) : null}
                        </Grid>
                      );
                    })}
                  <Box></Box>
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: 'flex',
                    padding: '6px 20px 20px 20px',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    sx={{
                      minWidth: '100%',
                      color: theme.palette.warning.A200,
                      boxShadow: 'none',
                    }}
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={
                      !hasInputChanged || !isValidationTriggered || hasErrors
                    }
                  >
                    {t('COMMON.SAVE')}
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Box>
        ) : (
          <Box mt={5}>
            <Typography textAlign={'center'}>
              {t('COMMON.SOMETHING_WENT_WRONG')}
            </Typography>
          </Box>
        )}{' '}
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

export default TeacherProfile;
