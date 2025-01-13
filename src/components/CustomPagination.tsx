import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


interface CustomPaginationProps {
    count: number; 
    page: number; 
    onPageChange: (value: number) => void; 
    color?: 'primary' | 'secondary' | 'standard'; 
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
    count,
    page,
    onPageChange,
    color = 'primary'
}) => {
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
