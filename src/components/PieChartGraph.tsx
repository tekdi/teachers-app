import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface DataItem {
    name: string;
    value: number;
}

const PieChartGraph = () => {
    const { t } = useTranslation();
    const theme = useTheme<any>();
    const data: DataItem[] = [
        { name: t('ASSESSMENTS.NOT_STARTED'), value: 4 },
        { name: t('BOARD_ENROLMENT.BOARD_SELECTION'), value: 5 },
        { name: t('BOARD_ENROLMENT.SUBJECTS_SELECTION'),  value: 10 },
        { name: t('BOARD_ENROLMENT.REGISTRATION_COMPLETED'),  value: 5 },
    ];


    const COLORS = ['#C0C0C0', '#8000FE', '#FF8042', '#FFBB28'];   //colors not in custom theme

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
    return (
        <>
            <Box sx={{
                background: '#FFF8F2', p: '16px', mt: 2, '@media (max-width: 700px)': {
                    p: '16px 16px 0px'
                },
            }}>
                <Box sx={{ color: theme.palette.warning['400'], fontSize: '14px', fontWeight: '600' }}>
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
                                    iconType="circle"
                                />
                            ) : (
                                <Legend
                                    layout="horizontal"
                                    align="center"
                                    verticalAlign="bottom"
                                    formatter={renderLegendText}
                                    iconType="circle"
                                />
                            )}
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </>
    )
}

export default PieChartGraph