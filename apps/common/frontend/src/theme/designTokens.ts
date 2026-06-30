// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Canton design system tokens from CF-design-system Figma exports (tokens.md).
 * Single source of truth for palette.colors surface and form values.
 */
export const designTokens = {
  page: '#262626',
  card: '#18181b',
  field: '#404040',
  fieldLabel: '#e5e5e5',
  fieldPlaceholder: '#78716c',
  buttonDisabled: '#78716c',
  buttonDisabledText: '#404040',
  /** Figma divider — outline-neutral-600 */
  divider: '#525252',
} as const;

export type DesignTokenColors = typeof designTokens;
