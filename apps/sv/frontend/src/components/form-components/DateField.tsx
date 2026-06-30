// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { GOVERNANCE_TEXT_FIELD_CLASS } from '@canton-network/splice-common-frontend';
import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { DesktopDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { dateTimeFormatISO } from '@canton-network/splice-common-frontend-utils';
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
        <Typography variant="fieldLabel" component="label" sx={{ mb: 1, display: 'block' }}>
          {title}
        </Typography>
      )}

      {description && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
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
              variant: 'filled',
              className: GOVERNANCE_TEXT_FIELD_CLASS,
              id: `${id}-field`,
              helperText: field.state.meta.errors?.[0],
              onBlur: field.handleBlur,
              slotProps: {
                htmlInput: {
                  'data-testid': `${id}-field`,
                },
                input: { disableUnderline: true },
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};
