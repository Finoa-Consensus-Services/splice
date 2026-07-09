// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';

const JSON_DIFF_FRAME_BACKGROUND = 'var(--grey54, #363636)';

const JSON_DIFF_VIEWPORT_MAX_HEIGHT = '320px';

const jsonDiffFrameSx = {
  display: 'flex',
  padding: '12px 24px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: JSON_DIFF_FRAME_BACKGROUND,
} as const;

const jsonDiffViewportSx = {
  width: '100%',
  maxHeight: JSON_DIFF_VIEWPORT_MAX_HEIGHT,
  overflowY: 'auto',
  overflowX: 'hidden',

  '& [data-testid="stringify-display"], & [data-testid="config-diffs-display"] .jsondiffpatch-delta, & [data-testid="config-diffs-display"] .jsondiffpatch-delta pre':
    {
      color: '#FFF',
      fontFamily: '"Source Code Pro", monospace',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '26px',
      fontFeatureSettings: "'liga' off, 'clig' off",
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
    },
  '& [data-testid="config-diffs-display"] .jsondiffpatch-delta': {
    display: 'block',
  },

  '& [data-testid="config-diffs-display"] ul.jsondiffpatch-delta, & [data-testid="config-diffs-display"] .jsondiffpatch-delta ul':
    {
      padding: 0,
      margin: 0,
    },

  '& [data-testid="config-diffs-display"] .jsondiffpatch-modified .jsondiffpatch-right-value': {
    marginLeft: 0,
  },
  '& [data-testid="config-diffs-display"] .jsondiffpatch-modified .jsondiffpatch-right-value::before':
    {
      content: '" -> "',
    },
} as const;

export const JsonDiffAccordion = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <Box>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="json-diff-content"
          id="json-diff-header"
        >
          <Typography variant="h6">JSON Diffs</Typography>
        </AccordionSummary>
        <AccordionDetails data-testid="json-diffs-details" sx={jsonDiffFrameSx}>
          <Box sx={jsonDiffViewportSx}>{children}</Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
