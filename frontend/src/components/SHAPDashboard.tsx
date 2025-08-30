import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Paper, Box } from '@mui/material';
import type { SHAPDashboardProps } from '../types';
import { useState, useEffect } from 'react';

const SHAPDashboard = ({ data, dataKey } : SHAPDashboardProps) => {
  const [BarChartComponent, setBarChartComponent] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    import('@mui/x-charts/BarChart')
      .then(mod => {
        if (mounted) setBarChartComponent(() => mod.BarChart);
      })
      .catch(err => {
        console.error('Failed to load charts', err);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <Paper elevation={2} sx={{ width: "100%", p: 3, borderRadius: "1.5rem", maxWidth: "900px", mx: "auto"}}>
      <Stack width="100%">
        <Typography variant="h6" component="span" textAlign="center">
          SHAP Dashboard
        </Typography>
        {BarChartComponent ? (
          <BarChartComponent
            dataset={data}
            height={400}
            layout="horizontal"
            margin={{ right: 0, left: 0 }}
            series={[{ dataKey: "importance", label: "SHAP Value", type: 'bar', stack: 'stack', },]}
            yAxis={[
              {
                dataKey: dataKey,
                width: 60,
                disableLine: true,
                disableTicks: true,
              },
            ]}
            xAxis={[
              {
                disableLine: true,
                disableTicks: true,
                domainLimit() {
                  return { min: -1.04, max: 1.04 }
                },
                colorMap: {
                  type: 'piecewise',
                  thresholds: [0, 1],
                  colors: ['red', 'blue'],
                }
              },
            ]}
            grid={{ vertical: true }}
          />
        ) : (
          <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary">Chart loading...</Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

export default SHAPDashboard;
