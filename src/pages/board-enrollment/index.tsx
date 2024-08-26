import Header from '@/components/Header';
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, Grid, IconButton, InputBase, MenuItem, Paper, Select, Step, StepLabel, Stepper } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface DataItem {
    name: string;
    value: number;
}

const BoardEnrollment = () => {
    const theme = useTheme<any>();
    const { t } = useTranslation();

    const data: DataItem[] = [
        { name: 'Not Started', value: 4 },
        { name: 'Board Selection', value: 5 },
        { name: 'Subjects Selection', value: 10 },
        { name: 'Registration Completed', value: 5 },
    ];

    const COLORS = ['#C0C0C0', '#8000FE', '#FF8042', '#FFBB28'];

    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 700);
        };

        handleResize(); // Check initial size
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderLegendText = (value: string, entry: any) => {
        const isNotStarted = value === 'Not Started';
        return (
            <span style={{ color: isNotStarted ? 'black' : '#000000', fontSize: '12px', fontWeight: '400' }}>
                {value} ({entry.payload.value})
            </span>
        );
    };


    const steps = [
        'Select master blaster campaign settings',
        'Create an ad group',
        'Create an ad',
    ];

    return (
        <>
            <Header />

            <Box sx={{ px: '16px', color: '#4D4639', fontSize: '22px', fontWeight: '400', mt: 3 }}>
                Board Enrollment
            </Box>

            <Grid container>
                <Grid item xs={12} md={8} lg={6}>
                    <Box sx={{ px: '16px', mt: 2 }}>
                        <Paper
                            component="form"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '100px',
                                background: theme.palette.warning.A700,
                                boxShadow: 'none',
                            }}
                        >
                            <InputBase
                                sx={{ ml: 3, flex: 1, mb: '0', fontSize: '14px' }}
                                placeholder={t('COMMON.SEARCH_STUDENT') + '..'}
                                inputProps={{ 'aria-label': 'search student' }}
                            />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ px: '16px' }}>
                <Grid container sx={{ mt: '20px' }}>
                    <Grid item xs={8}>
                        <Box>
                            <FormControl className="drawer-select" sx={{ width: '100%' }}>
                                <Select
                                    displayEmpty
                                    style={{
                                        borderRadius: '0.5rem',
                                        color: theme.palette.warning['200'],
                                        width: '100%',
                                        marginBottom: '0rem',
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>All Centers</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={4} item>
                        <Button
                            sx={{
                                color: theme.palette.warning.A200,
                                borderRadius: '10px',
                                fontSize: '14px',
                            }}
                            endIcon={<ArrowDropDownSharpIcon />}
                            size="small"
                            variant="outlined"
                        >
                            {t('COMMON.SORT_BY')}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{
                background: '#FFF8F2', p: '16px', mt: 2, '@media (max-width: 700px)': {
                    p: '16px 16px 0px'
                },
            }}>
                <Box sx={{ color: '#7C766F', fontSize: '14px', fontWeight: '600' }}>
                    Stages and Number of Students
                </Box>

                <Box sx={{
                    height: 150,
                    '@media (min-width: 400px)': {
                        height: 200,
                    },
                    '@media (min-width: 500px)': {
                        height: 300,
                    },
                    '@media (min-width: 700px)': {
                        height: 400,
                    },
                }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={false}
                                outerRadius="80%"
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>

                            {isMobile ? (
                                <Legend
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"
                                    formatter={renderLegendText}
                                    iconType="circle" // Change this line to make the legend icon circular
                                />
                            ) : (
                                <Legend
                                    layout="horizontal"
                                    align="center"
                                    verticalAlign="bottom"
                                    formatter={renderLegendText}
                                    iconType="circle" // Change this line to make the legend icon circular
                                />
                            )}
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Box>


            <Box sx={{ mt: 2 }}>
                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={0} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Box>
        </>
    );
};

export async function getStaticProps({ locale }: any) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

export default BoardEnrollment;
