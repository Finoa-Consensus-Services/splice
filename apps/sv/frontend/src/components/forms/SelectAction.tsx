// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { GOVERNANCE_SELECT_CLASS, governanceFormCardPadding, governanceFormInnerSx, governanceSelectRenderValueSx } from '@canton-network/splice-common-frontend';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from 'react-router';
import { createProposalActions } from '../../utils/governance';

const PROPOSAL_TYPE_LABEL = 'Select proposal type';
const PROPOSAL_TYPE_PLACEHOLDER = 'Select a proposal type';

const validateProposalType = (value: string) => {
  if (!value) {
    return 'Select a proposal type';
  }
  const res = createProposalActions.find(a => a.value === value);
  return res ? undefined : 'Invalid action';
};

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
    <Box data-testid="select-action-form" id="select-action-form" sx={{ width: '100%' }}>
      <Paper variant="governance-card" elevation={0} sx={governanceFormCardPadding}>
        <Box
          component="form"
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          sx={{ ...governanceFormInnerSx, gap: 4 }}
        >
          <form.Field
            name="action"
            validators={{
              onMount: ({ value }) => validateProposalType(value),
              onChange: ({ value }) => validateProposalType(value),
            }}
            children={field => (
              <FormControl fullWidth>
                <Typography
                  id="select-proposal-type-label"
                  component="label"
                  variant="fieldLabel"
                  sx={{ mb: 2, display: 'block' }}
                >
                  {PROPOSAL_TYPE_LABEL}
                </Typography>
                <Select
                  variant="filled"
                  disableUnderline
                  className={GOVERNANCE_SELECT_CLASS}
                  labelId="select-proposal-type-label"
                  id="select-action"
                  data-testid="select-action"
                  displayEmpty
                  value={field.state.value}
                  onChange={(e: SelectChangeEvent) =>
                    field.handleChange(e.target.value as string)
                  }
                  onBlur={field.handleBlur}
                  renderValue={selected => {
                    if (!selected) {
                      return (
                        <Typography
                          component="span"
                          variant="fieldPlaceholder"
                          sx={governanceSelectRenderValueSx}
                        >
                          {PROPOSAL_TYPE_PLACEHOLDER}
                        </Typography>
                      );
                    }
                    return (
                      <Typography component="span" variant="fieldValue" sx={governanceSelectRenderValueSx}>
                        {createProposalActions.find(a => a.value === selected)?.name ?? ''}
                      </Typography>
                    );
                  }}
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
            )}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1.75,
              alignSelf: 'stretch',
            }}
          >
            <form.Subscribe
              selector={state => state.canSubmit}
              children={canSubmit => (
                <>
                  <Button
                    type="button"
                    variant="pill"
                    color="secondary"
                    data-testid="cancel-button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="pill"
                    color="primary"
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
        </Box>
      </Paper>
    </Box>
  );
};
