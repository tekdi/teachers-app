"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const villagesBySection = {
    A: ["Ambade", "Angasule", "Apati"],
    B: ["Bare", "Bhairavnathnagar", "Bhambatmal"],
    C: ["Chikhalavade Kh."],
};

const totalVillages = Object.values(villagesBySection).flat().length;

const VillageSelector = () => {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState("A-Z");

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
                acc[section] = sortOrder === "A-Z" ? filteredVillages.sort() : filteredVillages.sort().reverse();
            }
            return acc;
        },
        {} as Record<string, string[]>
    );

    return (
        <Paper sx={{ width: 300, padding: 2 }}>
            <Typography variant="h6">Bhor Block</Typography>
            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search Village.."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                />
                <IconButton>
                    <SearchIcon />
                </IconButton>
            </div>
            <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                fullWidth
                size="small"
                sx={{ mt: 1, mb: 1 }}
            >
                <MenuItem value="A-Z">A-Z</MenuItem>
                <MenuItem value="Z-A">Z-A</MenuItem>
            </Select>
            <FormControlLabel
                control={<Checkbox />}
                label={`Select All (${totalVillages} Villages)`}
                onChange={() =>
                    setSelected(
                        selected.length === totalVillages ? [] : Object.values(villagesBySection).flat()
                    )
                }
                checked={selected.length === totalVillages}
            />
            {Object.entries(sortedSections).map(([section, villages]) => (
                <div key={section}>
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        {section}
                    </Typography>
                    <Divider />
                    <List>
                        {villages.map((village) => (
                            <ListItem key={village} disablePadding>
                                <ListItemButton onClick={() => handleToggle(village)}>
                                    <Checkbox checked={selected.includes(village)} />
                                    <ListItemText primary={village} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </div>
            ))}
        </Paper>
    );
};

export default VillageSelector;
