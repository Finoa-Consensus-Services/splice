// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Stack, Typography } from '@mui/material';

import { BANNER_MIN_HEIGHT, layoutTokens } from '../../theme/tokens';

interface NetworkBannerProps {
  networkName: string;
  dsoPartyId: string;
}

const stripDsoPrefix = (partyId: string): string => partyId.replace(/^DSO::/, '');

const NetworkBanner: React.FC<NetworkBannerProps> = ({ networkName, dsoPartyId }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="center"
    sx={{
      position: 'sticky',
      top: 0,
      zIndex: 1100,
      bgcolor: layoutTokens.bannerTestnet,
      color: layoutTokens.bannerText,
      minHeight: BANNER_MIN_HEIGHT,
      py: 1,
      width: '100%',
    }}
  >
    <Typography
      id="network-instance-name"
      data-testid="network-instance-name"
      sx={{
        fontFamily: layoutTokens.fontUi,
        fontSize: '1.25rem',
        fontWeight: 700,
        lineHeight: 1.75,
        textAlign: 'center',
      }}
    >
      {networkName} · ID: {stripDsoPrefix(dsoPartyId)}
    </Typography>
  </Stack>
);

export default NetworkBanner;
