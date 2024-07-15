import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel} from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'next-i18next';

const regularData = [
  { name: 'Khasala', Attendance: 8 },
  { name: 'Koradi', Attendance: 84 },
  { name: 'Neri', Attendance: 74 },
  { name: 'Palsal', Attendance: 85 },
  { name: 'Wadoda', Attendance: 86 },
  
];

const remoteData = [
  { name: 'Khasala', Attendance: 75 },
  { name: 'Koradi', Attendance: 70 },
  { name: 'Neri', Attendance: 65 },
  { name: 'Palsal', Attendance: 80 },
  { name: 'Wadoda', Attendance: 90 },
];

const AttendanceComparison: React.FC = () => {
  const { t } = useTranslation();
  const [centerType, setCenterType] = useState('Regular');
  const data = centerType === 'Regular' ? regularData : remoteData;

  const handleCenterTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCenterType(event.target.value);
  };

  const renderCustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text x={x + width + 5} y={y + 5} fill="#000" textAnchor="start" dominantBaseline="middle">
        {value}%
      </text>
    );
  };

  return (
    <Box  sx={{ padding: 2, borderRadius: 5 , border: '1px solid #D0C5B4' , marginTop: '20px'}} >
       <Typography variant="h2" fontSize={'16px'} sx={{color: 'black'}} >{t('DASHBOARD.ATTENDANCE_COMPARISON')}</Typography>
      <FormControl component="fieldset" >
        <Typography  fontSize={'12px'} mt={2}>{t('DASHBOARD.CENTER_TYPE')}</Typography>
        <RadioGroup row aria-label="center type" name="centerType" value={centerType} onChange={handleCenterTypeChange}  >
          <FormControlLabel value="Regular" control={<Radio />} label="Regular"/>
          <FormControlLabel value="Remote" control={<Radio />} label="Remote" />
        </RadioGroup>
      </FormControl>
      <Box sx={{ mt: 2 }}  >
        <Typography align="left">{t('DASHBOARD.BLOCK_AVERAGE_ATTENDANCE')}: 76%</Typography>
        <ResponsiveContainer width="100%" height={400} >
          <BarChart
          
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis type="number" tickFormatter={(value: any) => `${value}%`} />
            <YAxis type="category" dataKey="name" />
            <Tooltip  formatter={(value: number) => `${value}`} />
            <Legend />
            <Bar dataKey="Attendance" fill="#DAA520"  barSize={35} radius={2}>
              <LabelList dataKey="Attendance" content={renderCustomLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default AttendanceComparison;
