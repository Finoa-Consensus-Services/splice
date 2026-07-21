// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import {
  ActionRequiredSection,
  ActionRequiredData,
} from '../components/governance/ActionRequiredSection';
import { Loading, useVotesHooks } from '@canton-network/splice-common-frontend';
import { dateTimeFormatISO } from '@canton-network/splice-common-frontend-utils';
import dayjs from 'dayjs';
import { ContractId } from '@daml/types';
import {
  ActionRequiringConfirmation,
  VoteRequest,
} from '@daml.js/splice-dso-governance/lib/Splice/DsoRules';
import { useSvConfig } from '../utils';
import { PageHeader } from '../components/beta';
import { ProposalListingSection } from '../components/governance/ProposalListingSection';
import ProposalSearch from '../components/governance/ProposalSearch';
import {
  filterActionRequiredData,
  filterProposalListingData,
  hasProposalSearchQuery,
} from '../utils/proposalSearch';
import {
  actionTagToTitle,
  buildVoteHistoryData,
  computeVoteStats,
  computeYourVote,
  getCurrentSvName,
} from '../utils/governance';
import { SupportedActionTag, ProposalListingData } from '../utils/types';
import { Link as RouterLink, useSearchParams } from 'react-router';
import { InfoOutlined, WarningAmberOutlined } from '@mui/icons-material';
import { useInfiniteVoteRequestResults, useVoteRequestResultsCount } from '../hooks';

function getAction(action: ActionRequiringConfirmation): string {
  switch (action.tag) {
    case 'ARC_AmuletRules':
      return action.value.amuletRulesAction.tag;
    case 'ARC_DsoRules':
      return action.value.dsoAction.tag;
    default:
      return 'Action tag not defined.';
  }
}

