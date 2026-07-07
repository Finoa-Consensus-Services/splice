// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

// SV-local Termina @font-face (Medium 500 + Bold 700) — see fonts.css for why this
// exists alongside @canton-network/splice-common-typeface-termina.
import './fonts.css';

/** Figma tokens from CF-design-system (tokens.md + delegate-election-2 Dev Mode). */
export const layoutTokens = {
  /** Figma surface-page — bg-neutral-800 */
  page: '#262626',
  /** Figma Dev Mode Background-lighter on Navigation component */
  navBackground: '#272727',
  /** Figma Dev Mode --Light-text — brand wordmark and nav labels */
  lightText: '#E2E2E2',
  /** Figma banner-testnet — bg-cyan-100 (styled export uses #C8F1FE) */
  bannerTestnet: '#cffafe',
  bannerText: '#18181b',
  notificationBadge: '#f87171',
  /** Figma accent-active — outline-violet-500 */
  navActiveOutline: '#8b5cf6',
  navAttention: '#F3FF97',
  fontBrand: '"Termina", sans-serif',
  fontUi: '"Inter", sans-serif',
} as const;

/** Figma Dev Mode — nav row horizontal padding 50px */
export const PAGE_PX = '50px';

/** Figma p-2.5 — 10px padding on brand box and nav pills */
export const NAV_PILL_PX = '10px';

/** Figma content max width (nav row is full width; content uses this) */
export const CONTENT_MAX_WIDTH = 1583;

/** Figma pb-9 — 36px space below nav row */
export const HEADER_PB = 4.5;

/** Figma Dev Mode — 30px gap between banner and nav row (Navigation component) */
export const BANNER_HEADER_GAP = 3.75;

/** Figma Dev Mode — 145px between brand wordmark and nav cluster */
export const ZONE_GAP = 'clamp(12px, 4vw, 145px)';

/** Figma Dev Mode — 60px between nav pills */
export const NAV_GAP = 'clamp(8px, 1.5vw, 60px)';

/** Figma Dev Mode — nav row height 44px */
export const NAV_ROW_MIN_HEIGHT = 44;

/** Figma Dev Mode — banner height 50px */
export const BANNER_MIN_HEIGHT = 50;

/**
 * Figma Dev Mode — Inter nav/logout typography (letter spacing: 0px).
 * Without an explicit `letterSpacing` reset, these Box/Typography elements inherit
 * MUI's default body1 letter-spacing (0.00938em) from an ancestor, rendering as a
 * ~0.13-0.15px leak that's invisible in a screenshot but measurable via computed
 * styles and doesn't match Figma's 0px spec.
 */
export const navItemTypography = {
  fontFeatureSettings: "'liga' off, 'clig' off",
  lineHeight: 'normal',
  letterSpacing: 0,
} as const;

export const BRAND_TITLE = 'Supervalidator Operations';

/** Figma form tokens (components.md — Input/Select, Button, ActionSelection card). */
export const formTokens = {
  surfaceCard: '#18181b',
  surfaceInput: '#404040',
  textSecondary: '#e5e5e5',
  textPlaceholder: '#78716c',
  textDisabled: '#404040',
  textOnPrimary: '#18181b',
  accentPrimary: '#a5f3fc',
  accentSecondary: '#F3FF97',
  stateDisabled: '#78716c',
  fontUi: layoutTokens.fontUi,
  fieldMaxWidth: 833,
  radiusPill: '20px',
  radiusCard: '4px',
} as const;

/** Figma py-14 — vertical padding on action-selection card */
export const ACTION_SELECTION_CARD_PY = 7;

/** Figma gap-8 — space between field group and button row */
export const ACTION_SELECTION_FIELD_GAP = 4;

/** Figma gap-3.5 — space between Cancel and Next */
export const ACTION_SELECTION_BUTTON_GAP = '14px';
