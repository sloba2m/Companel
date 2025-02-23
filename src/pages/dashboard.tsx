import { Helmet } from 'react-helmet-async';

import { Card, Grid, CardHeader, CardContent } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { svgColorClasses } from 'src/components/svg-color';
import { AppWidget } from 'src/components/widget/app-widget';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DashboardContent maxWidth="xl">
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Conversations" />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <AppWidget title="Queue size" total={2} icon="mdi:human-queue" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <AppWidget
                      title="Average time in queue"
                      total={1035}
                      icon="mdi:access-time"
                      sx={{
                        bgcolor: 'info.dark',
                        [`& .${svgColorClasses.root}`]: { color: 'info.light' },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Users" />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <AppWidget
                      title="Total"
                      total={5}
                      icon="mdi:users-group"
                      sx={{
                        bgcolor: 'info.darker',
                        [`& .${svgColorClasses.root}`]: { color: 'info.light' },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <AppWidget
                      title="Online"
                      total={2}
                      icon="mdi:account-online"
                      flipIcon
                      sx={{
                        bgcolor: 'primary.darker',
                        [`& .${svgColorClasses.root}`]: { color: 'primary.light' },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
