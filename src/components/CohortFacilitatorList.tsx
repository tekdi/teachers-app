import LearnersListItem from '@/components/LearnersListItem';
import { getMyCohortFacilitatorList } from '@/services/MyClassDetailsService';
import useStore from '@/store/store';
import { Status, pagesLimit } from '@/utils/app.constant';
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
  const [resData, setResData] = React.useState<UserDataProps[]>();
  console.log(userData);

  const [filteredData, setFilteredData] =  React.useState(userData);
  const [searchTerm, setSearchTerm] =  React.useState('');
  const setCohortFacilitatorsCount = useStore((state) => state.setCohortFacilitatorsCount);


  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);

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
          const filters = {
            cohortId: cohortId,
          };
          const limit = pagesLimit;
          const page = offset;

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
                name: toPascalCase(user?.firstName || '') + ' ' + (user?.lastName ? toPascalCase(user.lastName) : ""),
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
              setUserData([...infiniteData, ...userDetails]);

            } else {
              setUserData(userDetails);
              setFilteredData(userDetails);
              setInfiniteData(userDetails);
              setOffset(0);
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
  

 
  
  const PAGINATION_CONFIG = {
    ITEMS_PER_PAGE: pagesLimit,
    INFINITE_SCROLL_INCREMENT: pagesLimit,
  };

  const fetchData = async () => {
    setUserData(resData);
    setFilteredData(resData);
    if (infiniteData && (infiniteData.length >= totalCount)) {
      return;
    }
    try {
      setOffset((prev) => {
        if (totalCount && prev + PAGINATION_CONFIG.ITEMS_PER_PAGE <= totalCount) {
          return prev + PAGINATION_CONFIG.ITEMS_PER_PAGE;
        }
        return prev;
      });
      setInfinitePage((prev) => prev + PAGINATION_CONFIG.INFINITE_SCROLL_INCREMENT);
    } catch (error) {
      console.error('Error fetching more data:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    }
  }
  const handleSearch = async (searchTerm: string) => {
    const filtered = userData?.filter((data) =>{
      return data?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || data?.enrollmentNumber?.toLowerCase()?.includes(searchTerm)
    }
    );
    // const filters = {
    //   cohortId: cohortId,
    //   firstName: searchTerm
    // };
    // const limit = pagesLimit;
    // const page = offset;
    // const response = await getMyCohortFacilitatorList({
    //   limit,
    //   page,
    //   filters,
    // });

    setUserData(resData || []);
    setFilteredData(resData || []);

  };

  const handlePageChange = (newPage: number) => {
    if (!isMobile) {
      
      setPage(newPage);
    }
    setOffset((newPage - 1) * PAGINATION_CONFIG.ITEMS_PER_PAGE)
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
               
                 
                    <CustomPagination
                      count={Math.ceil(totalCount / PAGINATION_CONFIG.ITEMS_PER_PAGE)}
                      page={page }
                      onPageChange={handlePageChange}
                      fetchMoreData={() => fetchData()}
                      hasMore={hasMore}
                      TotalCount={totalCount}
                      items={infiniteData.map((user) => (
                        <Box key={user.userId}></Box>
                      ))}
                    />
                  
                
                
              </Box>

        </Box></>
       
      )}
    </div>
  );
};

export default CohortLearnerList;
