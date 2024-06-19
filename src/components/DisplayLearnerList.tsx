import React, { useEffect } from 'react';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import {
  capitalizeEachWord,
  getFieldValue,
  toPascalCase,
} from '@/utils/Helper';
import LearnersList from '@/components/LearnersList';

const DisplayLearnerList = () => {
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState<any>();
  // const classId = localStorage.getItem('classId');
  const classId = '18e800d0-11c4-4a8c-af97-8f9811976ed6'; // TODO: get userId as a prop or from localStorage dynamically

  useEffect(() => {
    const getCohortMemberList = async () => {
      setLoading(true);
      try {
        if (classId) {
          const limit = 300;
          const page = 0;
          const filters = { cohortId: classId };
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
            // console.log(`userDetails`, userDetails);
            setUserData(userDetails);
          }
        }
      } catch (error) {
        console.error('Error fetching cohort list:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getCohortMemberList();
  }, [classId]);

  return (
    <div>
        {userData &&
          userData?.map((userData: any) => {
            return (
              <LearnersList
                key={userData.userId}
                learnerName={userData.name}
                enrollmentId={userData.enrollmentNumber}
                isDropout={userData.memberStatus === 'dropout' ? true : false}
              />
            );
          })}
    </div>
  );
};

export default DisplayLearnerList;
