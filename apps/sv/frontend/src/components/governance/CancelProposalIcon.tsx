// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { Box } from '@mui/material';
import React from 'react';
import { CREATE_PROPOSAL_DISCARD_CTA } from '../../constants/createProposalLayout';

/** Figma cancel-confirmation warning icon — 32×32 with exclamation mark in circle. */
const CancelProposalIcon: React.FC = () => (
  <Box
    component="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden
    sx={{
      width: '32px',
      height: '32px',
      aspectRatio: '1 / 1',
      flexShrink: 0,
      display: 'block',
    }}
  >
    <path
      d="M15.1385 18.5714C14.9744 18.5714 14.8308 18.5143 14.7077 18.4C14.5846 18.2857 14.5231 18.1524 14.5231 18V8.57143C14.5231 8.41905 14.5846 8.28572 14.7077 8.17143C14.8308 8.05714 14.9744 8 15.1385 8H16.8615C17.0256 8 17.1692 8.05714 17.2923 8.17143C17.4154 8.28572 17.4769 8.41905 17.4769 8.57143V18C17.4769 18.1524 17.4154 18.2857 17.2923 18.4C17.1692 18.5143 17.0256 18.5714 16.8615 18.5714H15.1385ZM14.6154 24C14.4513 24 14.3077 23.9429 14.1846 23.8286C14.0615 23.7143 14 23.581 14 23.4286V20.8571C14 20.7048 14.0615 20.5714 14.1846 20.4571C14.3077 20.3429 14.4513 20.2857 14.6154 20.2857H17.3846C17.5487 20.2857 17.6923 20.3429 17.8154 20.4571C17.9385 20.5714 18 20.7048 18 20.8571V23.4286C18 23.581 17.9385 23.7143 17.8154 23.8286C17.6923 23.9429 17.5487 24 17.3846 24H14.6154Z"
      fill={CREATE_PROPOSAL_DISCARD_CTA}
    />
    <circle cx="16" cy="16" r="15.5" stroke={CREATE_PROPOSAL_DISCARD_CTA} />
  </Box>
);

export default CancelProposalIcon;
