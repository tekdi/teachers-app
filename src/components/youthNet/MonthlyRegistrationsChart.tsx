import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { sampleData } from './tempConfigs';
import { DataPoint } from './tempConfigs';
import { useTranslation } from 'react-i18next';

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
    <div
      style={{ padding: '20px', background: '#ffffff', borderRadius: '8px' }}
    >
      <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        {t('YOUTHNET_DASHBOARD.MONTHLY_REGISTRATIONS_OVERVIEW')}
      </h3>
      <FormControl fullWidth style={{ marginBottom: '10px' }}>
        <Select
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
        >
          <MenuItem value="This month">This month</MenuItem>
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
              onClick={(data, index) => handleBarClick(data, index)}
              radius={[4, 4, 0, 0]}
              shape={(props: any) => {
                const { fill, x, y, width, height, index } = props;
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
    </div>
  );
};

export default MonthlyRegistrationsChart;
