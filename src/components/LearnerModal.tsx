import * as React from 'react';
import PropTypes from 'prop-types';
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
import { useTheme } from '@mui/material/styles';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

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
    if (field.type === 'Drop Down' && field.options && field.value.length) {
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
              maxWidth: 300,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              '@media (max-width: 768px)': {
                width: '95%',
                padding: '15px',
              },
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                lineHeight={'0.15px'}
                fontSize="16px"
                fontWeight="500"
                color={'#4D4639'}
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
            <Box mt={2}>
              <Divider
                style={{
                  backgroundColor: theme.palette.warning['400'],
                  marginBottom: '10px',
                  marginTop: '15px',
                }}
              />
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
                    >
                      Full Name
                    </Typography>
                    <Box display="flex">
                      <Typography
                        fontSize={'16px'}
                        fontWeight={'400'}
                        lineHeight={'24px'}
                        margin={0}
                        color={'#969088'}
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
                        >
                          {item.label}
                        </Typography>
                        {/* <Box display="flex"> */}
                        <Typography
                          fontSize={'16px'}
                          fontWeight={'400'}
                          lineHeight={'24px'}
                          margin={0}
                          color={'#969088'}
                          style={{
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',
                          }}
                          // noWrap
                        >
                          {/* {Array.isArray(item.value) */}
                          {/* // ? item.displayValue.join(', ') */}
                          {item.displayValue}
                        </Typography>
                        {/* </Box> */}
                      </Grid>
                    </>
                  ))}
                </Grid>
              </Box>
              <Divider
                style={{
                  backgroundColor: theme.palette.warning['400'],
                  marginBottom: '10px',
                  marginTop: '15px',
                }}
              />
            </Box>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button
                sx={{
                  border: '1px solid #1E1B16',
                  width: '100px',
                  borderRadius: '100px',
                  boxShadow: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
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
