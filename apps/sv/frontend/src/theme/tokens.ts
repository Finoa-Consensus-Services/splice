// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

/** Figma tokens from CF-design-system (tokens.md + delegate-election-2 Dev Mode). */
export const layoutTokens = {
  /** Figma surface-page — bg-neutral-800 */
  page: '#262626',
  /** Figma Dev Mode Background-lighter on Navigation component */
  navBackground: '#272727',
  /** Figma text-neutral-200 — nav labels */
  fieldLabel: '#e5e5e5',
  /** Figma Dev Mode --Light-text for brand wordmark */
  brandText: '#E2E2E2',
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

/** Figma px-12 — 48px horizontal inset */
export const PAGE_PX = 6;

/** Figma p-2.5 — 10px padding on brand box and nav pills */
export const NAV_PILL_PX = '10px';

/** Figma content max width (nav row is full width; content uses this) */
export const CONTENT_MAX_WIDTH = 1583;

/** Figma pb-9 — 36px space below nav row */
export const HEADER_PB = 4.5;

/** Figma Dev Mode — 30px gap between banner and nav row (Navigation component) */
export const BANNER_HEADER_GAP = 3.75;

/** Figma gap-36 — max 144px between brand, nav, logout */
export const ZONE_GAP = 'clamp(12px, 4vw, 144px)';

/** Figma gap-14 — max 56px between nav pills */
export const NAV_GAP = 'clamp(8px, 1.5vw, 56px)';

export const BRAND_TITLE = 'Supervalidator Operations';
