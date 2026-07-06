// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Button, Stack, Typography } from '@mui/material';

import { layoutTokens, navItemTypography, NAV_PILL_PX } from '../../theme/tokens';
import LogoutIcon from './LogoutIcon';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => (
  <Button
    id="logout-button"
    data-testid="logout-button"
    onClick={onLogout}
    sx={{
      flexShrink: 0,
      p: NAV_PILL_PX,
      minWidth: 0,
      color: layoutTokens.lightText,
      textTransform: 'none',
      '&:hover': { bgcolor: 'transparent', opacity: 0.85 },
    }}
  >
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <LogoutIcon />
      <Typography
        component="span"
        sx={{
          fontFamily: layoutTokens.fontUi,
          fontSize: '0.875rem',
          fontWeight: 700,
          ...navItemTypography,
        }}
      >
        Logout
      </Typography>
    </Stack>
  </Button>
);

export default LogoutButton;