export const Governance: React.FC = () => {
  const svConfig = useSvConfig();
  const amuletName = svConfig.spliceInstanceNames.amuletName;
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') ?? '');
  const hasSearch = hasProposalSearchQuery(searchQuery);

  const votesHooks = useVotesHooks();
  const dsoInfosQuery = votesHooks.useDsoInfos();
  const listVoteRequestsQuery = votesHooks.useListDsoRulesVoteRequests();
  const voteResultsInfiniteQuery = useInfiniteVoteRequestResults();
  const voteResultsCountQuery = useVoteRequestResultsCount();

  const voteRequestIds = listVoteRequestsQuery.data
    ? listVoteRequestsQuery.data.map(v => v.payload.trackingCid || v.contractId)
    : [];
  const votesQuery = votesHooks.useListVotes(voteRequestIds);

  const svPartyId = dsoInfosQuery.data?.svPartyId;
  const votingThreshold = dsoInfosQuery.data?.votingThreshold;
  const svs = dsoInfosQuery.data?.dsoRules.payload.svs;

  const alreadyVotedRequestIds: Set<ContractId<VoteRequest>> = useMemo(() => {
    return svPartyId && votesQuery.data
      ? new Set(votesQuery.data.filter(v => v.voter === svPartyId).map(v => v.requestCid))
      : new Set();
  }, [votesQuery.data, svPartyId]);

  const requestByContractId = useMemo(() => {
    const map = new globalThis.Map<string, VoteRequest>();
    listVoteRequestsQuery.data?.forEach(contract => {
      const trackingCid = (contract.payload.trackingCid || contract.contractId) as string;
      map.set(trackingCid, contract.payload);
    });
    return map;
  }, [listVoteRequestsQuery.data]);

  const voteHistoryRequestByContractId = useMemo(() => {
    const map = new globalThis.Map(requestByContractId);
    voteResultsInfiniteQuery.data?.pages.forEach(page => {
      page.results.forEach(result => {
        const trackingCid = result.request.trackingCid as string;
        if (trackingCid) {
          map.set(trackingCid, result.request);
        }
      });
    });
    return map;
  }, [requestByContractId, voteResultsInfiniteQuery.data?.pages]);

  const voteHistory = useMemo(() => {
    const pages = voteResultsInfiniteQuery.data?.pages;
    if (!pages || !svPartyId || votingThreshold === undefined) return [];

    const allVoteResults = pages.flatMap(page => page.results);
    return buildVoteHistoryData(allVoteResults, amuletName, svPartyId, votingThreshold);
  }, [voteResultsInfiniteQuery.data?.pages, amuletName, svPartyId, votingThreshold]);

  const searchMayBeIncomplete = hasSearch && voteResultsInfiniteQuery.hasNextPage;

  const voteRequests = listVoteRequestsQuery.data;
  const currentSvName = getCurrentSvName(svPartyId, svs);

  const actionRequiredRequests = useMemo(() => {
    if (!voteRequests) {
      return [];
    }

    return filterActionRequiredData(
      voteRequests
        .filter(v => !alreadyVotedRequestIds.has(v.payload.trackingCid || v.contractId))
        .map(vr => ({
          contractId: vr.payload.trackingCid || vr.contractId,
          actionName:
            actionTagToTitle(amuletName)[getAction(vr.payload.action) as SupportedActionTag],
          description: vr.payload.reason.body,
          votingCloses: dayjs(vr.payload.voteBefore).format(dateTimeFormatISO),
          createdAt: dayjs(vr.createdAt).format(dateTimeFormatISO),
          requester: vr.payload.requester,
          isYou: currentSvName !== undefined && vr.payload.requester === currentSvName,
          effectiveAt: vr.payload.targetEffectiveAt
            ? dayjs(vr.payload.targetEffectiveAt).format(dateTimeFormatISO)
            : 'Threshold',
        })) as ActionRequiredData[],
      searchQuery
    );
  }, [voteRequests, alreadyVotedRequestIds, amuletName, currentSvName, searchQuery]);

  const inflightRequests = useMemo(() => {
    if (!voteRequests || votingThreshold === undefined) {
      return [];
    }

    return filterProposalListingData(
      voteRequests
        .filter(v => alreadyVotedRequestIds.has(v.payload.trackingCid || v.contractId))
        .map(v => {
          const effectiveAt = v.payload.targetEffectiveAt
            ? dayjs(v.payload.targetEffectiveAt).format(dateTimeFormatISO)
            : 'Threshold';
          const votes = v.payload.votes.entriesArray().map(e => e[1]);

          return {
            contractId: v.payload.trackingCid || v.contractId,
            actionName:
              actionTagToTitle(amuletName)[getAction(v.payload.action) as SupportedActionTag],
            description: v.payload.reason.body,
            votingThresholdDeadline: dayjs(v.payload.voteBefore).format(dateTimeFormatISO),
            voteTakesEffect: effectiveAt,
            yourVote: computeYourVote(votes, svPartyId),
            status: 'In Progress',
            voteStats: computeVoteStats(votes),
            acceptanceThreshold: votingThreshold,
          } as ProposalListingData;
        }),
      searchQuery,
      requestByContractId
    );
  }, [
    voteRequests,
    votingThreshold,
    alreadyVotedRequestIds,
    amuletName,
    svPartyId,
    searchQuery,
    requestByContractId,
  ]);

  const filteredVoteHistory = useMemo(
    () => filterProposalListingData(voteHistory, searchQuery, voteHistoryRequestByContractId),
    [voteHistory, searchQuery, voteHistoryRequestByContractId]
  );

  if (
    dsoInfosQuery.isPending ||
    listVoteRequestsQuery.isPending ||
    votesQuery.isPending ||
    voteResultsInfiniteQuery.isPending
  ) {
    return <Loading />;
  }

  if (
    dsoInfosQuery.isError ||
    listVoteRequestsQuery.isError ||
    votesQuery.isError ||
    voteResultsInfiniteQuery.isError
  ) {
    return <ErrorStateSection />;
  }

  const showEmptyState =
    !hasSearch &&
    actionRequiredRequests.length === 0 &&
    inflightRequests.length === 0 &&
    filteredVoteHistory.length === 0 &&
    !voteResultsInfiniteQuery.hasNextPage;

  const showNoSearchMatches =
    hasSearch &&
    actionRequiredRequests.length === 0 &&
    inflightRequests.length === 0 &&
    filteredVoteHistory.length === 0;

  return (
    <Box sx={{ p: 4 }}>
      <PageHeader
        title="Governance"
        actionElement={
          <Button
            id="initiate-proposal-button"
            variant="pill"
            component={RouterLink}
            to={`/governance/proposals/create`}
          >
            Initiate Proposal
          </Button>
        }
        data-testid="governance-page-header"
      />

      <ProposalSearch onSearchChange={setSearchQuery} />

      {searchMayBeIncomplete && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          Results may be incomplete for very large histories.
        </Typography>
      )}

      {showEmptyState ? (
        <EmptyStateSection />
      ) : showNoSearchMatches ? (
        <NoSearchMatchesSection />
      ) : (
        <>
          <ActionRequiredSection
            actionRequiredRequests={actionRequiredRequests}
            noDataMessage={
              hasSearch
                ? 'No action required items match your search.'
                : 'No Action Required items available'
            }
          />

          <ProposalListingSection
            sectionTitle="Inflight Votes"
            badgeCount={inflightRequests.length}
            data={inflightRequests}
            noDataMessage={
              hasSearch
                ? 'No in-flight proposals match your search.'
                : 'No proposals are currently in flight. Proposals you have voted on will appear here while awaiting the voting threshold or deadline.'
            }
            uniqueId="inflight-proposals"
            showVoteStats
            showThresholdDeadline
            sortOrder="effectiveAtAsc"
          />

          <ProposalListingSection
            sectionTitle="Vote History"
            badgeCount={hasSearch ? filteredVoteHistory.length : voteResultsCountQuery.data}
            data={filteredVoteHistory}
            noDataMessage={
              hasSearch
                ? 'No vote history matches your search.'
                : 'No data to show. You can see your vote history here after proposals meet their threshold deadline.'
            }
            uniqueId="vote-history"
            showStatus
            showVoteStats
            fetchNextPage={hasSearch ? undefined : voteResultsInfiniteQuery.fetchNextPage}
            hasNextPage={hasSearch ? false : voteResultsInfiniteQuery.hasNextPage}
            isFetchingNextPage={hasSearch ? false : voteResultsInfiniteQuery.isFetchingNextPage}
            pageCount={
              hasSearch
                ? undefined
                : voteResultsInfiniteQuery.data?.pages.filter(p => p.results.length > 0).length
            }
          />
        </>
      )}
    </Box>
  );
};

const EmptyStateSection: React.FC = () => (
  <Stack mt={11} alignItems="center" gap="14px">
    <InfoOutlined color="secondary" fontSize="large" />
    <Typography fontSize={20} fontWeight="bold" mt={1}>
      No data to show
    </Typography>
    <Typography fontSize={16}>
      This page will automatically update once there are in-flight proposals
    </Typography>
  </Stack>
);

const NoSearchMatchesSection: React.FC = () => (
  <Stack mt={11} alignItems="center" gap="14px">
    <InfoOutlined color="secondary" fontSize="large" />
    <Typography fontSize={20} fontWeight="bold" mt={1}>
      No proposals match your search
    </Typography>
  </Stack>
);

const ErrorStateSection: React.FC = () => (
  <Stack mt={11} alignItems="center" gap="14px">
    <WarningAmberOutlined color="warning" fontSize="large" />
    <Typography fontSize={20} fontWeight="bold" mt={1}>
      Something went wrong
    </Typography>
    <Typography fontSize={16}>Please try to reload this page or contact support</Typography>
  </Stack>
);
