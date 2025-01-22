import LearnersListItem from '@/components/LearnersListItem';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import useStore from '@/store/store';
import { Role, Status, limit } from '@/utils/app.constant';
import {
  toPascalCase
} from '@/utils/Helper';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import NoDataFound from './common/NoDataFound';
import Loader from './Loader';
import SearchBar from './Searchbar';
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
  isLearnerAdded: boolean;
}

const CohortLearnerList: React.FC<CohortLearnerListProp> = ({
  cohortId,
  reloadState,
  setReloadState,
  isLearnerAdded,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [userData, setUserData] = React.useState<UserDataProps[]>();
  const [filteredData, setFilteredData] = useState(userData);

  const setCohortLearnerCount = useStore((state) => state.setCohortLearnerCount);

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
            const userDetails = resp.map((user: any) => {
              const ageField = user.customField.find(
                (field: { label: string }) => field.label === 'AGE'
              );
              return {
                name: toPascalCase(user?.firstName || '') + ' ' + (user?.lastName ? toPascalCase(user.lastName) : ""),
                userId: user?.userId,
                memberStatus: user?.status,
                statusReason: user?.statusReason,
                cohortMembershipId: user?.cohortMembershipId,
                enrollmentNumber: user?.username,
                age: ageField ? ageField.value : null, // Extract age for the specific user
              };
            });
            setCohortLearnerCount(userDetails.length);
            setUserData(userDetails);
            setFilteredData(userDetails);
          }
          else{
            setUserData([]);
            setCohortLearnerCount(0)
            setFilteredData([]);
          }
        }
      } catch (error) {
        setUserData([]);
        setFilteredData([]);

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
  const handleSearch = (searchTerm: string) => {
    // const query = event.target.value.toLowerCase();
    // setSearchQuery(query);

    const filtered = userData?.filter((data) =>
    data?.name?.toLowerCase()?.includes(searchTerm) || data?.enrollmentNumber?.toLowerCase()?.includes(searchTerm)
  );
  setFilteredData(filtered);
  };
  const theme = useTheme<any>();

  return (
    <div>
      {loading ? (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      ) : (
        <>
         <SearchBar
        onSearch={handleSearch}
        value={searchTerm}
        placeholder={t('COMMON.SEARCH_STUDENT')}
      />

         <Box
          sx={{
            '@media (min-width: 900px)': {
              background: theme.palette.action.selected,
              marginTop: '12px',
              paddingBottom: '20px',
              paddingTop: '10px',

            },
          }}
        >
                  
          <Grid container>

            {filteredData?.map((data: any) => {
              return (
                <Grid xs={12} sm={12} md={6} lg={4} key={data.userId}>
                  <LearnersListItem
                    type={Role.STUDENT}
                    userId={data.userId}
                    learnerName={data.name}
                    enrollmentId={data.enrollmentNumber}
                    age={data.age}
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
            {!filteredData?.length && <NoDataFound />}
          </Grid>
        </Box></>
       
      )}
    </div>
  );
};

export default CohortLearnerList;
