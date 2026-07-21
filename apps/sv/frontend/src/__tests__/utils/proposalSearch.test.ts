// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, test } from 'vitest';
import { Vote, VoteRequest } from '@daml.js/splice-dso-governance/lib/Splice/DsoRules';
import { ContractId } from '@daml/types';
import {
  filterActionRequiredData,
  filterProposalListingData,
  parseSearchQuery,
  voteRequestMatchesSvName,
} from '../../utils/proposalSearch';
import type { ActionRequiredData } from '../../components/governance/ActionRequiredSection';
import type { ProposalListingData } from '../../utils/types';

describe('proposalSearch', () => {
  test('voteRequestMatchesSvName matches proposal requester only', () => {
    const request = {
      requester: 'Digital-Asset-2',
      votes: {
        entriesArray: () =>
          [
            [
              'Other-SV',
              {
                sv: 'other-sv::1220abc',
                accept: true,
                reason: { url: '', body: '' },
              },
            ],
          ] as [string, Vote][],
      },
    } as unknown as VoteRequest;

    expect(voteRequestMatchesSvName(request, 'digital-asset')).toBe(true);
    expect(voteRequestMatchesSvName(request, 'other')).toBe(false);
    expect(voteRequestMatchesSvName(request, 'unknown')).toBe(false);
  });

  test('parseSearchQuery detects contract ID, date, and SV name', () => {
    const contractId =
      '10f1a2cbcd5a2dc9ad2fb9d17fec183d75de19ca91f623cbd2eaaf634e8d7cb4b5ca101220b5c5c20442f608e151ca702e0c4f51341a338c5979c0547dfcc80f911061ca91';

    expect(parseSearchQuery(contractId)).toEqual({ type: 'contractId', contractId });
    expect(parseSearchQuery('2024-09-11')).toEqual({ type: 'date', date: '2024-09-11' });
    expect(parseSearchQuery('Digital-Asset')).toEqual({ type: 'svName', svName: 'Digital-Asset' });
  });

  test('parseSearchQuery treats partial dates as incomplete instead of SV names', () => {
    expect(parseSearchQuery('2026-07')).toBeNull();
    expect(parseSearchQuery('2026-07-2')).toBeNull();
    expect(parseSearchQuery('2026/')).toBeNull();
  });

  test('parseSearchQuery treats partial contract IDs as substring search', () => {
    expect(parseSearchQuery('10f1a2cbcd5a2dc9')).toEqual({
      type: 'svName',
      svName: '10f1a2cbcd5a2dc9',
    });
    expect(parseSearchQuery('0123456789abcdef0123456789abcdef')).toEqual({
      type: 'svName',
      svName: '0123456789abcdef0123456789abcdef',
    });
  });

  test('filterActionRequiredData matches partial contract IDs', () => {
    const fullContractId =
      '10f1a2cbcd5a2dc9ad2fb9d17fec183d75de19ca91f623cbd2eaaf634e8d7cb4b5ca101220b5c5c20442f608e151ca702e0c4f51341a338c5979c0547dfcc80f911061ca91';
    const numericContractId = '0123456789012345678901234567890123456789012345678901234567890123456';

    const items: ActionRequiredData[] = [
      {
        contractId: fullContractId as ContractId<VoteRequest>,
        actionName: 'Set Config',
        description: 'change rules',
        votingCloses: '2024-09-11T10:00:00Z',
        createdAt: '2024-09-10T10:00:00Z',
        requester: 'Digital-Asset-2',
      },
      {
        contractId: numericContractId as ContractId<VoteRequest>,
        actionName: 'Numeric ID',
        description: 'numeric contract id',
        votingCloses: '2024-09-11T10:00:00Z',
        createdAt: '2024-09-10T10:00:00Z',
        requester: 'sv2',
      },
    ];

    expect(filterActionRequiredData(items, '10f1a2cbcd5a2dc9')).toHaveLength(1);
    expect(filterActionRequiredData(items, '01234567890123456789012345678901')).toHaveLength(1);
  });

  test('filterActionRequiredData matches dates and substrings', () => {
    const items: ActionRequiredData[] = [
      {
        contractId: 'abc' as ContractId<VoteRequest>,
        actionName: 'Set Config',
        description: 'change rules',
        votingCloses: '2024-09-11T10:00:00Z',
        createdAt: '2024-09-10T10:00:00Z',
        requester: 'Digital-Asset-2',
      },
    ];

    expect(filterActionRequiredData(items, '2024-09-11')).toHaveLength(1);
    expect(filterActionRequiredData(items, 'Digital-Asset')).toHaveLength(1);
    expect(filterActionRequiredData(items, 'nomatch')).toHaveLength(0);
    expect(filterActionRequiredData(items, null)).toHaveLength(1);
  });

  test('filterActionRequiredData matches target effective-at date', () => {
    const items: ActionRequiredData[] = [
      {
        contractId: 'abc' as ContractId<VoteRequest>,
        actionName: 'Set Config',
        description: 'change rules',
        votingCloses: '2024-09-11T10:00:00Z',
        createdAt: '2024-09-10T10:00:00Z',
        requester: 'Digital-Asset-2',
        effectiveAt: '2024-10-01T00:00:00Z',
      },
      {
        contractId: 'def' as ContractId<VoteRequest>,
        actionName: 'Add Future Config',
        description: 'no explicit effective date',
        votingCloses: '2024-09-12T10:00:00Z',
        createdAt: '2024-09-11T10:00:00Z',
        requester: 'Digital-Asset-3',
        effectiveAt: 'Threshold',
      },
    ];

    expect(filterActionRequiredData(items, '2024-10-01')).toHaveLength(1);
    expect(filterActionRequiredData(items, '2024-10-01')[0].contractId).toBe('abc');
  });

  test('filterProposalListingData matches SV names via proposal requester', () => {
    const request = {
      requester: 'Digital-Asset-2',
      votes: { entriesArray: () => [] },
    } as unknown as VoteRequest;

    const items: ProposalListingData[] = [
      {
        contractId: 'cid-1' as ContractId<VoteRequest>,
        actionName: 'Set Config',
        description: 'change rules',
        votingThresholdDeadline: '2024-09-11T10:00:00Z',
        voteTakesEffect: 'Threshold',
        yourVote: 'no-vote',
        status: 'In Progress',
        voteStats: { accepted: 0, rejected: 0, 'no-vote': 0 },
        acceptanceThreshold: BigInt(1),
      },
    ];

    const requestByContractId = new globalThis.Map<string, VoteRequest>([['cid-1', request]]);

    expect(filterProposalListingData(items, 'Digital-Asset', requestByContractId)).toHaveLength(1);
    expect(filterProposalListingData(items, 'unknown', requestByContractId)).toHaveLength(0);
  });

  test('filterProposalListingData does not match SV names via voters', () => {
    const request = {
      requester: 'Digital-Asset-2',
      votes: {
        entriesArray: () =>
          [
            [
              'Other-SV',
              {
                sv: 'other-sv::1220abc',
                accept: true,
                reason: { url: '', body: '' },
              },
            ],
          ] as [string, Vote][],
      },
    } as unknown as VoteRequest;

    const items: ProposalListingData[] = [
      {
        contractId: 'cid-1' as ContractId<VoteRequest>,
        actionName: 'Set Config',
        description: 'change rules',
        votingThresholdDeadline: '2024-09-11T10:00:00Z',
        voteTakesEffect: 'Threshold',
        yourVote: 'no-vote',
        status: 'In Progress',
        voteStats: { accepted: 0, rejected: 0, 'no-vote': 0 },
        acceptanceThreshold: BigInt(1),
      },
    ];

    const requestByContractId = new globalThis.Map<string, VoteRequest>([['cid-1', request]]);

    expect(filterProposalListingData(items, 'Other-SV', requestByContractId)).toHaveLength(0);
  });
});
