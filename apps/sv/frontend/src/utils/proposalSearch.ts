// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { VoteRequest } from '@daml.js/splice-dso-governance/lib/Splice/DsoRules';
import type { ProposalListingData } from './types';
import type { ActionRequiredData } from '../components/governance/ActionRequiredSection';

dayjs.extend(utc);

const CONTRACT_ID_PATTERN = /^[0-9a-fA-F]{64,}$/;
const PARTIAL_CONTRACT_ID_PATTERN = /^[0-9a-fA-F]{1,63}$/;

function looksLikePartialContractIdInput(value: string): boolean {
  return PARTIAL_CONTRACT_ID_PATTERN.test(value.trim());
}

type ParsedSearchQuery =
  | { type: 'contractId'; contractId: string }
  | { type: 'date'; date: string }
  | { type: 'svName'; svName: string };

function looksLikeDateInput(value: string): boolean {
  const trimmed = value.trim();
  return /^\d/.test(trimmed) && /^[\d/-]+$/.test(trimmed);
}

function parseSearchDate(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const parsed = dayjs.utc(trimmed, 'YYYY-MM-DD', true);
    return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null;
  }

  if (/^\d{4}\/\d{2}\/\d{2}$/.test(trimmed)) {
    const parsed = dayjs.utc(trimmed, 'YYYY/MM/DD', true);
    return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null;
  }

  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
    const parsed = dayjs(trimmed, 'M/D/YYYY', true);
    return parsed.isValid() ? parsed.utc().format('YYYY-MM-DD') : null;
  }

  return null;
}

export function parseSearchQuery(input: string): ParsedSearchQuery | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  if (CONTRACT_ID_PATTERN.test(trimmed)) {
    return { type: 'contractId', contractId: trimmed };
  }

  if (looksLikePartialContractIdInput(trimmed)) {
    return { type: 'svName', svName: trimmed };
  }

  if (looksLikeDateInput(trimmed)) {
    const date = parseSearchDate(trimmed);
    return date ? { type: 'date', date } : null;
  }

  return { type: 'svName', svName: trimmed };
}

export function hasProposalSearchQuery(query: string | null | undefined): boolean {
  return !!query?.trim();
}

function matchesUtcCalendarDay(
  dateStr: string,
  ...values: (dayjs.ConfigType | undefined | null)[]
): boolean {
  const selected = dayjs.utc(dateStr, 'YYYY-MM-DD').format('YYYY-MM-DD');
  return values.some(
    value =>
      value !== undefined &&
      value !== null &&
      value !== '' &&
      dayjs.utc(value).format('YYYY-MM-DD') === selected
  );
}

export function voteRequestMatchesSvName(request: VoteRequest, svNameQuery: string): boolean {
  const query = svNameQuery.trim().toLowerCase();
  if (!query) {
    return false;
  }

  return request.requester.toLowerCase().includes(query);
}

function matchesSubstring(query: string, fields: (string | undefined)[]): boolean {
  const normalized = query.trim().toLowerCase();
  return fields.some(field => field?.toLowerCase().includes(normalized));
}

function createActionRequiredMatcher(
  trimmed: string,
  parsed: ParsedSearchQuery
): (item: ActionRequiredData) => boolean {
  if (parsed.type === 'date') {
    const date = parsed.date;
    return item =>
      matchesUtcCalendarDay(
        date,
        item.createdAt,
        item.votingCloses,
        item.effectiveAt === 'Threshold' ? undefined : item.effectiveAt
      );
  }

  return item =>
    matchesSubstring(trimmed, [
      item.actionName,
      item.description,
      item.contractId as string,
      item.requester,
      item.createdAt,
      item.votingCloses,
      item.effectiveAt,
    ]);
}

function listingSearchFields(
  item: ProposalListingData,
  request: VoteRequest | undefined
): (string | undefined)[] {
  return [
    item.actionName,
    item.description,
    item.contractId as string,
    item.votingThresholdDeadline,
    item.voteTakesEffect,
    item.status,
    item.yourVote,
    request?.requester,
  ];
}

function createProposalListingMatcher(
  trimmed: string,
  parsed: ParsedSearchQuery,
  requestByContractId?: ReadonlyMap<string, VoteRequest>
): (item: ProposalListingData) => boolean {
  if (parsed.type === 'date') {
    const date = parsed.date;
    return item =>
      matchesUtcCalendarDay(
        date,
        item.votingThresholdDeadline,
        item.voteTakesEffect === 'Threshold' ? undefined : item.voteTakesEffect
      );
  }

  if (parsed.type === 'svName') {
    const svName = parsed.svName;
    return item => {
      const request = requestByContractId?.get(item.contractId as string);
      if (request && voteRequestMatchesSvName(request, svName)) {
        return true;
      }
      return matchesSubstring(trimmed, listingSearchFields(item, request));
    };
  }

  return item => {
    const request = requestByContractId?.get(item.contractId as string);
    return matchesSubstring(trimmed, listingSearchFields(item, request));
  };
}

export function filterActionRequiredData(
  items: ActionRequiredData[],
  query: string | null | undefined
): ActionRequiredData[] {
  const trimmed = query?.trim();
  if (!trimmed) {
    return items;
  }

  const parsed = parseSearchQuery(trimmed);
  if (!parsed) {
    return items;
  }

  const matchesItem = createActionRequiredMatcher(trimmed, parsed);
  return items.filter(matchesItem);
}

export function filterProposalListingData(
  items: ProposalListingData[],
  query: string | null | undefined,
  requestByContractId?: ReadonlyMap<string, VoteRequest>
): ProposalListingData[] {
  const trimmed = query?.trim();
  if (!trimmed) {
    return items;
  }

  const parsed = parseSearchQuery(trimmed);
  if (!parsed) {
    return items;
  }

  const matchesItem = createProposalListingMatcher(trimmed, parsed, requestByContractId);
  return items.filter(matchesItem);
}
