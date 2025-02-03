'use client';

import React, { useState } from 'react';
import {
    TextField,
    Checkbox,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Paper,
    Typography,
    IconButton,
    Divider,
    MenuItem,
    Select,
    Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const villagesBySection = {
    A: ['Ambade', 'Angasule', 'Apati'],
    B: ['Bare', 'Bhairavnathnagar', 'Bhambatmal'],
    C: ['Chikhalavade Kh.'],
};

const totalVillages = Object.values(villagesBySection).flat().length;

const VillageSelector = () => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState('A-Z');

    const handleToggle = (village: string) => {
        setSelected((prev: string[]) =>
            prev.includes(village)
                ? prev.filter((item) => item !== village)
                : [...prev, village]
        );
    };

    const sortedSections = Object.entries(villagesBySection).reduce(
        (acc, [section, villages]) => {
            const filteredVillages = villages.filter((village) =>
                village.toLowerCase().includes(search.toLowerCase())
            );
            if (filteredVillages.length) {
                acc[section] =
                    sortOrder === 'A-Z'
                        ? filteredVillages.sort()
                        : filteredVillages.sort().reverse();
            }
            return acc;
        },
        {} as Record<string, string[]>
    );

    const handleSelectAll = () => {
        setSelected(
            selected.length === totalVillages
                ? []
                : Object.values(villagesBySection).flat()
        );
    };

    return (
        <Box>
            <Box
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#EDEDED',
                    borderRadius: '28px',
                    padding: '4px 12px',
                    width: '100%',
                }}
            >
                <TextField
                    variant="standard"
                    size="small"
                    placeholder="Search Village.."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        disableUnderline: true,
                        style: {
                            fontSize: '14px',
                            fontWeight: '400',
                            color: '#4D4639',
                            padding: '4px',
                        },
                    }}
                    fullWidth
                />
                <IconButton>
                    <SearchIcon style={{ color: '#4D4639' }} />
                </IconButton>
            </Box>
            <Box
                sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    sx={{ color: '#1F1B13', fontWeight: '500', fontSize: '14px' }}
                    variant="h6"
                >
                    Bhor Block
                </Typography>
                <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ mt: 1, mb: 1, maxWidth: '100px' }}
                >
                    <MenuItem
                        sx={{ color: '#4D4639', fontWeight: '500', fontSize: '14px' }}
                        value="A-Z"
                    >
                        A-Z
                    </MenuItem>
                    <MenuItem
                        sx={{ color: '#4D4639', fontWeight: '500', fontSize: '14px' }}
                        value="Z-A"
                    >
                        Z-A
                    </MenuItem>
                </Select>
            </Box>

            <Box
                sx={{
                    backgroundColor: '#F8EFE7',
                    padding: '0px 8px',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                }}
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={selected.length === totalVillages}
                            onChange={handleSelectAll}
                            sx={{
                                '&.MuiCheckbox-root': {
                                    color: '#5a5a5a',
                                },
                                '&.Mui-checked': {
                                    color: '#5a5a5a',
                                },
                            }}
                        />
                    }
                    label={`Select All (${totalVillages} Villages)`}
                    labelPlacement="start" // Moves the label to the left of the checkbox
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        ml: 0, // Ensures margin-left is 0
                        '& .MuiFormControlLabel-label': {
                            fontSize: '14px',
                            color: '#5a5a5a',
                            fontWeight: 500,
                        },
                    }}
                />
            </Box>
            {Object.entries(sortedSections).map(([section, villages]) => (
                <Box>
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        {section}
                    </Typography>
                    <List sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {villages.map((village) => (
                            <ListItem
                                key={village}
                                disablePadding
                                sx={{
                                    width: 'auto',
                                    bgcolor: selected.includes(village) ? '#FDBE16' : 'transparent',
                                    border: '1px solid',
                                    borderColor: selected.includes(village) ? '#FDBE16' : '#DADADA',
                                    borderRadius: "8px",
                                    px: 1,
                                    "&:hover": { backgroundColor: "transparent" } // Prevent hover effect
                                }}
                            >
                                <ListItemButton
                                    onClick={() => handleToggle(village)}
                                    disableRipple // Disable Material UI ripple effect
                                    sx={{
                                        padding: 0,
                                        color: selected.includes(village) ? 'black' : 'inherit',
                                        "&:hover": { backgroundColor: "transparent" } // Prevent hover effect
                                    }}
                                >
                                    <Checkbox
                                        checked={selected.includes(village)}
                                        disableRipple // Disable ripple effect
                                        sx={{
                                            color: 'black',
                                            '&.Mui-checked': { color: 'black' },
                                            "&:hover": { backgroundColor: "transparent" } // Prevent hover effect
                                        }}
                                    />
                                    <ListItemText
                                        primary={village}
                                        primaryTypographyProps={{
                                            sx: {
                                                color: selected.includes(village) ? 'black' : 'inherit',
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            ))}
        </Box>
    );
};

export default VillageSelector;
