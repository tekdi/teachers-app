import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Divider,
    IconButton,
} from '@mui/material';
import { ChevronRight } from '@mui/icons-material';

interface Block {
    id: number;
    name: string;
    selectedCount: number;
}

interface BlockItemProps {
    name: string;
    selectedCount: number;
    onClick: () => void;
}

interface AssignVillagesProps {
    district: string;
    blocks: Block[];
    onBlockClick: (block: Block) => void;
}

const BlockItem: React.FC<BlockItemProps> = ({
    name,
    selectedCount,
    onClick,
}) => (
    <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={'10px'}
        borderRadius={2}
        border="1px solid #D0C5B4"
        sx={{
            backgroundColor: '#fff',
            cursor: 'pointer',
            marginBottom: 1,
            transition: 'background-color 0.2s ease',
            '&:hover': { backgroundColor: '#f5f5f5' },
        }}
        onClick={onClick}
    >
        <Box>
            <Typography sx={{ color:'#1F1B13', fontSize:'16px', fontWeight:'400'}}>
                {name}
            </Typography>
            <Typography sx={{ color: '#635E57', fontSize: '14px', fontWeight: '400' }} >
                {selectedCount} villages selected
            </Typography>
        </Box>
        <IconButton size="small" disableRipple>
            <ChevronRight />
        </IconButton>
    </Box>
);

// Main Component
const AssignVillages: React.FC<AssignVillagesProps> = ({
    district,
    blocks,
    onBlockClick,
}) => {
    return (
        <Box>
            <CardContent>
                <Typography
                    sx={{
                        color: '#1F1B13',
                        fontSize: '14px',
                        fontWeight: '500',
                    }}
                >
                    Assign Villages from Blocks
                </Typography>
                <Typography
                    sx={{
                        color: '#1F1B13',
                        fontSize: '14px',
                        fontWeight: '400',
                    }}
                >
                    You can complete this later at your own pace. However, the villages
                    will only be assigned once you click on ‘Finish.’
                </Typography>
               
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: '#7C766F',
                        fontSize: '14px',
                        fontWeight: '400',
                        my:1
                    }}
                    fontWeight="bold"
                    gutterBottom
                >
                    {district} District
                </Typography>
                <Box>
                    {blocks.map((block) => (
                        <BlockItem
                            key={block.id}
                            name={block.name}
                            selectedCount={block.selectedCount}
                            onClick={() => onBlockClick(block)}
                        />
                    ))}
                </Box>
            </CardContent>
        </Box>
    );
};

// Example Usage
const ExamplePage: React.FC = () => {
    const blocks: Block[] = [
        { id: 1, name: 'Ambegaon', selectedCount: 0 },
        { id: 2, name: 'Baramati', selectedCount: 0 },
        { id: 3, name: 'Bhor', selectedCount: 0 },
        { id: 4, name: 'Daund', selectedCount: 0 },
        { id: 5, name: 'Haveli', selectedCount: 0 },
        { id: 6, name: 'Indapur', selectedCount: 0 },
    ];

    const handleBlockClick = (block: Block) => {
        console.log('Clicked block:', block);
    };

    return (
        <AssignVillages
            district="Pune"
            blocks={blocks}
            onBlockClick={handleBlockClick}
        />
    );
};

export default ExamplePage;
