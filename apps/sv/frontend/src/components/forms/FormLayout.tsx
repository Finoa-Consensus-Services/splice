// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  governanceFormCardPadding,
  governanceFormInnerSx,
} from '@canton-network/splice-common-frontend';
import { Box, Paper } from '@mui/material';

export interface FormLayoutProps {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  id: string;
}

export const FormLayout: React.FC<FormLayoutProps> = props => {
  const { children, form, id } = props;

  return (
    <Box data-testid={id} id={id} sx={{ width: '100%' }}>
      <Paper variant="governance-card" elevation={0} sx={governanceFormCardPadding}>
        <Box
          component="form"
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          sx={governanceFormInnerSx}
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );
};
