import LearnersListItem from '@/components/LearnersListItem';
import { getMyCohortFacilitatorList } from '@/services/MyClassDetailsService';
import { Status, limit } from '@/utils/app.constant';
import {
  capitalizeEachWord,
  getFieldValue,
  toPascalCase,
} from '@/utils/Helper';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import NoDataFound from './common/NoDataFound';
import Loader from './Loader';
import { showToastMessage } from './Toastify';

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
            const userDetails = resp.map((user: any) => {
              const ageField = user.customField.find(
                (field: { label: string }) => field.label === 'AGE'
              );
              return {
                name: toPascalCase(user?.name),
                userId: user?.userId,
                memberStatus: user?.status,
                statusReason: user?.statusReason,
                cohortMembershipId: user?.cohortMembershipId,
                enrollmentNumber: user?.username,
                age: ageField ? ageField.value : null, // Extract age for the specific user
              };
            });

            console.log(`userDetails`, userDetails);
            setUserData(userDetails);
          }
          else
          {
            setUserData([]);
          }
        }
      } catch (error) {
        setUserData([]);

        console.error('Error fetching cohort list:', error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getCohortMemberList();
  }, [cohortId, reloadState]);

  const onDelete = () => {};

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
              paddingBottom: '20px',
            },
          }}
        >
          <Grid container>
            {userData?.map((data: any) => {
              return (
                <Grid xs={12} sm={12} md={6} lg={4} key={data.userId}>
                  <LearnersListItem
                    userId={data.userId}
                    learnerName={data.name}
                    enrollmentId={data.enrollmentNumber}
                    age={data.age}
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
            {!userData?.length && <NoDataFound />}
          </Grid>
        </Box>
      )}
    </div>
  );
};

export default CohortLearnerList;
