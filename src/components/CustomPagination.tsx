import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'next-i18next';


interface CustomPaginationProps {
    count: number;
    page: number;
    onPageChange: (value: number) => void;
    color?: 'primary' | 'secondary' | 'standard';
    fetchMoreData?: () => void;
    TotalCount:number;
    hasMore?: boolean;
    items?: React.ReactNode[]; // Items to display in infinite scroll
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
    count,
    page,
    onPageChange,
    color = 'primary',
    fetchMoreData,
    hasMore = true,
    TotalCount=0,
    items = [],
}) => {


    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { t } = useTranslation();

    if (isMobile) {
        return (
            <InfiniteScroll
                dataLength={items.length}
                next={fetchMoreData || (() => { 
                    console.warn('fetchMoreData callback is required for infinite scroll');
                })}
                hasMore={hasMore}
                loader={items?.length >= TotalCount ? '' : <h4>{t('COMMON.LOADING')}...</h4>}
                // endMessage={
                //     <p style={{ textAlign: 'center' }}>You have seen all data!</p>
                // }
            >
                {null}
            </InfiniteScroll>
        );
    }

    return (
        <Stack spacing={2} alignItems="center">
            <Pagination
                count={count}
                page={page}
                onChange={(event, value) => onPageChange(value)}
                color={color}
            />
        </Stack>
    );
};

export default CustomPagination;
