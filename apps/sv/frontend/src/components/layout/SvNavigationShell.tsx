// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Box } from '@mui/material';

import {
  BANNER_HEADER_GAP,
  HEADER_PB,
  layoutTokens,
  PAGE_PX,
} from '../../theme/tokens';
import NetworkBanner from './NetworkBanner';
import SvTopNav from './SvTopNav';
import { SvNavLinkItem } from './SvNavLink';

interface SvNavigationShellProps {
  networkName: string;
  dsoPartyId: string;
  navLinks: SvNavLinkItem[];
  onLogout: () => void;
  pageName: string;
}

/**
 * Figma "Navigation" component — banner + nav row.
 * Dev Mode: vertical flow, gap 30px, padding-bottom 36px, background #272727.
 */
const SvNavigationShell: React.FC<SvNavigationShellProps> = ({
  networkName,
  dsoPartyId,
  navLinks,
  onLogout,
  pageName,
}) => (
  <Box
    data-component="navigation"
    data-net={networkName}
    data-page={pageName}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: BANNER_HEADER_GAP,
      pb: HEADER_PB,
      bgcolor: layoutTokens.navBackground,
      width: '100%',
    }}
  >
    <NetworkBanner networkName={networkName} dsoPartyId={dsoPartyId} />
    <Box sx={{ px: PAGE_PX, width: '100%' }}>
      <SvTopNav navLinks={navLinks} onLogout={onLogout} />
    </Box>
  </Box>
);

export default SvNavigationShell;
