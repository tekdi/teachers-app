import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import InfiniteScroll from 'react-infinite-scroll-component';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface CustomPaginationProps {
    count: number;
    page: number;
    onPageChange: (value: number) => void;
    color?: 'primary' | 'secondary' | 'standard';
    fetchMoreData?: () => void;
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
    items = [],
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        return (
            <InfiniteScroll
                dataLength={items.length}
                next={fetchMoreData || (() => { })}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>You have seen all data!</p>
                }
            >
                <></>
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
