// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { DesktopDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { dateTimeFormatISO } from '@canton-network/splice-common-frontend-utils';
import {
  CREATE_PROPOSAL_FIELD_HELPER_SX,
  CREATE_PROPOSAL_FIELD_LABEL_SX,
} from '../../constants/createProposalLayout';
import { useFieldContext } from '../../hooks/formContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export interface DateFieldProps {
  title?: string;
  description?: string;
  minDate?: Dayjs;
  id: string;
}

export const DateField: React.FC<DateFieldProps> = props => {
  const { title, description, minDate, id } = props;
  const field = useFieldContext<string>();

  const dateValue = useMemo(() => dayjs(field.state.value), [field.state.value]);

  return (
    <Box>
      {title && (
        <Typography component="p" sx={{ ...CREATE_PROPOSAL_FIELD_LABEL_SX, mb: 1 }}>
          {title}
        </Typography>
      )}

      {description && (
        <Typography component="p" sx={{ ...CREATE_PROPOSAL_FIELD_HELPER_SX, mb: 1 }}>
          {description}
        </Typography>
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDateTimePicker
          value={dateValue}
          format={dateTimeFormatISO}
          minDateTime={minDate || dayjs()}
          ampm={false}
          onChange={newDate => field.handleChange(newDate?.format(dateTimeFormatISO)!)}
          enableAccessibleFieldDOMStructure={false}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
              id: `${id}-field`,
              helperText: field.state.meta.errors?.[0],
              onBlur: field.handleBlur,
              inputProps: {
                'data-testid': `${id}-field`,
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};
