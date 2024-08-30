import LearnersListItem from '@/components/LearnersListItem';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import { Role, Status, limit } from '@/utils/app.constant';
import {
  capitalizeEachWord,
  getFieldValue,
  toPascalCase,
} from '@/utils/Helper';
import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import Loader from './Loader';
import { showToastMessage } from './Toastify';
import NoDataFound from './common/NoDataFound';

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
  isLearnerAdded: boolean;
}

const CohortLearnerList: React.FC<CohortLearnerListProp> = ({
  cohortId,
  reloadState,
  setReloadState,
  isLearnerAdded,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [userData, setUserData] = React.useState<UserDataProps[]>();
  const [isLearnerDeleted, setIsLearnerDeleted] =
    React.useState<boolean>(false);

  const { t } = useTranslation();

  useEffect(() => {
    const getCohortMemberList = async () => {
      setLoading(true);
      try {
        if (cohortId) {
          const page = 0;
          const filters = { cohortId: cohortId };
          const response = await getMyCohortMemberList({
            limit,
            page,
            filters,
          });
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
  }, [cohortId, reloadState, isLearnerAdded, isLearnerDeleted]);

  const handleLearnerDelete = () => {
    setIsLearnerDeleted(true);
  };

  console.log('userData', userData);
  const theme = useTheme<any>();

  return (
    <div>
      {loading ? (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      ) : (
        <Box
          sx={{
            '@media (min-width: 900px)': {
              background: theme.palette.action.selected,
              marginTop: '12px',
              paddingBottom: '20px',
            },
          }}
        >
          <Grid container>
            {userData?.map((data: any) => {
              return (
                <Grid xs={12} sm={6} md={4} key={data.userId}>
                  <LearnersListItem
                    type={Role.STUDENT}
                    userId={data.userId}
                    learnerName={data.name}
                    enrollmentId={data.enrollmentNumber}
                    cohortMembershipId={data.cohortMembershipId}
                    isDropout={data.memberStatus === Status.DROPOUT}
                    statusReason={data.statusReason}
                    reloadState={reloadState}
                    setReloadState={setReloadState}
                    showMiniProfile={true}
                    onLearnerDelete={handleLearnerDelete}
                  />
                </Grid>
              );
            })}
            {!userData?.length && (
              <NoDataFound />
            )}
          </Grid>
        </Box>
      )}
    </div>
  );
};

export default CohortLearnerList;
