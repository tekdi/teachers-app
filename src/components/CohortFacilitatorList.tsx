import React, { useEffect } from 'react';
import {
  getMyCohortFacilitatorList,
  getMyCohortMemberList,
} from '@/services/MyClassDetailsService';
import {
  capitalizeEachWord,
  getFieldValue,
  toPascalCase,
} from '@/utils/Helper';
import LearnersList from '@/components/LearnersListItem';
import { Status, limit } from '@/utils/app.constant';
import { showToastMessage } from './Toastify';
import { useTranslation } from 'next-i18next';
import { Box, Grid, Typography } from '@mui/material';
import Loader from './Loader';
import { useTheme } from '@mui/material/styles';

interface UserDataProps {
  name: string;
  userId: string;
  memberStatus: string;
  cohortMembershipId: string;
  enrollmentNumber: string;
}
interface CohortLearnerListProp {
  cohortId: any;
  reloadState: boolean;
  setReloadState: React.Dispatch<React.SetStateAction<boolean>>;
}

const CohortLearnerList: React.FC<CohortLearnerListProp> = ({
  cohortId,
  reloadState,
  setReloadState,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [userData, setUserData] = React.useState<UserDataProps[]>();

  const { t } = useTranslation();

  useEffect(() => {
    const getCohortMemberList = async () => {
      setLoading(true);
      try {
        if (cohortId) {
          const page = 0;
          const filters = { cohortId: cohortId };
          const response = await getMyCohortFacilitatorList({
            limit,
            page,
            filters,
          });

          console.log(response);

          const resp = response?.result?.userDetails;

          if (resp) {
            const userDetails = resp.map((user: any) => ({
              name: toPascalCase(user.name),
              userId: user.userId,
              memberStatus: user.status,
              statusReason: user.statusReason,
              cohortMembershipId: user.cohortMembershipId,
              enrollmentNumber: capitalizeEachWord(
                getFieldValue(
                  user?.customField,
                  'fieldname',
                  'Enrollment Number',
                  'fieldvalues',
                  '-'
                )
              ),
            }));
            console.log(`userDetails`, userDetails);
            setUserData(userDetails);
          }
        }
      } catch (error) {
        console.error('Error fetching cohort list:', error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getCohortMemberList();
  }, [cohortId, reloadState]);

  const onDelete = () => { };

  console.log('userData', userData);
  const theme = useTheme<any>();
  return (
    <div>
      {loading ? (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      ) : (
        <>
          <Box sx={{
            '@media (min-width: 900px)': {
              background: theme.palette.action.selected,
              paddingBottom: '20px'
            },
          }}>
            <Grid container>
              {userData?.map((data: any) => {
                return (
                  <Grid xs={12} sm={6} md={4} >
                    <LearnersList
                      key={data.userId}
                      userId={data.userId}
                      learnerName={data.name}
                      enrollmentId={data.enrollmentNumber}
                      cohortMembershipId={data.cohortMembershipId}
                      isDropout={data.memberStatus === Status.DROPOUT}
                      statusReason={data.statusReason}
                      reloadState={reloadState}
                      setReloadState={setReloadState}
                      showMiniProfile={false}
                      onLearnerDelete={onDelete}
                    />
                  </Grid>
                );
              })}
              {!userData?.length && (
                <Box
                  sx={{
                    m: '1.125rem',
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                  }}
                >
                  <Typography style={{ fontWeight: 'bold' }}>
                    {t('COMMON.NO_DATA_FOUND')}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Box>
        </>
      )}
    </div>
  );
};

export default CohortLearnerList;
