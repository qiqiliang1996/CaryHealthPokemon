import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { TypeCount } from '../types';
import { typePercent } from '../utils/typeCounts';

const COLORS = [
  '#ff6384',
  '#36a2eb',
  '#ffce56',
  '#4bc0c0',
  '#9966ff',
  '#ff9f40',
  '#8dd1e1',
  '#a4de6c',
  '#d0ed57',
];

interface TypePieProps {
  data: TypeCount[];
  height?: number;
}

export const TypePie: React.FC<TypePieProps> = ({ data, height = 300 }) => {
  if (!data.length) return null;
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 480,
        mt: 4,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box sx={{ width: '60%', height }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey='value'
              nameKey='name'
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ width: '40%' }}>
        {data.map((type) => (
          <Typography key={type.name} variant='body2'>
            {type.name}: {typePercent(type.name, data)}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};
