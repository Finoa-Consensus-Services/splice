// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

/** Figma initiate-proposal content column (inside the 1880px canvas). */
export const CREATE_PROPOSAL_CONTENT_MAX_WIDTH = 1583;

/** Figma field column width inside the card. */
export const CREATE_PROPOSAL_FIELD_MAX_WIDTH = 832;

export const CREATE_PROPOSAL_CARD_BG = '#1B1B1B';
export const CREATE_PROPOSAL_CARD_BORDER_RADIUS = '4px';
export const CREATE_PROPOSAL_CARD_PADDING_Y = '60px';

export const CREATE_PROPOSAL_CARD_SX = {
  bgcolor: CREATE_PROPOSAL_CARD_BG,
  borderRadius: CREATE_PROPOSAL_CARD_BORDER_RADIUS,
  py: CREATE_PROPOSAL_CARD_PADDING_Y,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
} as const;

export const CREATE_PROPOSAL_FIELD_COLUMN_SX = {
  width: '100%',
  maxWidth: CREATE_PROPOSAL_FIELD_MAX_WIDTH,
} as const;

export const CREATE_PROPOSAL_SECTION_GAP = '32px';

export const CREATE_PROPOSAL_CONFIG_ROW_GAP = '24px';

export const CREATE_PROPOSAL_CONFIG_ROW_DIVIDER_GAP = '14px';

export const CREATE_PROPOSAL_CONFIG_INPUT_WIDTH = '238px';

export const CREATE_PROPOSAL_FIELD_SURFACE_BG = '#363636';

export const CREATE_PROPOSAL_REVIEW_CONFIG_VALUE_PILL_SX = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: '64px',
  height: '26px',
  px: '8px',
  bgcolor: '#454545',
  borderRadius: '4px',
  textAlign: 'center',
} as const;

export const CREATE_PROPOSAL_PRIMARY_CTA = '#96E4FD';

export const CREATE_PROPOSAL_SECONDARY_CTA = '#F3FF97';

export const CREATE_PROPOSAL_DISABLED_CTA_BG = '#78716C';

export const CREATE_PROPOSAL_DISABLED_CTA_TEXT = '#404040';

export const CREATE_PROPOSAL_DISCARD_CTA = '#FD8575';

export const CREATE_PROPOSAL_FIELD_LABEL_SX = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: '22px',
  letterSpacing: 0,
  textTransform: 'uppercase' as const,
  color: '#E2E2E2',
};

export const CREATE_PROPOSAL_FIELD_BODY_SX = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '22px',
  letterSpacing: 0,
  color: '#E2E2E2',
};

export const CREATE_PROPOSAL_FIELD_HELPER_SX = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '12px',
  fontWeight: 400,
  lineHeight: '22px',
  letterSpacing: 0,
  color: '#E2E2E2',
};
