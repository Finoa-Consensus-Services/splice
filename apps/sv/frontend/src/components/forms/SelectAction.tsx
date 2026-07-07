// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import { Box } from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from 'react-router';

import { ProposalTypeSelect } from '../actionSelection/ProposalTypeSelect';
import { SvPrimaryButton, SvSecondaryButton } from '../ui/SvButton';
import {
  ACTION_SELECTION_BUTTON_GAP,
  ACTION_SELECTION_CARD_PY,
  ACTION_SELECTION_FIELD_GAP,
  formTokens,
} from '../../theme/tokens';
import { createProposalActions } from '../../utils/governance';
import type { SupportedActionTag } from '../../utils/types';

export const SelectAction: React.FC = () => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      action: createProposalActions[0].value,
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
        bgcolor: formTokens.surfaceCard,
        borderRadius: formTokens.radiusCard,
        py: ACTION_SELECTION_CARD_PY,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        component="form"
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        sx={{
          width: '100%',
          maxWidth: formTokens.fieldMaxWidth,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: ACTION_SELECTION_FIELD_GAP,
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
            <ProposalTypeSelect
              value={field.state.value}
              onChange={value => field.handleChange(value as SupportedActionTag)}
              onBlur={field.handleBlur}
            />
          )}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: ACTION_SELECTION_BUTTON_GAP,
          }}
        >
          <SvSecondaryButton
            data-testid="cancel-button"
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </SvSecondaryButton>

          <form.Subscribe
            selector={state => state.canSubmit}
            children={canSubmit => (
              <SvPrimaryButton
                id="next-button"
                data-testid="next-button"
                type="submit"
                disabled={!canSubmit}
              >
                Next
              </SvPrimaryButton>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};
