// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Theme,
  Typography,
} from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from 'react-router';
import { createProposalActions } from '../../utils/governance';

/**
 * Source of truth: CF-design-system repo (`Figma-exports/initiate-proposal-1.html`
 * is the literal export of this exact screen, cross-referenced against
 * `.cursor/skills/canton-design-system/tokens.md` + `components.md`).
 *
 * Card (`surface-card` token): `px-96 py-14 bg-zinc-900 rounded-sm`, spanning
 * the full width of the page's content column — the horizontal padding
 * centers the 833px-wide field/button group inside it, not a gap between the
 * card and the page edge. Implemented as an outer full-width Box (bg/radius/
 * padding) wrapping an inner maxWidth content Box, per the design system's
 * "responsive, not absolute" rule (replace fixed Figma widths with
 * flex/maxWidth while preserving the spacing scale).
 */
const CARD_CONTENT_WIDTH = 835;
const CARD_BG = 'var(--grey11, #181818)'; // ~ Tailwind zinc-900 (#18181b)
const CARD_VERTICAL_PADDING = '60px';

/** Dev Mode computed CSS for the Select field: `padding: 13px 16px; border-radius: 4px;
 * background: var(--grey54, #363636)`. */
const SELECT_BG = 'var(--grey54, #363636)';

/**
 * Direct Dev Mode inspect of the live "Set Amulet Rule Configuration" value
 * text node (named style **"Body M"**) gives: `font-family: Lato; font-size:
 * 14px; font-weight: 400; line-height: 22px (157.143%); color: var(--Light-
 * text, #E2E2E2)`. This supersedes `components.md`'s generalized Input/Select
 * spec ("Value/placeholder — text-sm font-normal font-['Inter'] leading-5"),
 * which reads as `Inter`/`20px` — an instance-level Dev Mode reading on the
 * exact node beats a hand-summarized doc. Note this is a *different* text
 * style than the field label above it (`Field label` in tokens.md, which
 * really is Inter) — don't let the two merge.
 */
const selectValueSx = {
  fontFamily: "'Lato', sans-serif",
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '22px',
  color: '#E2E2E2',
  fontFeatureSettings: "'liga' off, 'clig' off",
};

/** tokens.md "text-placeholder": text-stone-500 (#78716C) — a distinct muted tone, not a dimmed value color. */
const PLACEHOLDER_TEXT = 'Select proposal type';
const selectPlaceholderSx = {
  ...selectValueSx,
  color: '#78716C',
};

/**
 * Dev Mode computed CSS for the Cancel button (size Large): `padding: 10px
 * 16px; height: 39px; gap: 4px; border-radius: 20px`. Width (85px) and gap
 * are Figma auto-layout artifacts of the fixed frame — content-based width
 * is correct per the "responsive, not absolute" rule, and gap only matters
 * once an icon is added (no icons on Cancel/Next today). 39px (from the
 * literal Dev Mode reading) supersedes the 40px `h-10` seen in the Tailwind
 * HTML export, since Tailwind classes snap to the nearest scale step.
 * `rounded-[20px]` is the same fully-pill shape the app's `variant="pill"`
 * already renders (its `borderRadius: 9999` clamps to 50% either way), so
 * only height/padding need pinning here.
 */
const pillButtonSx = {
  height: '39px',
  px: '16px',
  py: '10px',
};

/**
 * The shared theme's "secondary pill" variant tries to clear the background
 * with `backgroundColor: 'none'`, but `'none'` isn't a valid CSS
 * background-color — browsers drop that declaration, so the *primary* pill
 * variant's cyan background (which matches on `variant: 'pill'` alone,
 * regardless of `color`) shows through instead. Override it explicitly here
 * so Cancel renders as the outline-only secondary button the design calls for.
 */
const cancelButtonSx = {
  ...pillButtonSx,
  bgcolor: 'transparent',
  '&:hover': { bgcolor: 'transparent' },
};

/**
 * components.md Disabled state: `bg-stone-500 + label text-neutral-700`, no
 * border. The shared theme's `stylePillButton` `&:disabled` only overrides
 * `backgroundColor`/`border` (never `color`), and uses `neutral[25]` (#404040,
 * dark) for the background instead of stone-500 — leaving the Primary
 * variant's `black` text on a dark background (poor contrast) plus an
 * unwanted 2px border the spec doesn't have. Overridden here rather than in
 * the shared theme to stay scoped to this component.
 */
const nextButtonSx = (theme: Theme) => ({
  ...pillButtonSx,
  '&:disabled': {
    bgcolor: '#78716C', // tokens.md state-disabled (bg-stone-500)
    color: theme.palette.colors.neutral[25], // tokens.md text-disabled (text-neutral-700 ~ #404040, exact match)
    border: 'none',
  },
});

