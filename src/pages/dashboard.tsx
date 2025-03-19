import type { StatItem } from 'src/components/widget/stat-card';

import { Helmet } from 'react-helmet-async';

import { Box, Card, Grid } from '@mui/material';

import { formatSeconds } from 'src/utils/format-time';

import { _mock } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { ChartArea } from 'src/layouts/components/chart-area';
import { BookingBooked } from 'src/layouts/components/booking-booked';
import { BookingTotalIncomes } from 'src/layouts/components/booking-total-incomes';
import { useGetUsersDashboardData, useGetConversationDashboardData } from 'src/actions/dashboard';

import { svgColorClasses } from 'src/components/svg-color';
import { StatCard } from 'src/components/widget/stat-card';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard` };

export const _bookingsOverview = [...Array(3)].map((_, index) => ({
  status: ['Pending', 'Canceled', 'Sold'][index],
  quantity: _mock.number.nativeL(index),
  value: _mock.number.percent(index + 5),
}));

export default function Page() {
  const { data: conversationData } = useGetConversationDashboardData();
  const { data: usersData } = useGetUsersDashboardData();

  const conversationStats: StatItem[] = [
    { title: 'Queue size', total: conversationData?.countTotal, icon: 'mdi:human-queue' },
    {
      title: 'Average time in queue',
      total: formatSeconds(conversationData?.timeAverageWaiting ?? 0),
      icon: 'mdi:access-time',
      sx: { bgcolor: 'info.dark', [`& .${svgColorClasses.root}`]: { color: 'info.light' } },
    },
  ];

  const userStats: StatItem[] = [
    {
      title: 'Total',
      total: usersData?.countUsers,
      icon: 'mdi:users-group',
      sx: { bgcolor: 'info.darker', [`& .${svgColorClasses.root}`]: { color: 'info.light' } },
    },
    {
      title: 'Online',
      total: usersData?.countUsersOnline,
      icon: 'mdi:account-online',
      flipIcon: true,
      sx: { bgcolor: 'primary.darker', [`& .${svgColorClasses.root}`]: { color: 'primary.light' } },
    },
  ];

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DashboardContent maxWidth="xl">
        <Grid container spacing={3} justifyContent="center">
          <StatCard headerTitle="Conversations" data={conversationStats} />
          <StatCard headerTitle="Users" data={userStats} />
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
