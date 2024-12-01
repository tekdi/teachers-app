import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

interface PieChartGraphProps {
  stagesCount: {
    board: number;
    subjects: number;
    registration: number;
    fees: number;
    completed: number; //completedCount = TotalCount - (board+subject+registration+fees) count
  };
}

const PieChartGraph: React.FC<PieChartGraphProps> = ({ stagesCount }) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const data: DataItem[] = [
    { name: t('BOARD_ENROLMENT.BOARD_SELECTION'), value: stagesCount.board },
    { name: t('BOARD_ENROLMENT.SUBJECTS_SELECTION'), value: stagesCount.subjects },
    { name: t('BOARD_ENROLMENT.REGISTRATION_NUMBER'), value: stagesCount.registration },
    { name: t('BOARD_ENROLMENT.FEE_PAYMENT'), value: stagesCount.fees },
    { name: t('BOARD_ENROLMENT.COMPLETED'), value: stagesCount.completed },
  ];

  const COLORS = ['#8000FE', '#FF8042', '#FFBB28', '#78590C', '#30CA2D']; //colors not in custom theme

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
      <span
        style={{
          color: isNotStarted ? 'black' : '#000000',
          fontSize: '12px',
          fontWeight: '400',
        }}
      >
        {value} ({entry.payload.value})
      </span>
    );
  };

  return (
    <Box
      sx={{
        background: '#FFF8F2',
        p: '16px',
        mt: 2,
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        borderRadius: '8px', // Optional: to make the corners rounded
        '@media (max-width: 700px)': {
          p: '16px 16px 0px',
        },
      }}
    >
      <Box
        sx={{
          color: theme.palette.warning['400'],
          fontSize: '14px',
          fontWeight: '600',
        }}
      >
        Stages and Number of Students
      </Box>

      <Box
        sx={{
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
          display: "flex",
          justifyContent: "center"
        }}
      >
        <ResponsiveContainer width="100%" style={{ maxWidth: '500px' }} height="100%">
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
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{outline: 'none'}}
                />
              ))}
            </Pie>

            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={renderLegendText}
              iconType="circle"
            />

          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>

  );
};

export default PieChartGraph;
