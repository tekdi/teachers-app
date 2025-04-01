import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LearnersListItem from '@/components/LearnersListItem';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import useStore from '@/store/store';
import { Role, Status, limit } from '@/utils/app.constant';
import { toPascalCase } from '@/utils/Helper';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import NoDataFound from './common/NoDataFound';
import Loader from './Loader';
import SearchBar from './Searchbar';
import { showToastMessage } from './Toastify';
import { searchFields } from '@/services/CohortServices';

// Define interfaces for the props and data structures
interface CustomField {
  fieldId: string;
  label: string;
  value: string | null;
}

interface UserDetails {
  name: string;
  userId: string;
  memberStatus: string;
  statusReason: string;
  cohortMembershipId: string;
  enrollmentNumber: string;
  age: string;
  customField: CustomField[];
  showSubmitFeedback: boolean;
  matchingFields: any;
}

interface CohortLearnerListProps {
  cohortId: string;
  reloadState: boolean;
  setReloadState: React.Dispatch<React.SetStateAction<boolean>>;
  isLearnerAdded: boolean;
}

const CohortLearnerList: React.FC<CohortLearnerListProps> = ({
  cohortId,
  reloadState,
  setReloadState,
  isLearnerAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<UserDetails[]>([]);
  const [filteredData, setFilteredData] = useState<UserDetails[]>([]);
  const [fieldIds, setFieldIds] = useState<string[]>([]); // Store fieldIds from the API

  const setCohortLearnerCount = useStore(
    (state) => state.setCohortLearnerCount
  );
  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    // Fetch fieldIds from the API
    const fetchFieldIds = async () => {
      try {
        const response = await searchFields({
          limit: 0,
          page: 0,
          filters: {
            context: 'COHORTMEMBER',
            contextType: 'YOUTH',
          },
        });

        const fetchedFieldIds = response.result.map(
          (field: CustomField) => field.fieldId
        );
        setFieldIds(fetchedFieldIds);
      } catch (error) {
        console.error('Error fetching fieldIds:', error);
      }
    };

    fetchFieldIds();
  }, []);

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
                (field: CustomField) => field.label === 'AGE'
              );
              const matchingFields = user.customField.filter(
                (field: CustomField) => fieldIds.includes(field.fieldId)
              );

              return {
                name:
                  toPascalCase(user?.firstName || '') +
                  ' ' +
                  (user?.lastName ? toPascalCase(user.lastName) : ''),
                userId: user?.userId,
                memberStatus: user?.status,
                statusReason: user?.statusReason,
                cohortMembershipId: user?.cohortMembershipId,
                enrollmentNumber: user?.username,
                age: ageField ? ageField.value : null, // Extract age for the specific user
                customField: user.customField,
                showSubmitFeedback: user.customField.some(
                  (field: CustomField) => fieldIds.includes(field.fieldId)
                ),
                matchingFields: matchingFields,
              };
            });
            setCohortLearnerCount(userDetails.length);
            setUserData(userDetails);
            setFilteredData(userDetails);
          } else {
            setUserData([]);
            setCohortLearnerCount(0);
            setFilteredData([]);
          }
        }
      } catch (error) {
        setUserData([]);
        setFilteredData([]);
        console.error('Error fetching cohort list:', error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      } finally {
        setLoading(false);
      }
    };

    getCohortMemberList();
  }, [cohortId, reloadState, isLearnerAdded, fieldIds]);

  const handleSearch = (searchTerm: string) => {
    const filtered = userData?.filter(
      (data) =>
        data?.name?.toLowerCase()?.includes(searchTerm) ||
        data?.enrollmentNumber?.toLowerCase()?.includes(searchTerm)
    );
    setFilteredData(filtered);
  };

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
              {filteredData?.map((data) => (
                <Grid xs={12} sm={12} md={6} lg={4} key={data.userId}>
                  <LearnersListItem
                    type={Role.STUDENT}
                    userId={data.userId}
                    learnerName={data.name}
                    age={data.age}
                    cohortMembershipId={data.cohortMembershipId}
                    isDropout={data.memberStatus === Status.DROPOUT}
                    statusReason={data.statusReason}
                    reloadState={reloadState}
                    setReloadState={setReloadState}
                    showMiniProfile={true}
                    onLearnerDelete={() => {}}
                    cohortID={cohortId}
                    showSubmitFeedback={data.showSubmitFeedback}
                    feedBackFormData={data.matchingFields}
                  />
                </Grid>
              ))}
              {!filteredData?.length && <NoDataFound />}
            </Grid>
          </Box>
        </>
      )}
    </div>
  );
};

export default CohortLearnerList;
