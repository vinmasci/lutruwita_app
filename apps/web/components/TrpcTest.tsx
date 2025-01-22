'use client';

import { Box, Typography } from '@mui/material';
import { trpc } from '../utils/trpc';

export default function TrpcTest() {
  const hello = trpc.hello.useQuery({ name: 'tRPC' });

  if (!hello.data) return null;

  return (
    <Box>
      <Typography variant="body1" color="text.secondary">
        {hello.data.greeting}
      </Typography>
    </Box>
  );
}
