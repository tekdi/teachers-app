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
  useMediaQuery,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import useStore from '../store/store';
import { useTheme } from '@mui/material/styles';
import { overallAttendanceInPercentageStatusList } from '@/services/AttendanceService';
import { CenterType, cohortPrivileges } from '@/utils/app.constant';
import { toPascalCase } from '@/utils/Helper';
import NoDataFound from './common/NoDataFound';
import { useDirection } from '../hooks/useDirection';

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
  const isMobile = useMediaQuery('(max-width:600px)');
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>(
    {}
  );
  const [averageAttendance, setAverageAttendance] = useState(0);
  const store = useStore();
  const theme = useTheme<any>();
  const scope = cohortPrivileges?.STUDENT;
  const { dir, isRTL } = useDirection();

  const handleCenterTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCenterType(event.target.value);
  };

  useEffect(() => {
    const cohortIds =
      store?.cohorts
        ?.filter((item: Cohort) => item?.cohortType === centerType)
        .map((pair: Cohort) => pair?.cohortId) || [];

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
        name: toPascalCase(pair?.name),
        Attendance: Number(attendanceData[pair?.cohortId]) || 0,
      })) || [];

  const YAxisLabel = (value: any) => {
    let maxLength = 25;
    value = toPascalCase(value);

    if (isMobile) {
      maxLength = 6;
    }

    const formattedValue =
      value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

    // Return a plain string, not a React element
    return formattedValue;
  };

  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    const offsetX = width < 40 ? width + 5 : width / 2; // Adjust position based on bar width
    return (
      <text
        x={x + offsetX}
        y={y + height / 2}
        fill={theme.palette.warning['300']}
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
      <Typography
        variant="h2"
        fontSize={'16px'}
        sx={{ color: theme.palette.warning['300'] }}
      >
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
            color={theme.palette.warning['300']}
            value="REGULAR"
            control={
              <Radio
                sx={{
                  '&.Mui-checked': {
                    color: theme.palette.warning['300'],
                  },
                }}
              />
            }
            label={t('CENTERS.REGULAR')}
            sx={{
              '& .MuiFormControlLabel-label': {
                color: theme.palette.warning['300'],
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
                    color: theme.palette.warning['300'],
                  },
                }}
              />
            }
            label={t('CENTERS.REMOTE')}
            sx={{
              '& .MuiFormControlLabel-label': {
                color: theme.palette.warning['300'],
                fontSize: '18px',
              },
            }}
          />
        </RadioGroup>
      </FormControl>
      {data?.length > 0 && (
        <>
          <Box sx={{ mt: 2 }}>
            <Typography
              align="left"
              sx={{ marginBottom: '16px', fontSize: '15px' }}
            >
              {centerType === CenterType.REMOTE
                ? t('DASHBOARD.REMOTE_AVERAGE_ATTENDANCE')
                : t('DASHBOARD.REGULAR_AVERAGE_ATTENDANCE')}
              : {averageAttendance.toFixed(2)}%
            </Typography>
          </Box>
          <Box sx={{ maxHeight: '400px', overflowY: 'scroll' }}>
            <ResponsiveContainer width="100%" height={data.length * 70}>
              <BarChart
                layout="vertical"
                data={data}
                margin={{
                  top: 5,
                  left: isMobile ? 0 : isRTL ? 0 : 70,
                  right: isMobile ? 0 : isRTL ? 70 : 5,
                  // right: isMobile ? 0 : 5,
                }}
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <CartesianGrid
                  stroke={theme.palette.warning.A700}
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tickFormatter={(value: any) => `${value}%`}
                  height={0}
                  reversed={isRTL ? true : false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickFormatter={YAxisLabel}
                  tick={{
                    fontSize: 12,
                    width: isMobile ? 50 : 100,
                    ...(isRTL ? { textAnchor: 'end' } : {}),
                  }}
                  orientation={isRTL ? 'right' : 'left'}
                />

                <Tooltip formatter={(value: number) => `${value}%`} />
                <Bar
                  dataKey="Attendance"
                  fill="#DAA200"
                  barSize={40}
                  radius={2}
                >
                  <LabelList dataKey="Attendance" content={renderCustomLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <ResponsiveContainer width="100%" height={32}>
            <BarChart
              layout="vertical"
              data={[{ name: '', Attendance: 0 }]}
              margin={{ left: isMobile ? 60 : 130, right: isMobile ? 0 : 5 }}
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              <XAxis
                type="number"
                // tickFormatter={(value: any) => `${value}`}
                domain={[0, 100]}
              />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <LabelList dataKey="Attendance" content={renderCustomLabel} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography color={theme.palette.warning['300']} mt={1}>
              {t('DASHBOARD.ATTENDANCE')}
            </Typography>
          </Box>
        </>
      )}

      {data?.length === 0 && <NoDataFound />}
    </Box>
  );
};

export default AttendanceComparison;
