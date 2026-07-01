// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import {
  Header,
  Loading,
  useUserState,
  useVotesHooks,
} from '@canton-network/splice-common-frontend';

import { Logout } from '@mui/icons-material';
import { Box, Container, Stack, Typography } from '@mui/material';

import { useFeatureSupport } from '../contexts/SvContext';
import { useNetworkInstanceName } from '../hooks/index';
import { useSvConfig } from '../utils';

/** Figma surface-page — single background for header, nav, and content. */
const PAGE_BG = 'colors.page';

/** Figma px-12 (48px) — shared horizontal padding for header and content. */
const PAGE_PX = { xs: 2, md: 6 };

/** Figma pb-9 (36px) — space below the nav row before page content. */
const HEADER_PB = 4.5;

/** Figma gap-7 (28px) — space between network banner and header nav row. */
const BANNER_HEADER_GAP = 3.5;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  const config = useSvConfig();
  const { logout } = useUserState();
  const networkInstanceName = useNetworkInstanceName();
  const networkInstanceNameColor = `colors.${networkInstanceName?.toLowerCase()}`;
  const featureSupport = useFeatureSupport();

  const votesHooks = useVotesHooks();
  const dsoInfosQuery = votesHooks.useDsoInfos();
  const listVoteRequestsQuery = votesHooks.useListDsoRulesVoteRequests();
  const svPartyId = dsoInfosQuery.data?.svPartyId;
  const actionsPending = listVoteRequestsQuery.data?.filter(
    vr => vr.payload.votes.entriesArray().find(e => e[1].sv === svPartyId) === undefined
  );

  if (featureSupport.isLoading) {
    return <Loading />;
  }

  const navLinks = [
    { name: 'Information', path: 'dso' },
    { name: 'Validator Onboarding', path: 'validator-onboarding' },
    { name: `${config.spliceInstanceNames.amuletName} Price`, path: 'amulet-price' },
    { name: 'Governance', path: 'governance', badgeCount: actionsPending?.length },
  ];

  const networkBanner =
    networkInstanceName === undefined ? null : (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backgroundColor: networkInstanceNameColor,
          color: '#18181b',
          height: 48,
          width: '100%',
        }}
      >
        <Typography
          id="network-instance-name"
          data-testid="network-instance-name"
          variant="networkBanner"
        >
          You are on {networkInstanceName}
        </Typography>
      </Stack>
    );

  return (
    <Box bgcolor={PAGE_BG} display="flex" flexDirection="column" minHeight="100vh">
      <Stack
        data-testid="layout-header-stack"
        spacing={BANNER_HEADER_GAP}
        sx={{ pb: HEADER_PB }}
      >
        {networkBanner}
        <Container maxWidth="xl" disableGutters sx={{ px: PAGE_PX }}>
          <Header variant="governance" title="Supervalidator Operations" navLinks={navLinks}>
            <Box
              component="button"
              type="button"
              id="logout-button"
              data-testid="logout-button"
              onClick={logout}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.25,
                flexShrink: 0,
                p: 2.5,
                border: 'none',
                borderRadius: '20px',
                background: 'none',
                cursor: 'pointer',
                color: 'common.white',
                '&:hover': {
                  color: 'common.white',
                  background: 'none',
                },
              }}
            >
              <Logout sx={{ fontSize: 16 }} />
              <Typography variant="navItem" component="span" sx={{ color: 'inherit' }}>
                Logout
              </Typography>
            </Box>
          </Header>
        </Container>
      </Stack>

      <Box sx={{ flex: 1 }}>
        <Container maxWidth="xl" disableGutters sx={{ px: PAGE_PX }}>
          {props.children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
