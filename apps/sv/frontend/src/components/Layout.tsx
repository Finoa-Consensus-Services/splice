// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { Loading, useUserState, useVotesHooks } from '@canton-network/splice-common-frontend';

import { Box, Container, GlobalStyles } from '@mui/material';
import { useLocation } from 'react-router';

import { partyIdScrollGlobalStyles } from './beta/identifierStyles';
import PartyIdScrollTracks from './PartyIdScrollTracks';
import SvNavigationShell from './layout/SvNavigationShell';
import { SvNavLinkItem } from './layout/SvNavLink';
import { useFeatureSupport } from '../contexts/SvContext';
import { useNetworkInstanceName } from '../hooks/index';
import { CONTENT_MAX_WIDTH, layoutTokens, PAGE_PX } from '../theme/tokens';
import { useSvConfig } from '../utils';

interface LayoutProps {
  children: React.ReactNode;
}

const pathnameToPageName = (pathname: string, amuletName: string): string => {
  if (pathname.startsWith('/governance')) {
    return 'Governance';
  }
  if (pathname.startsWith('/validator-onboarding')) {
    return 'Validators';
  }
  if (pathname.startsWith('/amulet-price')) {
    return `${amuletName} Price`;
  }
  if (pathname.startsWith('/delegate-election')) {
    return 'Delegate Election';
  }
  return 'Global Synchronizer Information';
};

/** Figma content-width 1583px centered — nav uses full width inside Navigation shell */
const contentShellSx = {
  maxWidth: CONTENT_MAX_WIDTH,
  mx: 'auto',
  px: PAGE_PX,
  width: '100%',
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const config = useSvConfig();
  const { logout } = useUserState();
  const location = useLocation();
  const networkInstanceName = useNetworkInstanceName();
  const featureSupport = useFeatureSupport();

  const votesHooks = useVotesHooks();
  const dsoInfosQuery = votesHooks.useDsoInfos();
  const listVoteRequestsQuery = votesHooks.useListDsoRulesVoteRequests();
  const svPartyId = dsoInfosQuery.data?.svPartyId;
  const dsoPartyId = dsoInfosQuery.data?.dsoPartyId;
  const actionsPending = listVoteRequestsQuery.data?.filter(
    vr => vr.payload.votes.entriesArray().find(e => e[1].sv === svPartyId) === undefined
  );

  if (featureSupport.isLoading) {
    return <Loading />;
  }

  const navLinks: SvNavLinkItem[] = [
    { name: 'Global Synchronizer Information', path: '/dso' },
    {
      name: 'Governance',
      path: '/governance',
      end: false,
      badgeCount: actionsPending?.length,
    },
    { name: `${config.spliceInstanceNames.amuletName} Price`, path: '/amulet-price' },
    { name: 'Validators', path: '/validator-onboarding' },
    /**
     * Figma shows this alert icon on every page mockup (verified across all Delegate
     * Election, Governance, and Validators frames) — it isn't conditional on any known
     * backend signal today, so default it on. Wire to a real "pending ranking" signal
     * once the Delegate Election API exposes one.
     */
    { name: 'Delegate Election', path: '/delegate-election', hasAlert: true },
  ];

  const pageName = pathnameToPageName(location.pathname, config.spliceInstanceNames.amuletName);
  const networkName = networkInstanceName ?? config.spliceInstanceNames.networkName;

  return (
    <Box bgcolor={layoutTokens.page} display="flex" flexDirection="column" minHeight="100vh">
      <GlobalStyles styles={partyIdScrollGlobalStyles} />
      <PartyIdScrollTracks />
      {dsoPartyId !== undefined ? (
        <SvNavigationShell
          networkName={networkName}
          dsoPartyId={dsoPartyId}
          navLinks={navLinks}
          onLogout={logout}
          pageName={pageName}
        />
      ) : null}

      <Box sx={{ flex: 1, pb: 3 }}>
        <Container maxWidth={false} sx={contentShellSx}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
