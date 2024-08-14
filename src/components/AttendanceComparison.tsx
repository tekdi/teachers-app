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
import { overallAttendanceInPercentageStatusList } from '@/services/AttendanceService';
import { CenterType, cohortPrivileges } from '@/utils/app.constant';

interface AttendanceComparisonProps {
  blockName: string;
}

interface Cohort {
  cohortId: string;
  cohortType: string;
  name: string;
}

interface AttendanceResult {
  present_percentage?: string;
  absent_percentage?: string;
  present?: number;
  absent?: number;
}

interface AttendanceResponse {
  statusCode: number;
  message: string;
  data: {
    result: {
      contextId: {
        [key: string]: AttendanceResult;
      };
    };
  };
}

const AttendanceComparison: React.FC<AttendanceComparisonProps> = ({
  blockName,
}) => {
  const { t } = useTranslation();
  const [centerType, setCenterType] = useState('REGULAR');
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>(
    {}
  );
  const [averageAttendance, setAverageAttendance] = useState(0);
  const store = useStore();
  const theme = useTheme<any>();
  const scope = cohortPrivileges?.STUDENT;

  const handleCenterTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCenterType(event.target.value);
  };

  useEffect(() => {
    const cohortIds =
      store?.cohorts?.filter((item: Cohort) => item?.cohortType === centerType).map((pair: Cohort) => pair?.cohortId) || [];

    const fetchData = async () => {
      const promises = cohortIds?.map((cohortId: string) =>
        overallAttendanceInPercentageStatusList({
          limit: 0,
          page: 0,
          filters: { contextId: cohortId, scope },
          facets: ['contextId'],
        })
      );

      const results: AttendanceResponse[] = await Promise.all(promises);
      const dataMap: Record<string, string> = {};

      results.forEach((result) => {
        if (result?.statusCode === 200 && result?.data?.result?.contextId) {
          Object.keys(result?.data?.result?.contextId).forEach((id) => {
            dataMap[id] =
              result?.data?.result?.contextId[id]?.present_percentage ?? '0';
          });
        }
      });

      setAttendanceData(dataMap);

      const totalAttendance = Object.values(dataMap).reduce(
        (acc, curr) => acc + parseFloat(curr),
        0
      );
      const average =
        cohortIds.length > 0 ? totalAttendance / cohortIds.length : 0;
      setAverageAttendance(average);
    };

    fetchData();
  }, [store?.cohorts, scope, centerType]);

  const data =
    store?.cohorts
      ?.filter((pair: Cohort) => pair?.cohortType === centerType)
      .map((pair: Cohort) => ({
        name: pair.name,
        Attendance: Number(attendanceData[pair?.cohortId]) || 0,
      })) || [];

  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    const offsetX = width < 40 ? width + 5 : width / 2; // Adjust position based on bar width
    return (
      <text
        x={x + offsetX}
        y={y + height / 2}
        fill="black"
        textAnchor={width < 40 ? 'start' : 'middle'} // Adjust anchor based on bar width
        dominantBaseline="middle"
        fontSize={15}
        fontWeight="bold" // Make the font bold
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
        marginTop: '10px',
      }}
    >
      <Typography variant="h2" fontSize={'16px'} sx={{ color: 'black' }}>
        {t('DASHBOARD.ATTENDANCE_COMPARISON')}
      </Typography>
      <Typography fontSize={'14px'}>
        {blockName} {t('DASHBOARD.BLOCK')}
      </Typography>
      <FormControl component="fieldset">
        <Typography fontSize={'14px'} mt={2}>
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
          color="black"
          value="REGULAR"
          control={
            <Radio
              sx={{
                '&.Mui-checked': {
                  color: 'black',
                },
              }}
            />
          }
          label="Regular"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: 'black',
              fontSize: '18px',
            },
          }}
        />
        <FormControlLabel
          value="REMOTE"
          control={
            <Radio
              sx={{
                '&.Mui-checked': {
                  color: 'black',
                },
              }}
            />
          }
          label="Remote"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: 'black',
              fontSize: '18px',
            },
          }}
        />
      </RadioGroup>
      <Box sx={{ mt: 2 }}>
        <Typography align="left" sx={{ marginBottom: '16px', fontSize: '15px'}}>
          {centerType === CenterType.REMOTE
            ? t('DASHBOARD.REMOTE_AVERAGE_ATTENDANCE')
            : t('DASHBOARD.REGULAR_AVERAGE_ATTENDANCE')}
          : {averageAttendance.toFixed(2)}%
        </Typography>
      </Box>
    </FormControl>
        <Box sx={{ height: '400px', overflowY: 'scroll' }}>
          <ResponsiveContainer width="100%" height={data.length * 70}>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, left: 15 }}
            >
              <CartesianGrid
                stroke={theme.palette.warning.A700}
                horizontal={false}
              />
              <XAxis
                type="number"
                tickFormatter={(value: any) => `${value}%`}
                height={0}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={(props) => {
                  const { x, y, payload } = props;
                  const name = payload.value;
                  const firstLine = name.slice(0, 7);
                  const secondLine = name.slice(7, 13);
                  const thirdLine = name.slice(13, 19);
                  const capitalizedFirstLine =
                    firstLine.charAt(0).toUpperCase() + firstLine.slice(1);

                  return (
                    <text
                      x={x}
                      y={y}
                      dy={4} 
                      textAnchor="end"
                      fontSize={16} 
                      fill="gray" 
                    >
                      <tspan x={x} dy="0em">
                        {capitalizedFirstLine}
                      </tspan>
                      {secondLine && (
                        <tspan x={x} dy="1.3em">
                          {secondLine}
                        </tspan>
                      )}
                      {thirdLine && (
                        <tspan x={x} dy="1.3em">
                          {thirdLine}
                        </tspan>
                      )}
                    </text>
                  );
                }}
              />

              <Tooltip formatter={(value: number) => `${value}%`} />
              <Bar dataKey="Attendance" fill="#DAA200" barSize={40} radius={2}>
                <LabelList dataKey="Attendance" content={renderCustomLabel} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <ResponsiveContainer width="100%" height={32}>
          <BarChart
            layout="vertical"
            data={[{ name: '', Attendance: 0 }]}
            margin={{ left: 75 }}
          >
            <XAxis
              type="number"
              tickFormatter={(value: any) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip formatter={(value: number) => `${value}%`} />
            <LabelList dataKey="Attendance" content={renderCustomLabel} />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography color="black" mt={1}>
            {t('DASHBOARD.ATTENDANCE')}
          </Typography>
        </Box>
      </Box>
    
  );
};

export default AttendanceComparison;
