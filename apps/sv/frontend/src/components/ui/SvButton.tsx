// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Button, ButtonProps } from '@mui/material';

import { formTokens } from '../../theme/tokens';

type SvButtonVariant = 'primary' | 'secondary';

type SvButtonProps = Omit<ButtonProps, 'variant' | 'color'> & {
  variant?: SvButtonVariant;
};

const baseSx = {
  px: 2,
  py: 1.25,
  borderRadius: formTokens.radiusPill,
  fontFamily: formTokens.fontUi,
  fontSize: '1rem',
  fontWeight: 500,
  lineHeight: '20px',
  textTransform: 'none' as const,
  minWidth: 80,
};

const variantSx: Record<SvButtonVariant, object> = {
  primary: {
    bgcolor: formTokens.accentPrimary,
    color: formTokens.textOnPrimary,
    '&:hover': { bgcolor: formTokens.accentPrimary, opacity: 0.9 },
    '&.Mui-disabled': {
      bgcolor: formTokens.stateDisabled,
      color: formTokens.textDisabled,
    },
  },
  secondary: {
    bgcolor: 'transparent',
    color: '#ffffff',
    border: `1px solid ${formTokens.accentSecondary}`,
    '&:hover': {
      bgcolor: 'transparent',
      border: `1px solid ${formTokens.accentSecondary}`,
      opacity: 0.85,
    },
  },
};

export const SvPrimaryButton: React.FC<SvButtonProps> = ({
  variant: _variant = 'primary',
  sx,
  ...props
}) => (
  <Button {...props} sx={{ ...baseSx, ...variantSx.primary, ...sx }} />
);

export const SvSecondaryButton: React.FC<SvButtonProps> = ({ sx, ...props }) => (
  <Button {...props} sx={{ ...baseSx, ...variantSx.secondary, ...sx }} />
);
