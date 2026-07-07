// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Box, Stack, Typography } from '@mui/material';

import {
  BRAND_TITLE,
  layoutTokens,
  NAV_GAP,
  NAV_PILL_PX,
  NAV_ROW_MIN_HEIGHT,
  ZONE_GAP,
} from '../../theme/tokens';
import LogoutButton from './LogoutButton';
import SvNavLink, { SvNavLinkItem } from './SvNavLink';

interface SvTopNavProps {
  navLinks: SvNavLinkItem[];
  onLogout: () => void;
}

/**
 * Figma nav row (Frame11): px-12, brand + gap-36 + nav cluster (gap-14) + logout right.
 * components.md: brand left, nav items grouped, logout right.
 */
const SvTopNav: React.FC<SvTopNavProps> = ({ navLinks, onLogout }) => (
  <Stack
    direction="row"
    alignItems="center"
    sx={{
      width: '100%',
      minHeight: NAV_ROW_MIN_HEIGHT,
    }}
  >
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        gap: ZONE_GAP,
        flexWrap: 'wrap',
        rowGap: NAV_GAP,
      }}
    >
      <Box sx={{ flexShrink: 0, p: NAV_PILL_PX }}>
        <Typography
          id="app-title"
          data-testid="app-title"
          sx={{
            fontFamily: layoutTokens.fontBrand,
            fontSize: '1.25rem',
            fontWeight: 500,
            /**
             * Figma: Line height 100% (an explicit override, not "Auto") — i.e. exactly
             * 1x font-size (20px). `line-height: normal` instead falls back to Termina's
             * own font metrics, which render at ~120% (24px), 4px taller than spec.
             * Unitless `1` scales with fontSize and matches Figma's 100% exactly.
             */
            lineHeight: 1,
            /** Figma: Letter spacing 0px — Typography's body1 default (0.00938em) otherwise leaks in. */
            letterSpacing: 0,
            fontFeatureSettings: "'liga' off, 'clig' off",
            color: layoutTokens.lightText,
          }}
        >
          {BRAND_TITLE}
        </Typography>
      </Box>

      <Stack
        direction="row"
        sx={{
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: NAV_GAP,
        }}
      >
        {navLinks.map(link => (
          <SvNavLink key={link.path} link={link} />
        ))}
      </Stack>
    </Stack>

    <Box sx={{ flex: 1, minWidth: 16 }} />

    <LogoutButton onLogout={onLogout} />
  </Stack>
);

export default SvTopNav;
