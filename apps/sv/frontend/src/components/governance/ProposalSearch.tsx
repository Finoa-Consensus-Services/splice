// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router';
import { ContractId } from '@daml/types';
import { VoteRequest } from '@daml.js/splice-dso-governance/lib/Splice/DsoRules';
import { hasProposalSearchQuery, parseSearchQuery } from '../../utils/proposalSearch';

const SEARCH_DEBOUNCE_MS = 300;

const searchFieldContainerSx = {
  mb: 3,
  width: '100%',
  maxWidth: 960,
  mx: 'auto',
} as const;

const searchFieldLabelSx = {
  fontSize: 12,
  fontWeight: 600,
  lineHeight: '22px',
  textTransform: 'uppercase',
  color: 'text.light',
  mb: 1,
} as const;

const searchFieldSx = {
  width: '100%',
  maxWidth: 960,
  '& .MuiOutlinedInput-root': {
    height: 48,
    borderRadius: '24px',
    background: 'var(--grey54, #363636)',
    paddingLeft: '8px',
    paddingRight: '12px',
    overflow: 'hidden',
    '& fieldset': { border: 'none' },
    '&:hover fieldset': { border: 'none' },
    '&.Mui-focused fieldset': { border: 'none' },
    '& .MuiInputAdornment-root': { background: 'transparent' },
    '& .MuiOutlinedInput-input': {
      padding: 0,
      fontSize: 14,
      lineHeight: '22px',
      flex: 1,
      minWidth: 0,
      background: 'transparent',
      color: 'text.light',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': { display: 'none' },
      '&::placeholder': { color: '#E2E2E2', opacity: 0.7 },
    },
  },
} as const;

export interface ProposalSearchProps {
  onSearchChange: (query: string) => void;
}

export const ProposalSearch: React.FC<ProposalSearchProps> = ({ onSearchChange }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [inputValue, setInputValue] = useState(urlQuery);
  const debounceTimerRef = useRef<ReturnType<typeof globalThis.setTimeout> | undefined>(undefined);
  const onSearchChangeRef = useRef(onSearchChange);
  onSearchChangeRef.current = onSearchChange;

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== undefined) {
        globalThis.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setInputValue(prev => {
      if (prev !== urlQuery) {
        onSearchChangeRef.current(urlQuery);
        return urlQuery;
      }
      return prev;
    });
  }, [urlQuery]);

  const syncUrl = (value: string) => {
    setSearchParams(
      prev => {
        const trimmed = value.trim();
        if (!trimmed) {
          if (!prev.has('q')) {
            return prev;
          }
          const next = new URLSearchParams(prev);
          next.delete('q');
          return next;
        }

        if (prev.get('q') === value) {
          return prev;
        }
        const next = new URLSearchParams(prev);
        next.set('q', value);
        return next;
      },
      { replace: true }
    );
  };

  const scheduleUrlSync = (value: string) => {
    globalThis.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = globalThis.setTimeout(() => syncUrl(value), SEARCH_DEBOUNCE_MS);
  };

  const handleChange = (value: string) => {
    setInputValue(value);
    onSearchChangeRef.current(value);
    scheduleUrlSync(value);
  };

  const handleClear = () => {
    globalThis.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = undefined;
    setInputValue('');
    onSearchChangeRef.current('');
    syncUrl('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    const parsed = parseSearchQuery(inputValue);
    if (parsed?.type === 'contractId') {
      event.preventDefault();
      navigate(`/governance/proposals/${parsed.contractId as ContractId<VoteRequest>}`);
    }
  };

  return (
    <Box sx={searchFieldContainerSx} data-testid="proposal-search">
      <Typography variant="body2" sx={searchFieldLabelSx} data-testid="proposal-search-title">
        Search Proposals
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        autoComplete="off"
        placeholder="Contract ID, date (YYYY-MM-DD), or Super Validator name"
        value={inputValue}
        onChange={event => handleChange(event.target.value)}
        sx={searchFieldSx}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0.5, color: 'text.light' }}>
                <SearchIcon sx={{ fontSize: 18 }} data-testid="proposal-search-submit" />
              </InputAdornment>
            ),
          },
          htmlInput: {
            'data-testid': 'proposal-search-input',
            onKeyDown: handleKeyDown,
          },
        }}
      />

      {hasProposalSearchQuery(inputValue) && (
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={handleClear}
          data-testid="proposal-search-clear"
          sx={{ mt: 1, color: 'text.light', textDecoration: 'underline', cursor: 'pointer' }}
        >
          Clear search
        </Link>
      )}
    </Box>
  );
};

export default ProposalSearch;
