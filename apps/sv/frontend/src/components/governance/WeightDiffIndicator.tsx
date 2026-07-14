// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  CREATE_PROPOSAL_DISCARD_CTA,
  CREATE_PROPOSAL_FIELD_BODY_SX,
  CREATE_PROPOSAL_PRIMARY_CTA,
} from '../../constants/createProposalLayout';
import { getWeightDiff } from '../../utils/governance';
import { WeightChangeArrowIcon } from './WeightChangeArrowIcon';

export interface WeightDiffIndicatorProps {
  current: string;
  next: string;
  'data-testid'?: string;
}

export const WeightDiffIndicator: React.FC<WeightDiffIndicatorProps> = ({
  current,
  next,
  'data-testid': testId = 'weight-diff-indicator',
}) => {
  const diff = getWeightDiff(current, next);
  if (diff === null || diff === 0) {
    return null;
  }

  const isDecrease = diff < 0;
  const color = isDecrease ? CREATE_PROPOSAL_DISCARD_CTA : CREATE_PROPOSAL_PRIMARY_CTA;

  return (
    <Box
      data-testid={testId}
      sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}
    >
      <WeightChangeArrowIcon direction={isDecrease ? 'down' : 'up'} color={color} size={12} />
      <Typography
        component="span"
        sx={{
          ...CREATE_PROPOSAL_FIELD_BODY_SX,
          color,
          whiteSpace: 'nowrap',
        }}
      >
        {Math.abs(diff)}
      </Typography>
    </Box>
  );
};
