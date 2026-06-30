// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { GOVERNANCE_SELECT_CLASS, governanceSelectRenderValueSx } from '@canton-network/splice-common-frontend';
import {
  Box,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import type { FormEvent } from 'react';
import { useFieldContext } from '../../hooks/formContext';

export type Option = { key: string; value: string };
export interface SelectFieldProps {
  title: string;
  options: Option[];
  id: string;
  onChange?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const SelectField: React.FC<SelectFieldProps> = props => {
  const { title, options, id, disabled = false, placeholder } = props;
  const externalOnChange = props.onChange ?? (() => {});
  const field = useFieldContext<string>();
  const handleSelectValueChange = (value: string) => {
    field.handleChange(value);
    externalOnChange();
  };

  const showPlaceholder = !!placeholder && !field.state.value;
  const isError = !field.state.meta.isValid && !showPlaceholder;

  return (
    <Box data-testid={`${id}-select-component`}>
      <Typography variant="fieldLabel" component="label" sx={{ mb: 2, display: 'block' }}>
        {title}
      </Typography>

      <FormControl error={isError} fullWidth>
        <Select
          variant="filled"
          disableUnderline
          className={GOVERNANCE_SELECT_CLASS}
          value={field.state.value}
          displayEmpty
          renderValue={selected => {
            if (!selected) {
              return showPlaceholder ? (
                <Typography component="span" variant="fieldPlaceholder" sx={governanceSelectRenderValueSx}>
                  {placeholder}
                </Typography>
              ) : (
                ''
              );
            }
            return (
              <Typography component="span" variant="fieldValue" sx={governanceSelectRenderValueSx}>
                {options.find(option => option.value === selected)?.key ?? selected}
              </Typography>
            );
          }}
          onChange={(e: SelectChangeEvent) => {
            handleSelectValueChange(e.target.value as string);
          }}
          onBlur={field.handleBlur}
          error={isError}
          disabled={disabled}
          id={`${id}-dropdown`}
          data-testid={id}
          inputProps={{
            'data-testid': `${id}-dropdown`,
            onChange: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              handleSelectValueChange((e.target as HTMLInputElement).value);
            },
          }}
        >
          {options.map((member, index) => (
            <MenuItem
              key={'option-' + index}
              value={member.value}
              data-testid={`option-${member.key}`}
            >
              {member.key}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText data-testid={`${id}-error`}>
          {isError ? field.state.meta.errors?.[0] : undefined}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};
