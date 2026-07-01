// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { TypographyStyle } from '@mui/material';
import { Theme } from '@mui/material/styles';

/** Layout and shell typography from CF-design-system tokens.md. */
export const governanceTypography = (theme: Theme): Record<string, TypographyStyle> => ({
  brandWordmark: {
    fontFamily: theme.fonts.brand.fontFamily,
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.75,
    color: theme.palette.colors.fieldLabel,
  },
  navItem: {
    ...theme.fonts.sansSerif,
    fontSize: '0.875rem',
    fontWeight: 700,
    lineHeight: 1.25,
    color: theme.palette.colors.fieldLabel,
  },
  networkBanner: {
    ...theme.fonts.sansSerif,
    fontSize: '1.25rem',
    fontWeight: 700,
    lineHeight: 1.75,
  },
});
