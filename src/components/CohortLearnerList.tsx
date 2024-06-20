import React, { useEffect, useState } from 'react';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import {
  capitalizeEachWord,
  getFieldValue,
  toPascalCase,
} from '@/utils/Helper';
import LearnersList from '@/components/LearnersList';
import { limit } from '@/utils/app.constant';
import { showToastMessage } from './Toastify';
import { useTranslation } from 'next-i18next';
import { Box, Typography } from '@mui/material';

interface UserData {
  name: string;
  userId: string;
  memberStatus: string;
  cohortMembershipId: string;
  enrollmentNumber: string;
}

const CohortLearnerList = (cohortId: any) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [userData, setUserData] = React.useState<UserData[]>();

  const { t } = useTranslation();

  useEffect(() => {
    const getCohortMemberList = async () => {
      setLoading(true);
      try {
        if (cohortId) {
          const page = 0;
          const filters = cohortId;
          const response = await getMyCohortMemberList({
            limit,
            page,
            filters,
          });
          const resp = response?.result?.results?.userDetails;

          if (resp) {
            const userDetails = resp.map((user: any) => ({
              name: toPascalCase(user.name),
              userId: user.userId,
              memberStatus: user.memberStatus,
              cohortMembershipId: user.cohortMembershipId,
              enrollmentNumber: capitalizeEachWord(
                getFieldValue(user.customField, 'Enrollment Number')
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
  }, [cohortId]);

  return (
    <div>
      {userData?.map((userData: any) => {
        return (
          <LearnersList
            key={userData.userId}
            learnerName={userData.name}
            enrollmentId={userData.enrollmentNumber}
            isDropout={userData.memberStatus === 'dropout'}
          />
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
    </div>
  );
};

export default CohortLearnerList;
