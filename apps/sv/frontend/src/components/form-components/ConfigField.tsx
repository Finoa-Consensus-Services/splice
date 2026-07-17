// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { Link as RouterLink } from 'react-router';
import { Box, Divider, TextField as MuiTextField, Typography } from '@mui/material';
import type { FormHelperTextProps } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useFieldContext } from '../../hooks/formContext';
import type { ConfigChange, PendingConfigFieldInfo } from '../../utils/types';
import { getConfigFieldCurrentConfigurationValue } from '../../utils/migrationId';
import { nextScheduledSynchronizerUpgradeFormat } from '@canton-network/splice-common-frontend-utils';

dayjs.extend(relativeTime);

const configFieldErrorFormHelperTextProps = (testId: string): Partial<FormHelperTextProps> =>
  ({
    sx: {
      color: '#FD8575',
      fontFeatureSettings: "'liga' off, 'clig' off",
      fontFamily: 'Inter',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '16px',
      alignSelf: 'stretch',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      mx: 0,
      mt: 0.5,
    },
    'data-testid': testId,
  }) as Partial<FormHelperTextProps>;

export interface ConfigFieldProps {
  configChange: ConfigChange;
  effectiveDate?: string | undefined;
  currentMigrationId?: number | undefined;
  pendingFieldInfo?: PendingConfigFieldInfo;
}

export type ConfigFieldState = {
  fieldName: string;
  value: string;
};

export const ConfigField: React.FC<ConfigFieldProps> = props => {
  const { configChange, effectiveDate, currentMigrationId, pendingFieldInfo } = props;
  const field = useFieldContext<ConfigFieldState>();

  const isSynchronizerUpgradeTime = [
    'nextScheduledSynchronizerUpgradeTime',
    'nextScheduledLogicalSynchronizerUpgradeTopologyFreezeTime',
    'nextScheduledLogicalSynchronizerUpgradeUpgradeTime',
  ].includes(field.state.value?.fieldName);
  const isSynchronizerUpgradeMigrationIdField =
    field.state.value?.fieldName === 'nextScheduledSynchronizerUpgradeMigrationId';
  const isFieldEdited = !field.state.meta.isDefaultValue;

  // We disable the field if it is pending and the value is the default value.
  // The default value check is to handle the case where the user made a change
  // to the field before it became a field with pending changes.
  // This gives them the chance to revert that change.
  const isPendingAndDefaultValue =
    pendingFieldInfo !== undefined && field.state.meta.isDefaultValue;

  const isEffectiveAtThreshold = !effectiveDate;

  const isSynchronizerUpgradeField =
    field.state.value?.fieldName.startsWith('nextScheduledSynchronizerUpgrade') ||
    field.state.value?.fieldName.startsWith('nextScheduledLogicalSynchronizerUpgrade');

  // When effective at Threshold, we disable the upgrade time and migrationId config fields
  const isEffectiveAtThresholdAndSyncUpgradeTimeOrMigrationId =
    isEffectiveAtThreshold && (isSynchronizerUpgradeTime || isSynchronizerUpgradeField);

  const isDisabled =
    isPendingAndDefaultValue ||
    isEffectiveAtThresholdAndSyncUpgradeTimeOrMigrationId ||
    configChange.disabled;

  const displayedCurrentConfiguration = getConfigFieldCurrentConfigurationValue(
    configChange.fieldName,
    configChange.currentValue,
    currentMigrationId
  );
  const fieldError = field.state.meta.errors?.[0];
  const showFieldError = !field.state.meta.isValid && Boolean(fieldError);

  const showCurrentConfiguration = isFieldEdited && !isSynchronizerUpgradeTime;
  const showCurrentConfigurationSubtext =
    showCurrentConfiguration && (!showFieldError || isSynchronizerUpgradeMigrationIdField);

  const textFieldProps = {
    variant: 'outlined' as const,
    size: 'small' as const,
    ...(showFieldError
      ? {}
      : {
          color: field.state.meta.isDefaultValue ? ('primary' as const) : ('secondary' as const),
          focused: !field.state.meta.isDefaultValue,
        }),
    autoComplete: 'off' as const,
    inputProps: {
      sx: { textAlign: 'right' },
      'data-testid': `config-field-${configChange.fieldName}`,
    },
    disabled: isDisabled,
    FormHelperTextProps: showFieldError
      ? configFieldErrorFormHelperTextProps(`config-field-error-${configChange.fieldName}`)
      : undefined,
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, pr: 2 }}>
          <Typography variant="body1" data-testid={`config-label-${configChange.fieldName}`}>
            {configChange.label}
          </Typography>
          <Typography
            fontFamily="'Source Code Pro', monospace"
            color="colors.neutral.70"
            sx={{ mt: 1 }}
            data-testid={`config-field-name-${configChange.fieldName}`}
          >
            {configChange.fieldName}
          </Typography>
        </Box>

        <Box sx={{ width: 250, maxWidth: '100%', flexShrink: 0, minWidth: 0 }}>
          <MuiTextField
            {...textFieldProps}
            fullWidth
            error={showFieldError}
            helperText={showFieldError ? fieldError : undefined}
            // We choose empty string to represent fields that could be undefined because their values have not been set.
            value={field.state.value?.value || ''}
            onBlur={field.handleBlur}
            onChange={e =>
              field.handleChange({
                fieldName: configChange.fieldName,
                value: e.target.value,
              })
            }
          />

          {showCurrentConfigurationSubtext && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: 'block' }}
              data-testid={`config-current-value-${configChange.fieldName}`}
            >
              Current Configuration: {displayedCurrentConfiguration}
            </Typography>
          )}

          {isSynchronizerUpgradeMigrationIdField && !isFieldEdited && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: 'block' }}
              data-testid="nextScheduledSynchronizerUpgradeMigrationId-current"
            >
              {currentMigrationId !== undefined
                ? `Current migration ID: ${currentMigrationId}`
                : 'Current migration ID unavailable'}
            </Typography>
          )}

          {isSynchronizerUpgradeTime && (
            <SynchronizerUpgradeTimeDisplay
              fieldName={field.state.value?.fieldName || ''}
              effectiveDate={effectiveDate}
              configChange={configChange}
            />
          )}

          {pendingFieldInfo && <PendingConfigDisplay pendingFieldInfo={pendingFieldInfo} />}
        </Box>
      </Box>
      <Divider />
    </>
  );
};

