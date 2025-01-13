import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
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
import { CenterType, Status, Telemetry, cohortPrivileges } from '@/utils/app.constant';
import { toPascalCase } from '@/utils/Helper';
import NoDataFound from './common/NoDataFound';
import { useDirection } from '../hooks/useDirection';
import { AttendanceAPILimit } from '../../app.config';
import { telemetryFactory } from '@/utils/telemetry';

interface AttendanceComparisonProps {
  blockName: string;
}

interface Cohort {
  cohortId: string;
  cohortType: string;
  name: string;
  status?: string;
}

interface AttendanceResult {
  present_percentage?: string;
  absent_percentage?: string;
  present?: number;
  absent?: number;
}

interface AttendanceResponse {
  responseCode?: number;
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
  const { isRTL } = useDirection();

  const handleCenterTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCenterType(event.target.value);

    const telemetryInteract = {
      context: {
        env: 'dashboard',
        cdata: [],
      },
      edata: {
        id: 'center-type-selection: ' + event.target.value,
        type: Telemetry.CLICK,
        subtype: '',
        pageid: 'dashboard',
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  useEffect(() => {
    const cohortIds =
      store?.cohorts
        ?.filter((item: Cohort) => item?.cohortType === centerType)
        .map((pair: Cohort) => pair?.cohortId) || [];

    const fetchData = async () => {
      const promises = cohortIds?.map((cohortId: string) =>
        overallAttendanceInPercentageStatusList({
          limit: AttendanceAPILimit,
          page: 0,
          filters: { contextId: cohortId, scope },
          facets: ['contextId'],
        })
      );

      const results: AttendanceResponse[] = await Promise.all(promises);
      const dataMap: Record<string, string> = {};

      results.forEach((result) => {
        if (result?.responseCode === 200 && result?.data?.result?.contextId) {
          Object.keys(result?.data?.result?.contextId).forEach((id) => {
            dataMap[id] =
              result.data.result.contextId[id]?.present_percentage ?? '0';
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
      ?.filter(
        (pair: Cohort) =>
          pair?.cohortType === centerType && pair?.status === Status.ACTIVE
      )
      .map((pair: Cohort) => ({
        name: toPascalCase(pair?.name),
        Attendance: Number(attendanceData[pair?.cohortId]) || 0,
      })) || [];

  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#DAA200"
          rx={4}
        />
        <text
          x={isRTL ? x + width / 2 - 15 : x + width / 2 + 15}
          y={y + height / 2}
          fill="black"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={15}
          fontWeight="bold"
        >
          {value}%
        </text>
      </g>
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
        {toPascalCase(blockName)} {t('DASHBOARD.BLOCK')}
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
            value="REGULAR"
            control={<Radio />}
            label={t('CENTERS.REGULAR')}
          />
          <FormControlLabel
            value="REMOTE"
            control={<Radio />}
            label={t('CENTERS.REMOTE')}
          />
        </RadioGroup>
      </FormControl>
      {data?.length > 0 && (
        <>
          <Box sx={{ mt: 2 }}>
            <Typography align="left" sx={{ marginBottom: '16px' }}>
              {centerType === CenterType.REMOTE
                ? t('DASHBOARD.REMOTE_AVERAGE_ATTENDANCE')
                : t('DASHBOARD.REGULAR_AVERAGE_ATTENDANCE')}
              : {averageAttendance.toFixed(2)}%
            </Typography>
          </Box>
          <Box sx={{ maxHeight: '400px', overflowY: 'scroll', overflowX:'hidden' }}>
            <ResponsiveContainer width="100%" height={data.length * 70}>
              <BarChart
                layout="vertical"
                data={data}
                margin={{
                  left: isMobile ? 0 : isRTL ? 0 : 70,
                  right: isMobile ? 0 : isRTL ? 70 : 5,
                }}
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <CartesianGrid stroke="#ccc" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(value: any) => `${value}%`}
                  height={0}
                  reversed={isRTL ? true : false}
                  domain={[0, 100]}

                />
                <YAxis
                  type="category"
                  dataKey="name"
                  orientation={isRTL ? 'right' : 'left'}
                  style={{ textAnchor: isRTL ? 'end' : "revert-layer", }}
                />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Bar
                  dataKey="Attendance"
                  fill="#DAA200"
                  barSize={40}
                  radius={2}
                >
                  <LabelList
                    dataKey="Attendance"
                    content={renderCustomLabel}
                    style={{ marginLeft: '500px' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <ResponsiveContainer width="100%" height={32}>
            <BarChart
              layout="vertical"
              data={[{ name: '', Attendance: 0 }]}
              margin={{
                left: isMobile ? (isRTL ? 0 : 60) : (isRTL ? 60 : 130),
                right: isMobile ? (isRTL ? 60 : 0) : (isRTL ? 130 : 60),
              }}
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              <XAxis
                type="number"
                // tickFormatter={(value: any) => `${value}`}
                domain={[0, 100]}
                reversed={isRTL ? true : false}
              />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <LabelList dataKey="Attendance" content={renderCustomLabel} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {data?.length === 0 && <NoDataFound />}
    </Box>
  );
};

export default AttendanceComparison;