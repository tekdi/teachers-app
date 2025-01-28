import { Box, FormControl, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DataPoint, sampleData } from './tempConfigs';

const MonthlyRegistrationsChart: React.FC = () => {
  const { t } = useTranslation();
  const [selectedRange, setSelectedRange] = useState<string>('This month');
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  const data = sampleData[selectedRange];

  const handleBarClick = (data: DataPoint, index: number) => {
    setSelectedBar(index);
  };

  const visibleData = data; // Show all data but make only x-axis scrollable

  return (
    <div style={{ padding: '20px', background: '#EDE1CF' }}>
      <h3
        style={{
          fontWeight: 500,
          color: 'black',
          marginBottom: '10px',
          marginTop: 0,
        }}
        suppressHydrationWarning
      >
        {t('YOUTHNET_DASHBOARD.MONTHLY_REGISTRATIONS_OVERVIEW')}
      </h3>
      <Box
        sx={{
          padding: '20px',
          border: '1px solid #D0C5B4',
          borderRadius: '16px',
          background: 'white',
        }}
      >
        <FormControl fullWidth style={{ marginBottom: '10px' }}>
          <Select
            sx={{ borderRadius: '8px' }}
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            <MenuItem value="This month">This month (1 sep - 16 Sep)</MenuItem>
            <MenuItem value="Last month">Last Month</MenuItem>
            <MenuItem value="Last 6 months">Last 6 Months</MenuItem>
          </Select>
        </FormControl>
        <div
          style={{
            width: '100%',
            height: '300px',
            overflowX: 'auto',
            overflowY: 'hidden',
          }}
        >
          <ResponsiveContainer width={visibleData.length * 80} height="100%">
            <BarChart
              data={visibleData}
              margin={{ top: 20, right: 40, bottom: 20, left: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis orientation="right" />
              <Tooltip />
              <Bar
                dataKey="count"
                onClick={(data: any, index: number) => {
                  const transformedData: DataPoint = {
                    date: data.payload?.date,
                    count: data.payload?.count,
                  };

                  handleBarClick(transformedData, index);
                }}
                radius={[4, 4, 0, 0]}
                shape={(props: any) => {
                  const { x, y, width, height, index } = props;
                  const isSelected = selectedBar === index;
                  const barColor = isSelected
                    ? '#008000'
                    : props.payload.count >= 5
                      ? '#90ee90'
                      : '#ffcccb';

                  return (
                    <g>
                      {/* Render indicator on the top right of the bar */}
                      {isSelected && (
                        <>
                          {/* Custom indicator shape */}
                          <path
                            d={`M0,0 L20,-10 L50,-10 L50,10 L20,10 Z`}
                            fill="#008000"
                            transform={`translate(${x + width + 10}, ${y - 20})`} // Always positions above the bar
                          />
                          {/* Count value inside the indicator */}
                          <text
                            x={x + width + 40}
                            y={y - 15} // Adjusted to always show above the bar
                            textAnchor="middle"
                            fontSize={14}
                            fill="#ffffff"
                            fontWeight="bold"
                          >
                            {props.payload.count}
                          </text>
                        </>
                      )}
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={barColor}
                      />
                    </g>
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Box>
    </div>
  );
};

export default MonthlyRegistrationsChart;
