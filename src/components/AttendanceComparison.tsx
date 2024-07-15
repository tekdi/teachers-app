import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  Box,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import useStore from '../store/store';
import { useTheme } from '@mui/material/styles';

const AttendanceComparison: React.FC = () => {
  const { t } = useTranslation();
  const [centerType, setCenterType] = useState('Regular');
  const store = useStore();
  const theme = useTheme<any>();

  const handleCenterTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCenterType(event.target.value);
  };

  const data = store?.pairs?.filter((pair: { cohortType: string }) => pair?.cohortType === centerType)
    .map((pair: { name: any }) => ({
      name: pair.name,
      Attendance: Math.floor(Math.random() * 100),
    }));

  const renderCustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width + 5}
        y={y + 5}
        fill="#000"
        textAnchor="start"
        dominantBaseline="middle"
      >
        {value}%
      </text>
    );
  };

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 5,
        border: '1px solid #D0C5B4',
        marginTop: '20px',
      }}
    >
      <Typography variant="h2" fontSize={'16px'} sx={{ color: 'black' }}>
        {t('DASHBOARD.ATTENDANCE_COMPARISON')}
      </Typography>
      <FormControl component="fieldset">
        <Typography fontSize={'12px'} mt={2}>
          {t('DASHBOARD.CENTER_TYPE')}
        </Typography>
        <RadioGroup
          row
          aria-label="center type"
          name="centerType"
          value={centerType}
          onChange={handleCenterTypeChange}
        >
          <FormControlLabel
            value="Regular"
            control={<Radio />}
            label="Regular"
          />
          <FormControlLabel value="Remote" control={<Radio />} label="Remote" />
        </RadioGroup>
      </FormControl>
      <Box sx={{ mt: 2 }}>
        <Typography align="left">
          {t('DASHBOARD.BLOCK_AVERAGE_ATTENDANCE')}: 76%
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke={theme.palette.warning.A700} />
            <XAxis type="number" tickFormatter={(value: any) => `${value}%`} />
            <YAxis type="category" dataKey="name" />
            <Tooltip formatter={(value: number) => `${value}`} />
            <Legend />
            <Bar dataKey="Attendance" fill={theme.palette.primary.main} barSize={35} radius={2}>
              <LabelList dataKey="Attendance" content={renderCustomLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default AttendanceComparison;
