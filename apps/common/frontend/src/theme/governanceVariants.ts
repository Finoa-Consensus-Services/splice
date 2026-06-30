// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { TypographyStyle } from '@mui/material';
import { Theme } from '@mui/material/styles';

/** Figma field label — text-xs font-semibold Inter uppercase (tokens.md). */
export const governanceTypography = (theme: Theme): Record<string, TypographyStyle> => ({
  pageTitle: {
    ...theme.fonts.brand,
    fontSize: '2.25rem',
    fontWeight: 700,
    lineHeight: 2,
  },
  sectionHeading: {
    ...theme.fonts.section,
    fontSize: '1.125rem',
    fontWeight: 700,
    lineHeight: 1.25,
  },
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
  monoValue: {
    ...theme.fonts.mono,
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: 1.25,
  },
  fieldLabel: {
    ...theme.fonts.sansSerif,
    display: 'block',
    fontWeight: 600,
    fontSize: '0.75rem',
    lineHeight: 1.67,
    letterSpacing: '0.02em',
    textTransform: 'uppercase' as const,
    color: theme.palette.colors.fieldLabel,
  },
  fieldPlaceholder: {
    fontFamily: theme.fonts.sansSerif.fontFamily,
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: '20px',
    color: theme.palette.colors.fieldPlaceholder,
  },
  fieldValue: {
    fontFamily: theme.fonts.sansSerif.fontFamily,
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: '20px',
    color: theme.palette.colors.fieldLabel,
  },
});

/** Inline select value — avoids extra block spacing inside MuiSelect-select. */
export const governanceFilledInputRootStyles = (theme: Theme) => ({
  backgroundColor: theme.palette.colors.field,
  borderRadius: '4px',
  height: '48px',
  display: 'inline-flex',
  alignItems: 'center',
  paddingTop: '0 !important',
  paddingBottom: '0 !important',
  '&:before, &:after': { display: 'none' },
  '&:hover': { backgroundColor: theme.palette.colors.field },
  '&.Mui-focused': { backgroundColor: theme.palette.colors.field },
  // MUI filled inputs reserve top padding for a floating label notch even without a label.
  '& .MuiInputBase-input': {
    boxSizing: 'border-box',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    px: 2,
    py: '0 !important',
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    fontSize: '0.875rem',
    lineHeight: '20px',
    fontWeight: 400,
    fontFamily: theme.fonts.sansSerif.fontFamily,
    color: theme.palette.colors.fieldLabel,
  },
  '& .MuiInputAdornment-root': {
    marginTop: '0 !important',
    height: '48px',
    maxHeight: '48px',
    alignSelf: 'center',
  },
  '&.MuiFilledInput-multiline': {
    height: 'auto',
    minHeight: '120px',
    alignItems: 'flex-start',
    '& .MuiInputBase-input': {
      height: 'auto',
      minHeight: '120px',
      alignItems: 'flex-start',
      py: '12px !important',
      paddingTop: '12px !important',
      paddingBottom: '12px !important',
    },
  },
});

/** Inline select value — avoids extra block spacing inside MuiSelect-select. */
export const governanceSelectRenderValueSx = {
  display: 'inline',
  lineHeight: '20px',
  m: 0,
  p: 0,
} as const;

/** Shared select / filled-input field surface (Figma bg-neutral-700). */
export const governanceFieldStyles = (theme: Theme) => ({
  bgcolor: theme.palette.colors.field,
  borderRadius: '4px',
  boxShadow: 'none',
  height: '48px',
  display: 'inline-flex',
  alignItems: 'center',
  paddingTop: '0 !important',
  paddingBottom: '0 !important',
  '&::before, &::after': { display: 'none' },
  '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
  '&.Mui-focused:after': { borderBottom: 'none' },
  // MUI filled select reserves ~25px top padding for a label notch even without a label.
  '& .MuiSelect-select': {
    boxSizing: 'border-box',
    height: '48px',
    minHeight: 'unset !important',
    display: 'flex',
    alignItems: 'center',
    px: 2,
    py: '0 !important',
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    paddingRight: '40px !important',
    fontSize: '0.875rem',
    lineHeight: '20px',
    fontWeight: 400,
    fontFamily: theme.fonts.sansSerif.fontFamily,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.colors.fieldLabel,
    right: 16,
    top: '50%',
    transform: 'translateY(-50%)',
  },
});

export const governancePaperStyles = (theme: Theme) => ({
  width: '100%',
  backgroundColor: theme.palette.colors.card,
  borderRadius: '4px',
  boxShadow: 'none',
  backgroundImage: 'none',
});

/** Shared governance form card padding (Figma py-14 / responsive px). */
export const governanceFormCardPadding = {
  py: 7,
  px: { xs: 2, sm: 4, md: 12, lg: 24, xl: 48 },
};

/** Centered form column used in initiate-proposal screens. */
export const governanceFormInnerSx = {
  maxWidth: 833,
  mx: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
} as const;

export const governanceTableContainerStyles = (theme: Theme) => ({
  backgroundColor: theme.palette.colors.page,
  borderRadius: '4px',
  border: `1px solid ${theme.palette.colors.divider}`,
});

export const governanceTableRowStyles = (theme: Theme) => ({
  border: `1px solid ${theme.palette.colors.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.colors.field,
  },
});

export const governanceTableHeadCellStyles = (theme: Theme) => ({
  fontFamily: theme.fonts.section.fontFamily,
  fontSize: '12px',
  fontWeight: 700,
  lineHeight: 1.5,
  textTransform: 'uppercase' as const,
  color: theme.palette.colors.fieldLabel,
  borderBottom: 'none',
});

export const governanceTableBodyCellStyles = (theme: Theme) => ({
  fontFamily: theme.fonts.section.fontFamily,
  fontSize: '0.875rem',
  fontWeight: 400,
  lineHeight: 1.71,
});

/** className hooks for MUI components that cannot take custom `variant` props. */
export const GOVERNANCE_SELECT_CLASS = 'MuiSelect-governanceField';
export const GOVERNANCE_TEXT_FIELD_CLASS = 'MuiTextField-governanceField';
export const GOVERNANCE_TABLE_CONTAINER_CLASS = 'MuiTableContainer-governanceTable';
export const GOVERNANCE_TABLE_HEAD_CELL_CLASS = 'MuiTableCell-governanceHead';
