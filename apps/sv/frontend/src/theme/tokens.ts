// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

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

/** Figma Dev Mode — Inter nav/logout typography */
export const navItemTypography = {
  fontFeatureSettings: "'liga' off, 'clig' off",
  lineHeight: 'normal',
} as const;

export const BRAND_TITLE = 'Supervalidator Operations';
