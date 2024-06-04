import * as React from 'react';

import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Typography,
  useMediaQuery,
} from '@mui/material';

import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const LearnerModal = ({
  userId,
  open,
  onClose,
  data,
  userName,
}: {
  userId?: string;
  open: boolean;
  data: any;
  onClose: () => void;
  userName?: string;
}) => {
  const { t } = useTranslation();

  const theme = useTheme<any>();
  const router = useRouter();

  const handleLearnerFullProfile = () => {
    router.push(`/learner/${userId}`);
  };

  const learnerDetailsByOrder = [...data]?.map((field) => {
    if (field.type === 'drop_down' && field.options && field.value.length) {
      const selectedOption = field?.options?.find(
        (option: any) => option.value === field.value[0]
      );
      return {
        ...field,
        displayValue: selectedOption ? selectedOption?.label : field.value[0],
      };
    }
    return {
      ...field,
      displayValue: field.value[0],
    };
  });

  return (
    <>
      {data && (
        <Modal open={open} onClose={onClose}>
          <Box
            sx={{
              width: '90%',
              maxWidth: 320,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: theme.palette.warning.A400,
              borderRadius: '8px',
              zIndex: '9999',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              '@media (max-width: 768px)': {
                width: '95%',
              },
              '@media (max-width: 325px)': {
                maxWidth: 300,
              },
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              padding="20px"
            >
              <Typography
                lineHeight={'0.15px'}
                fontSize="16px"
                fontWeight="500"
                color={theme.palette.warning['A200']}
                m={0}
              >
                {t('PROFILE.LEARNER_DETAILS')}
              </Typography>
              <CloseSharpIcon
                sx={{ cursor: 'pointer' }}
                onClick={onClose}
                aria-label="Close"
              />
            </Box>
            <Box>
              <Divider
                style={{
                  backgroundColor: theme.palette.warning['A100'],
                }}
              />
              <Box sx={{ padding: ' 25px 20px' }}>
                <Box
                  style={{ border: '1px solid gray', borderRadius: '16px' }}
                  p={2}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} textAlign="left">
                      <Typography
                        margin={0}
                        // variant="h6"
                        lineHeight={'16px'}
                        fontSize={'12px'}
                        fontWeight={'600'}
                        color={theme.palette.warning['500']}
                      >
                        {t('PROFILE.FULL_NAME')}
                      </Typography>
                      <Box display="flex">
                        <Typography
                          fontSize={'16px'}
                          fontWeight={'400'}
                          lineHeight={'24px'}
                          margin={0}
                          color={theme.palette.warning['A200']}
                        >
                          {userName}
                        </Typography>
                      </Box>
                    </Grid>
                    {learnerDetailsByOrder?.map((item: any, index: number) => (
                      <>
                        <Grid item xs={6} key={index} textAlign="left">
                          <Typography
                            margin={0}
                            lineHeight={'16px'}
                            fontSize={'12px'}
                            fontWeight={'600'}
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
                          {/* <Box display="flex"> */}
                          <Typography
                            fontSize={'16px'}
                            fontWeight={'400'}
                            lineHeight={'24px'}
                            margin={0}
                            color={theme.palette.warning['A200']}
                            style={{
                              wordBreak: 'break-word',
                              whiteSpace: 'normal',
                            }}
                            // noWrap
                          >
                            {Array.isArray(item.value)
                              ? item.value.join(', ')
                              : item.value}
                          </Typography>
                          {/* </Box> */}
                        </Grid>
                      </>
                    ))}
                  </Grid>
                </Box>
              </Box>
              <Divider
                style={{
                  backgroundColor: theme.palette.warning['A100'],
                }}
              />
            </Box>
            <Box padding={'20px'} display="flex" justifyContent="space-between">
              <Button
                sx={{
                  border: `1px solid ${theme.components.MuiButton.styleOverrides.root.border}`,
                  width: '100px',
                  borderRadius: '100px',
                  boxShadow: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: theme.components.MuiButton.styleOverrides.root.color,
                }}
                onClick={onClose}
                variant="outlined"
              >
                {t('COMMON.CLOSE')}
              </Button>
              <Button
                sx={{
                  borderColor: theme.palette.warning['A400'],
                  width: '164px',
                  borderRadius: '100px',
                  boxShadow: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: theme.components.MuiButton.styleOverrides.root.color,
                }}
                variant="contained"
                onClick={handleLearnerFullProfile}
              >
                {t('PROFILE.VIEW_FULL_PROFILE')}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

LearnerModal.propTypes = {
  userId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LearnerModal;
