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
import { useForm } from '@tanstack/react-form';
import { useNavigate } from 'react-router';
import {
  CREATE_PROPOSAL_CARD_SX,
  CREATE_PROPOSAL_FIELD_COLUMN_SX,
  CREATE_PROPOSAL_FIELD_LABEL_SX,
} from '../../constants/createProposalLayout';
import { createProposalActions } from '../../utils/governance';

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
    <Box>
      <Paper elevation={0} sx={CREATE_PROPOSAL_CARD_SX}>
        <Box sx={CREATE_PROPOSAL_FIELD_COLUMN_SX}>
          <Typography sx={{ ...CREATE_PROPOSAL_FIELD_LABEL_SX, mb: 2 }}>
            Select an Action
          </Typography>

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
                <FormControl fullWidth>
                  <Select
                    labelId="select-action-label"
                    id="select-action"
                    data-testid="select-action"
                    value={field.state.value}
                    onChange={(e: SelectChangeEvent) =>
                      field.handleChange(e.target.value as string)
                    }
                    onBlur={field.handleBlur}
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <form.Subscribe
                selector={state => state.canSubmit}
                children={canSubmit => (
                  <>
                    <Button
                      variant="outlined"
                      data-testid="cancel-button"
                      onClick={handleCancel}
                      type="button"
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="contained"
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
      </Paper>
    </Box>
  );
};
