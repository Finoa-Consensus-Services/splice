// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  Typography,
} from '@mui/material';
import {
  CREATE_PROPOSAL_FIELD_HELPER_SX,
  CREATE_PROPOSAL_FIELD_LABEL_SX,
} from '../../constants/createProposalLayout';
import { useFieldContext } from '../../hooks/formContext';
import { validateWeight } from '../forms/formValidators';
import { formatBasisPointsPlain, getWeightDiff } from '../../utils/governance';
import { WeightDiffIndicator } from '../governance/WeightDiffIndicator';

export interface TextFieldProps {
  id: string;
  title: string;
  subtitle?: string;
  /** When set, highlights the field and shows a diff row when the value differs. */
  compareValue?: string;
  muiTextFieldProps?: MuiTextFieldProps;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export const TextField: React.FC<TextFieldProps> = props => {
  const { title, subtitle, id, compareValue, muiTextFieldProps, onChange, onBlur } = props;
  const field = useFieldContext<string>();
  const fieldValue = field.state.value;
  const weightDiff = compareValue !== undefined ? getWeightDiff(compareValue, fieldValue) : null;
  const hasWeightChange =
    compareValue !== undefined &&
    compareValue !== '' &&
    fieldValue !== '' &&
    validateWeight(fieldValue) === false &&
    weightDiff !== null &&
    weightDiff !== 0;

  return (
    <Box>
      <Typography
        component="p"
        id={`${id}-title`}
        data-testid={`${id}-title`}
        sx={{ ...CREATE_PROPOSAL_FIELD_LABEL_SX, mb: 1 }}
      >
        {title}
      </Typography>

      <MuiTextField
        fullWidth
        variant="outlined"
        autoComplete="off"
        value={fieldValue}
        color={hasWeightChange ? 'secondary' : undefined}
        focused={hasWeightChange ? true : undefined}
        onBlur={() => {
          field.handleBlur();
          onBlur?.();
        }}
        error={!field.state.meta.isValid}
        helperText={
          <Typography
            component="span"
            id={`${id}-error`}
            data-testid={`${id}-error`}
            sx={{ ...CREATE_PROPOSAL_FIELD_HELPER_SX, color: 'inherit' }}
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
      {hasWeightChange && compareValue !== undefined ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Typography
            component="p"
            data-testid={`${id}-current-weight`}
            sx={CREATE_PROPOSAL_FIELD_HELPER_SX}
          >
            Current weight: {formatBasisPointsPlain(compareValue)}
          </Typography>
          <WeightDiffIndicator
            current={compareValue}
            next={fieldValue}
            data-testid={`${id}-diff`}
          />
        </Box>
      ) : (
        subtitle && (
          <Typography
            component="p"
            data-testid={`${id}-subtitle`}
            sx={{ ...CREATE_PROPOSAL_FIELD_HELPER_SX, mt: 1 }}
          >
            {subtitle}
          </Typography>
        )
      )}
    </Box>
  );
};
