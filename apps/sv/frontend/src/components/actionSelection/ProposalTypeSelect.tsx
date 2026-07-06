// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';

import { formTokens } from '../../theme/tokens';
import { createProposalActions } from '../../utils/governance';

const selectSx = {
  bgcolor: formTokens.surfaceInput,
  borderRadius: formTokens.radiusCard,
  color: formTokens.textSecondary,
  fontFamily: formTokens.fontUi,
  fontSize: '0.875rem',
  lineHeight: '20px',
  '&:hover': { bgcolor: formTokens.surfaceInput },
  '&.Mui-focused': { bgcolor: formTokens.surfaceInput },
  '& .MuiSelect-select, & .MuiOutlinedInput-input': {
    px: 2,
    py: 1.5,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: formTokens.surfaceInput,
    WebkitBoxShadow: `0 0 0 100px ${formTokens.surfaceInput} inset`,
    borderRadius: formTokens.radiusCard,
  },
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '& .MuiSelect-icon': { color: formTokens.textSecondary },
};

const menuPaperSx = {
  bgcolor: formTokens.surfaceInput,
  '& .MuiMenuItem-root': {
    fontFamily: formTokens.fontUi,
    fontSize: '0.875rem',
    color: formTokens.textSecondary,
    '&:hover': { bgcolor: formTokens.surfaceCard },
    '&.Mui-selected': {
      bgcolor: formTokens.surfaceCard,
      '&:hover': { bgcolor: formTokens.surfaceCard },
    },
  },
};

export interface ProposalTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export const ProposalTypeSelect: React.FC<ProposalTypeSelectProps> = ({
  value,
  onChange,
  onBlur,
}) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: formTokens.fieldMaxWidth,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    }}
  >
    <Typography
      component="label"
      htmlFor="select-action"
      sx={{
        fontFamily: formTokens.fontUi,
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        lineHeight: '20px',
        color: formTokens.textSecondary,
      }}
    >
      Select proposal type
    </Typography>

    <FormControl fullWidth data-testid="select-action">
      <Select
        labelId="select-action-label"
        id="select-action"
        displayEmpty
        value={value}
        onChange={(e: SelectChangeEvent) => onChange(e.target.value as string)}
        onBlur={onBlur}
        IconComponent={KeyboardArrowDownIcon}
        MenuProps={{ PaperProps: { sx: menuPaperSx } }}
        sx={selectSx}
      >
        {createProposalActions.map(actionName => (
          <MenuItem
            key={actionName.value}
            value={actionName.value}
            data-testid={actionName.value}
          >
            {actionName.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);
