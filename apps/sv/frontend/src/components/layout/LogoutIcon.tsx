// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Box } from '@mui/material';

/** Figma logout glyph — door with arrow outline. */
const LogoutIcon: React.FC = () => (
  <Box component="span" aria-hidden sx={{ display: 'inline-flex', width: 16, height: 16, flexShrink: 0 }}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.53 3H13.5V4H6.53V3ZM12.36 7.92V9.42H13.19V6.28H12.36V7.92Z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M6.53 3H13.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </Box>
);

export default LogoutIcon;
