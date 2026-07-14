// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { Box } from '@mui/material';
import React from 'react';

const ARROW_PATH =
  'M9.14731 7.85269C9.34209 7.65791 9.34209 7.34209 9.14731 7.14731C8.95267 6.95267 8.63716 6.9525 8.44231 7.14692L6.5 9.085V1.5C6.5 1.22386 6.27614 1 6 1C5.72386 1 5.5 1.22386 5.5 1.5V9.085L3.5598 7.1448C3.36405 6.94905 3.04631 6.94981 2.85125 7.14625C2.65717 7.34172 2.65753 7.65753 2.85231 7.85231L5.64645 10.6464C5.84171 10.8417 6.15829 10.8417 6.35355 10.6464L9.14731 7.85269Z';

export type WeightChangeArrowDirection = 'down' | 'up' | 'right';

export interface WeightChangeArrowIconProps {
  direction: WeightChangeArrowDirection;
  color: string;
  size?: number;
}

const directionTransform: Record<WeightChangeArrowDirection, string | undefined> = {
  down: undefined,
  up: 'rotate(180deg)',
  right: 'rotate(-90deg)',
};

/** Figma weight-change arrow; size varies by context (12px diff, 16px transition). */
export const WeightChangeArrowIcon: React.FC<WeightChangeArrowIconProps> = ({
  direction,
  color,
  size = 12,
}) => (
  <Box
    component="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden
    sx={{
      width: `${size}px`,
      height: `${size}px`,
      aspectRatio: '1 / 1',
      flexShrink: 0,
      display: 'block',
      transform: directionTransform[direction],
    }}
  >
    <path d={ARROW_PATH} fill={color} />
  </Box>
);
