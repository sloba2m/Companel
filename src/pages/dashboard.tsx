import { Helmet } from 'react-helmet-async';

import { Box, Card, Grid, CardHeader, CardContent } from '@mui/material';

import { _mock } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { ChartArea } from 'src/layouts/components/chart-area';
import { BookingBooked } from 'src/layouts/components/booking-booked';
import { BookingTotalIncomes } from 'src/layouts/components/booking-total-incomes';

import { svgColorClasses } from 'src/components/svg-color';
import { AppWidget } from 'src/components/widget/app-widget';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard` };

export const _bookingsOverview = [...Array(3)].map((_, index) => ({
  status: ['Pending', 'Canceled', 'Sold'][index],
  quantity: _mock.number.nativeL(index),
  value: _mock.number.percent(index + 5),
}));

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Box
            sx={{
              p: { md: 1 },
              display: 'grid',
              gap: { xs: 3, md: 0 },
              borderRadius: { md: 2 },
              bgcolor: { md: 'background.paper' },
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            }}
          >
            <BookingTotalIncomes
              title="Total incomes"
              total={18765}
              percent={2.6}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                series: [{ data: [10, 41, 80, 100, 60, 120, 69, 91, 160] }],
              }}
            />

            <BookingBooked
              title="Booked"
              data={_bookingsOverview}
              sx={{ boxShadow: { md: 'none' } }}
            />
          </Box>
          <Card>
            <ChartArea
              chart={{
                categories: [
                  '2023-09-19T00:00:00.000Z',
                  '2023-09-19T01:30:00.000Z',
                  '2023-09-19T02:30:00.000Z',
                  '2023-09-19T03:30:00.000Z',
                  '2023-09-19T04:30:00.000Z',
                  '2023-09-19T05:30:00.000Z',
                  '2023-09-19T06:30:00.000Z',
                  '2023-09-19T07:30:00.000Z',
                  '2023-09-19T08:30:00.000Z',
                ],
                series: [
                  { name: 'Series A', data: [32, 40, 28, 42, 64, 72, 56, 80, 100] },
                  { name: 'Series B', data: [12, 32, 45, 32, 34, 52, 40, 60, 60] },
                ],
              }}
            />
          </Card>
        </Box>
      </DashboardContent>
    </>
  );
}