/** Figma "chevron_down" icon asset (16x16), used in place of MUI's default filled arrow. */
const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    {...props}
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SelectAction: React.FC = () => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      action: '',
    },
    onSubmit: async ({ value }) => {
      navigate(`/governance/proposals/create?action=${value.action}`);
    },
  });

  const handleCancel = () => {
    form.reset();
    navigate('/governance/proposals');
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        py: CARD_VERTICAL_PADDING,
        px: { xs: 2, sm: 4 },
        bgcolor: CARD_BG,
        borderRadius: '4px',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: CARD_CONTENT_WIDTH }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="action"
            validators={{
              onMount: ({ value }) => {
                const res = createProposalActions.find(a => a.value === value);
                return res ? undefined : 'Invalid action';
              },
            }}
            children={field => (
              <FormControl fullWidth sx={{ mb: '32px' /* export: gap-8 between field group and buttons */ }}>
                <Typography
                  component="label"
                  id="select-action-label"
                  htmlFor="select-action"
                  sx={{
                    ...selectValueSx,
                    /** tokens.md "Field label": font-['Inter'] — distinct from the
                     * value text's Lato/"Body M" style above, so it must be pinned
                     * back explicitly rather than inherit the Lato override. */
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    /** export: gap-2 (8px) between the label row and the field box. */
                    mb: '8px',
                  }}
                >
                  Select proposal type
                </Typography>

                <Select
                  labelId="select-action-label"
                  id="select-action"
                  data-testid="select-action"
                  displayEmpty
                  value={field.state.value}
                  onChange={(e: SelectChangeEvent) => field.handleChange(e.target.value as string)}
                  onBlur={field.handleBlur}
                  IconComponent={ChevronDownIcon}
                  renderValue={selected => {
                    const action = createProposalActions.find(a => a.value === selected);
                    return (
                      <Box component="span" sx={action ? selectValueSx : selectPlaceholderSx}>
                        {action ? action.name : PLACEHOLDER_TEXT}
                      </Box>
                    );
                  }}
                  sx={theme => ({
                    bgcolor: SELECT_BG,
                    borderRadius: `${theme.shape.borderRadius}px`,
                    /**
                     * The shared theme's global `MuiInputBase` override sets
                     * `.MuiOutlinedInput-input` (the same element as `.MuiSelect-select`)
                     * to `neutral[10]` (#1a1a1a) — that inner div fills the same box as
                     * the root and paints over the `bgcolor` set above, so SELECT_BG has
                     * to be repeated here to actually be visible. Dev Mode: `padding:
                     * 13px 16px`.
                     */
                    '& .MuiSelect-select': {
                      bgcolor: SELECT_BG,
                      paddingBlock: '13px',
                      paddingLeft: '16px',
                    },
                    '& .MuiSelect-icon': { color: '#E2E2E2' },
                    /**
                     * No Focus state is documented anywhere in the design system (every
                     * captured `data-state` across all Figma-exports/*.html is only
                     * Default/Disabled), so no custom focus border is applied — matches
                     * Figma exactly and relies on the default (borderless) outline.
                     */
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  })}
                >
                  {createProposalActions.map(actionName => (
                    <MenuItem
                      key={actionName.value}
                      value={actionName.value}
                      data-testid={actionName.value}
                      /**
                       * No Figma export captures the open dropdown-list state directly,
                       * so there's no literal Dev Mode reading for this exact node. Without
                       * this override, MenuItem falls back to MUI's `theme.typography.body1`
                       * (Inter/400/16px) — visibly different from the confirmed "Body M"
                       * style (Lato/14px/22px) used for the same text once it's the folded
                       * value. Applying `selectValueSx` here keeps an option's appearance
                       * identical before/after selection, which is the only defensible
                       * default absent a direct spec for the list itself.
                       */
                      sx={selectValueSx}
                    >
                      {actionName.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/** export: button row is centered (not space-between), gap-3.5 (14px). */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px' }}>
            <form.Subscribe
              selector={state => state.canSubmit}
              children={canSubmit => (
                <>
                  <Button
                    variant="pill"
                    color="secondary"
                    size="large"
                    sx={cancelButtonSx}
                    data-testid="cancel-button"
                    onClick={handleCancel}
                    type="button"
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="pill"
                    size="large"
                    sx={nextButtonSx}
                    id="next-button"
                    data-testid="next-button"
                    type="submit"
                    disabled={!canSubmit}
                  >
                    Next
                  </Button>
                </>
              )}
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};
