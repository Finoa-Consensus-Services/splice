// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { GOVERNANCE_TEXT_FIELD_CLASS } from '@canton-network/splice-common-frontend';
import { Box, TextField as MuiTextField, Typography } from '@mui/material';
import { useFieldContext } from '../../hooks/formContext';
import { useDsoInfos } from '../../contexts/SvContext';
import {
  DEFAULT_PROPOSAL_SUMMARY_MAX_LENGTH,
  PROPOSAL_SUMMARY_SUBTITLE,
  PROPOSAL_SUMMARY_TITLE,
} from '../../utils/constants';

export interface ProposalSummaryFieldProps {
  id: string;
  title?: string;
  optional?: boolean;
  subtitle?: string;
}

export const ProposalSummaryField: React.FC<ProposalSummaryFieldProps> = props => {
  const { title, optional, id, subtitle } = props;
  const field = useFieldContext<string>();
  const dsoInfosQuery = useDsoInfos();
  const maxLength = Number(
    dsoInfosQuery.data?.dsoRules.payload.config.maxTextLength ?? DEFAULT_PROPOSAL_SUMMARY_MAX_LENGTH
  );
  const currentLength = field.state.value.length;

  return (
    <Box>
      <Typography variant="fieldLabel" component="label" sx={{ mb: 1, display: 'block' }}>
        {title || PROPOSAL_SUMMARY_TITLE}
        {optional && (
          <Typography component="span" variant="fieldPlaceholder" sx={{ ml: 1, textTransform: 'none' }}>
            optional
          </Typography>
        )}
      </Typography>
      <MuiTextField
        fullWidth
        multiline
        rows={5}
        variant="filled"
        className={GOVERNANCE_TEXT_FIELD_CLASS}
        autoComplete="off"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.value)}
        error={!field.state.meta.isValid}
        helperText={
          <Typography variant="caption" component="span" data-testid={`${id}-error`}>
            {field.state.meta.errors?.[0]}
          </Typography>
        }
        slotProps={{
          input: { disableUnderline: true },
        }}
        inputProps={{ 'data-testid': id, maxLength }}
        id={id}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 1,
          gap: 2,
        }}
      >
        <Typography variant="body2" data-testid={`${id}-subtitle`}>
          {subtitle || PROPOSAL_SUMMARY_SUBTITLE}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          data-testid={`${id}-character-counter`}
          sx={{ flexShrink: 0 }}
        >
          {currentLength}/{maxLength}
        </Typography>
      </Box>
    </Box>
  );
};