interface PendingConfigDisplayProps {
  pendingFieldInfo: PendingConfigFieldInfo;
}

export const PendingConfigDisplay: React.FC<PendingConfigDisplayProps> = ({ pendingFieldInfo }) => {
  const { fieldName, pendingValue, proposalCid, effectiveDate } = pendingFieldInfo;
  const effectiveText =
    effectiveDate === 'Threshold' ? 'at Threshold' : dayjs(effectiveDate).fromNow();

  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}
      data-testid={`config-pending-value-${fieldName}`}
    >
      Pending Configuration: <strong>{pendingValue}</strong> <br />
      This{' '}
      <RouterLink
        to={`/governance/proposals/${proposalCid}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'inherit' }}
      >
        pending configuration
      </RouterLink>{' '}
      will go into effect <strong>{effectiveText}</strong>
    </Typography>
  );
};

interface SynchronizerUpgradeTimeDisplayProps {
  effectiveDate: string | undefined;
  fieldName: string;
  configChange: ConfigChange;
}

export const synchronizerUpgradeTimeDefault = (
  fieldName: string,
  effectiveDate: string | undefined
): dayjs.Dayjs => {
  const defaultTime = dayjs(effectiveDate).utc().add(1, 'hour');
  return fieldName == 'nextScheduledLogicalSynchronizerUpgradeUpgradeTime'
    ? defaultTime.add(1, 'day')
    : defaultTime;
};

export const SynchronizerUpgradeTimeDisplay: React.FC<
  SynchronizerUpgradeTimeDisplayProps
> = props => {
  const { effectiveDate, fieldName } = props;
  const defaultMigrationTime = synchronizerUpgradeTimeDefault(fieldName, effectiveDate).format(
    nextScheduledSynchronizerUpgradeFormat
  );

  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}
      data-testid={`${fieldName}-default`}
    >
      {`Default: ${defaultMigrationTime}`}
    </Typography>
  );
};
