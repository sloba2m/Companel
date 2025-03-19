import type { Theme, SxProps } from '@mui/material';

import { Card, Grid, CardHeader, CardContent } from '@mui/material';

import { AppWidget } from './app-widget';

export interface StatItem {
  title: string;
  total?: number | string;
  icon: string;
  sx?: SxProps<Theme>;
  flipIcon?: boolean;
}

interface StatCardProps {
  headerTitle: string;
  data: StatItem[];
}

export const StatCard = ({ headerTitle, data }: StatCardProps) => (
  <Grid item xs={12} md={6}>
    <Card>
      <CardHeader title={headerTitle} />
      <CardContent>
        <Grid container spacing={3}>
          {data.map(({ title, total, icon, sx, flipIcon }, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <AppWidget title={title} total={total} icon={icon} flipIcon={flipIcon} sx={sx} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  </Grid>
);
