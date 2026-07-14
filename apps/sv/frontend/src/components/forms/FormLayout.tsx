// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { Box, Paper } from '@mui/material';
import {
  CREATE_PROPOSAL_CARD_SX,
  CREATE_PROPOSAL_FIELD_COLUMN_SX,
  CREATE_PROPOSAL_SECTION_GAP,
} from '../../constants/createProposalLayout';

export interface FormLayoutProps {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  id: string;
  actionName: string;
  isReviewStep?: boolean;
}

export const FormLayout: React.FC<FormLayoutProps> = props => {
  const { children, form, id } = props;

  return (
    <Box data-testid={id} id={id}>
      <Paper elevation={0} sx={CREATE_PROPOSAL_CARD_SX}>
        <Box sx={CREATE_PROPOSAL_FIELD_COLUMN_SX}>
          <form
            onSubmit={e => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: CREATE_PROPOSAL_SECTION_GAP }}
            >
              {children}
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};
