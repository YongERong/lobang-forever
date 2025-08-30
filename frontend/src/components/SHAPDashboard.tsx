import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { Paper } from '@mui/material';
import type { SHAPDashboardProps } from '../types';

const SHAPDashboard = ({ data, dataKey } : SHAPDashboardProps) => {
  return (
    <Paper elevation={2} sx={{ width: "100%", p: 3, borderRadius: "1.5rem", maxWidth: "900px", mx: "auto"}}>
      <Stack width="100%">
        <Typography variant="h6" component="span" textAlign="center">
          SHAP Dashboard
        </Typography>
        <BarChart
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
        {/* <Typography variant="caption">Source: KOSIS</Typography> */}
      </Stack>
    </Paper>
  );
}

export default SHAPDashboard;
