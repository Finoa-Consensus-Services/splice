// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  Typography,
} from '@mui/material';
import { useFieldContext } from '../../hooks/formContext';
import {
  fieldDescriptionSx,
  fieldSectionSx,
  fieldSectionTitleSx,
  singleLineFieldSx,
} from '../../themes/fieldStyles';

export interface TextFieldProps {
  id: string;
  title: string;
  subtitle?: string;
  muiTextFieldProps?: MuiTextFieldProps;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export const TextField: React.FC<TextFieldProps> = props => {
  const { title, subtitle, id, muiTextFieldProps, onChange, onBlur } = props;
  const field = useFieldContext<string>();
  return (
    <Box sx={fieldSectionSx}>
      <Typography sx={fieldSectionTitleSx} id={`${id}-title`} data-testid={`${id}-title`}>
        {title}
      </Typography>

      <MuiTextField
        fullWidth
        variant="outlined"
        autoComplete="off"
        sx={singleLineFieldSx}
        value={field.state.value}
        onBlur={() => {
          field.handleBlur();
          onBlur?.();
        }}
        error={!field.state.meta.isValid}
        helperText={
          <Typography
            component="span"
            sx={fieldDescriptionSx}
            id={`${id}-error`}
            data-testid={`${id}-error`}
          >
            {field.state.meta.errors?.[0]}
          </Typography>
        }
        onChange={e => {
          field.handleChange(e.target.value);
          onChange?.(e.target.value);
        }}
        inputProps={{ 'data-testid': id }}
        id={id}
        {...muiTextFieldProps}
      />
      {subtitle && (
        <Typography sx={fieldDescriptionSx} data-testid={`${id}-subtitle`}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};
