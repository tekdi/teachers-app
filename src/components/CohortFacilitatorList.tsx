import LearnersListItem from '@/components/LearnersListItem';
import { getMyCohortFacilitatorList } from '@/services/MyClassDetailsService';
import useStore from '@/store/store';
import { Status, limit } from '@/utils/app.constant';
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
import { useMediaQuery } from '@mui/material';
import CustomPagination from './CustomPagination';

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
  const theme = useTheme<any>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = React.useState<boolean>(false);
  const [userData, setUserData] = React.useState<UserDataProps[]>();

  const [filteredData, setFilteredData] =  React.useState(userData);
  const [searchTerm, setSearchTerm] =  React.useState('');
  const setCohortFacilitatorsCount = useStore((state) => state.setCohortFacilitatorsCount);


  const [page, setPage] = useState(0);
  const [infinitePage, setInfinitePage] = useState(1);
  const [infiniteData, setInfiniteData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);



  const { t } = useTranslation();

  useEffect(() => {
    const getCohortMemberList = async () => {
      if (!isMobile) {
        setLoading(true);
      }
      try {
        if (cohortId) {
          const filters = { cohortId: cohortId };
          const response = await getMyCohortFacilitatorList({
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
                name: toPascalCase(user?.name),
                userId: user?.userId,
                memberStatus: user?.status,
                statusReason: user?.statusReason,
                cohortMembershipId: user?.cohortMembershipId,
                enrollmentNumber: user?.username,
                age: ageField ? ageField.value : null,
              };
            });

            if (isMobile) {
              setInfiniteData([...infiniteData, ...userDetails]);
              setFilteredData(userDetails);
              
            } else {
              setUserData(userDetails);
              setFilteredData(userDetails);
              setInfiniteData(userDetails);
            }
           

            setTotalCount(response.result?.totalCount);
            setCohortFacilitatorsCount(userDetails.length);
          } else {
            setUserData([]);
            setFilteredData([]);
            setCohortFacilitatorsCount(0);
          }
        }
      } catch (error) {
        console.error('Error fetching cohort list:', error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      } finally {
        setLoading(false);
      }
    };

    getCohortMemberList();
  }, [cohortId, reloadState, page, infinitePage]);

  const onDelete = () => {};
  const handleSearch = (searchTerm: string) => {
    

    const filtered = userData?.filter((data) =>
    data?.name?.toLowerCase()?.includes(searchTerm) || data?.enrollmentNumber?.toLowerCase()?.includes(searchTerm)
  );
  setFilteredData(filtered);
  };

  const PAGINATION_CONFIG = {
    ITEMS_PER_PAGE: 10,
    INFINITE_SCROLL_INCREMENT: 10,
  };

  const fetchData = async () => {
    try {
      setInfinitePage(
        (prev) => prev + PAGINATION_CONFIG.INFINITE_SCROLL_INCREMENT
      );
    } catch (error) {
      console.error('Error fetching more data:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    }
  };
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  
  return (
    <div>
      {loading ? (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      ) : (
        <>
        <Box mb="25px">
        <SearchBar
        onSearch={handleSearch}
        value={searchTerm}
        placeholder={t('COMMON.SEARCH_FACILITATORS')}
      />
        </Box>
         
         <Box
          sx={{
            '@media (min-width: 900px)': {
              background: theme.palette.action.selected,
              paddingBottom: '20px',
              paddingTop: '10px',
            },
          }}
        >
         
          
          
          <Grid container>
            {(isMobile ? infiniteData : filteredData)?.map((data: any) => {
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
                {(isMobile ? !infiniteData.length : !filteredData?.length) && <NoDataFound />}
          </Grid>
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'end',
                }}
              >
                {
                  (isMobile ? infiniteData.length > 10 : (filteredData && filteredData?.length > 10)) && (
                    <CustomPagination
                      count={Math.ceil(totalCount / PAGINATION_CONFIG.ITEMS_PER_PAGE)}
                      page={page + 1}
                      onPageChange={handlePageChange}
                      fetchMoreData={fetchData}
                      hasMore={infinitePage * limit < totalCount}
                      items={(infiniteData || []).map((user: UserDataProps) => (
                        <Box key={user.userId}></Box>
                      ))}
                    />
                  )
                }
                
              </Box>

        </Box></>
       
      )}
    </div>
  );
};

export default CohortLearnerList;
