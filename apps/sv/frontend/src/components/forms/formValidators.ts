// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import dayjs from 'dayjs';
import { z } from 'zod';
import { nextScheduledSynchronizerUpgradeFormat } from '@canton-network/splice-common-frontend-utils';
import { validateMigrationIdAgainstCurrent } from '../../utils/migrationId';
import type { EffectivityType } from '../../utils/types';
import type { CommonProposalFormData, ConfigFormData } from '../../utils/types';
import { isValidUrl } from '../../utils/validations';

export const urlSchema = z.string().refine(url => isValidUrl(url), {
  message: 'Invalid URL',
});

export const summarySchema = z.string().min(1, { message: 'Summary is required' });

export const svSelectionSchema = z.string().min(1, { message: 'SV is required' });

const getExpirationSchema = (errMessage: string) => {
  return z.string().refine(date => dayjs(date).isAfter(dayjs()), {
    message: errMessage,
  });
};

export const expirationSchema = getExpirationSchema('Expiration must be in the future');

export const mintBeforeSchema = getExpirationSchema('Date must be in the future');

export const effectiveDateSchema = z.string().refine(date => dayjs(date).isAfter(dayjs()), {
  message: 'Effective Date must be in the future',
});

export const expiryEffectiveDateSchema = z
  .object({
    expiration: z.string(),
    effectiveDate: z.string(),
  })
  .refine(({ expiration, effectiveDate }) => dayjs(expiration).isBefore(dayjs(effectiveDate)), {
    message: 'Effective Date must be after expiration date',
    path: ['effectiveDate'],
  });

export const revokeFeaturedAppRightSchema = z.string().min(1, { message: 'Required' });

export const partyIdSchema = z
  .string()
  .min(1, { message: 'Required' })
  .regex(/^[a-zA-Z0-9_-]+::[a-zA-Z0-9_-]+$/, {
    message: 'Invalid PartyId format. Expected format: identifier::fingerprint',
  });

export const svWeightSchema = z
  .string()
  .min(1, { message: 'Weight is required' })
  .regex(/^\d+_\d{4}$/, {
    message: 'Weight must be expressed in basis points using fixed point notation, XX...X_XXXX',
  });

export const rewardAmountSchema = z
  .string()
  .min(1, { message: 'Amount is required' })
  .regex(/^\d+(\.\d+)?$/, { message: 'Amount must be a valid number' })
  .refine(
    v => {
      const dotIndex = v.indexOf('.');
      return dotIndex === -1 || v.length - dotIndex - 1 <= 10;
    },
    { message: 'Amount can have at most 10 decimal places' }
  );

export const activityWeightSchema = z
  .string()
  .refine(v => v === '' || /^\d+(\.\d+)?$/.test(v), {
    message: 'Weight must be a valid non-negative number',
  })
  .refine(
    v => {
      const dotIndex = v.indexOf('.');
      return dotIndex === -1 || v.length - dotIndex - 1 <= 10;
    },
    { message: 'Weight can have at most 10 decimal places' }
  );

export const validateWeight = (value: string): string | false => {
  const result = svWeightSchema.safeParse(value);
  return result.success ? false : result.error.issues[0].message;
};

export const validateRewardAmount = (value: string): string | false => {
  const result = rewardAmountSchema.safeParse(value);
  return result.success ? false : result.error.issues[0].message;
};

export const validateActivityWeight = (value: string): string | false => {
  const result = activityWeightSchema.safeParse(value);
  return result.success ? false : result.error.issues[0].message;
};

export const validateSvSelection = (value: string): string | false => {
  const result = svSelectionSchema.safeParse(value);
  return result.success ? false : result.error.issues[0].message;
};

export const validateExpiration = (value: string): string | false => {
  const result = expirationSchema.safeParse(value);
  return result.success ? false : result.error.issues[0].message;
};

export const validateMintBefore = (value: string): string | false => {
  const result = mintBeforeSchema.safeParse(value);
  return result.success ? false : result.error.issues[0].message;
};

export const validateMintedBeneficiary = (value: string): string | false => {
  const schema = z.string().min(1, { message: 'Beneficiary is required' });

  const result = schema.safeParse(value);
  return result.success ? false : result.error.issues[0].message;
};

export const validateEffectiveDate = (value: {
  type: EffectivityType;
  effectiveDate: string | undefined;
}): string | false => {
  // nothing to validate if effective at threshold
  if (value.type === 'threshold') return false;

  const result = effectiveDateSchema.safeParse(value.effectiveDate);
  return result.success ? false : result.error.issues[0].message;
};

export const validateExpiryEffectiveDate = (value: {
  expiration: string;
  effectiveDate?: string;
}): string | false => {
  if (!value.effectiveDate) return false;

  const result = expiryEffectiveDateSchema.safeParse(value);
  return result.success ? false : result.error.issues[0].message;
};

export const validateMintBeforeAndEffectiveDate = (value: {
  effectiveDate?: string;
  mintBefore: string;
}): string | false => {
  if (!value.effectiveDate) return false;

  const schema = z
    .object({
      effectiveDate: z.string(),
      mintBefore: z.string(),
    })
    .refine(
      ({ effectiveDate, mintBefore }) =>
        dayjs(mintBefore).isAfter(dayjs(effectiveDate).add(2, 'hour')),
      {
        message: 'Mint Before date must be at least 2 hours after Effective Date',
        path: ['mintBefore'],
      }
    );

  const result = schema.safeParse(value);
  return result.success ? false : result.error.issues[0].message;
};

export const validateSummary = (value: string): string | false => {
  const result = summarySchema.safeParse(value);
  return result.success ? false : result.error.issues[0].message;
};

export const validateUrl = (value: string): string | false => {
  const result = urlSchema.safeParse(value);
  return result.success ? false : result.error.issues[0].message;
};

export const validateRevokeFeaturedAppRight = (value: string): string | false => {
  const result = revokeFeaturedAppRightSchema.safeParse(value);
  return result.success ? false : result.error.issues[0].message;
};

export const validatePartyId = (value: string): string | false => {
  const result = partyIdSchema.safeParse(value);
  return result.success ? false : result.error.issues[0].message;
};

const isValidSynchronizerUpgradeTimeFormat = (value: string): boolean =>
  dayjs.utc(value, nextScheduledSynchronizerUpgradeFormat, true).isValid();

export const SYNCHRONIZER_UPGRADE_MUTUAL_REQUIREMENT_MESSAGE =
  'Upgrade Time and Migration ID are required for a Scheduled Synchronizer Upgrade';

type SynchronizerUpgradeErrorField = 'migrationId' | 'upgradeTime' | 'both';

type SynchronizerUpgradeValidationResult =
  | false
  | { field: SynchronizerUpgradeErrorField; message: string };

const normalizeSynchronizerUpgradeFields = (upgradeTime: string, migrationId: string) => ({
  upgradeTime: upgradeTime.trim(),
  migrationId: migrationId.trim(),
});

const validateNextScheduledSynchronizerUpgradeResult = (
  upgradeTime: string,
  migrationId: string,
  effectiveDate: string | undefined,
  currentMigrationId: number | undefined
): SynchronizerUpgradeValidationResult => {
  // Physical synchronizer upgrade fields are disabled for effective-at-threshold proposals.
  if (effectiveDate === undefined) {
    return false;
  }

  const { upgradeTime: normalizedUpgradeTime, migrationId: normalizedMigrationId } =
    normalizeSynchronizerUpgradeFields(upgradeTime, migrationId);
  const onlyOneIsProvided = (normalizedUpgradeTime === '') !== (normalizedMigrationId === '');
  const bothEmpty = normalizedUpgradeTime === '' && normalizedMigrationId === '';

  if (bothEmpty) {
    return false;
  }

  if (onlyOneIsProvided) {
    return { field: 'both', message: SYNCHRONIZER_UPGRADE_MUTUAL_REQUIREMENT_MESSAGE };
  }

  if (!isValidSynchronizerUpgradeTimeFormat(normalizedUpgradeTime)) {
    return {
      field: 'upgradeTime',
      message: `Upgrade Time must be in ${nextScheduledSynchronizerUpgradeFormat} format`,
    };
  }

  const migrationIdError = validateMigrationIdAgainstCurrent(
    normalizedMigrationId,
    currentMigrationId
  );
  if (migrationIdError) {
    return { field: 'migrationId', message: migrationIdError };
  }

  const upgradeTimeDate = dayjs.utc(normalizedUpgradeTime);
  const effectivity = dayjs(effectiveDate);

  const upgradeTimeIsAfterEffectiveDate = upgradeTimeDate.isAfter(effectivity.add(1, 'hour'));
  if (!upgradeTimeIsAfterEffectiveDate) {
    return {
      field: 'upgradeTime',
      message: 'Upgrade Time must be at least 1 hour after the Effective Date',
    };
  }

  return false;
};

export const validateNextScheduledSynchronizerUpgrade = (
  upgradeTime: string,
  migrationId: string,
  effectiveDate: string | undefined,
  currentMigrationId: number | undefined
): string | false => {
  const result = validateNextScheduledSynchronizerUpgradeResult(
    upgradeTime,
    migrationId,
    effectiveDate,
    currentMigrationId
  );

  return result ? result.message : false;
};

type SynchronizerUpgradeField = 'migrationId' | 'upgradeTime';

export const getSynchronizerUpgradeFieldError = (
  field: SynchronizerUpgradeField,
  upgradeTime: string,
  migrationId: string,
  effectiveDate: string | undefined,
  currentMigrationId: number | undefined
): string | false => {
  if (effectiveDate === undefined) {
    return false;
  }

  const { upgradeTime: normalizedUpgradeTime, migrationId: normalizedMigrationId } =
    normalizeSynchronizerUpgradeFields(upgradeTime, migrationId);

  if (normalizedMigrationId === '' && normalizedUpgradeTime === '') {
    return false;
  }

  if (field === 'migrationId' && normalizedMigrationId !== '') {
    const migrationIdError = validateMigrationIdAgainstCurrent(
      normalizedMigrationId,
      currentMigrationId
    );
    if (migrationIdError) {
      return migrationIdError;
    }
  }

  const result = validateNextScheduledSynchronizerUpgradeResult(
    normalizedUpgradeTime,
    normalizedMigrationId,
    effectiveDate,
    currentMigrationId
  );
  if (!result) {
    return false;
  }

  if (field === 'migrationId') {
    return result.field === 'migrationId' || result.field === 'both' ? result.message : false;
  }

  if (result.field === 'upgradeTime') {
    return result.message;
  }

  return result.field === 'both' && normalizedUpgradeTime !== '' ? result.message : false;
};

export const validateSetDsoConfigRulesFormFields = (
  formData: { common: CommonProposalFormData; config: ConfigFormData },
  currentMigrationId: number | undefined
): string | false => {
  const expiryError = validateExpiryEffectiveDate({
    expiration: formData.common.expiryDate,
    effectiveDate: formData.common.effectiveDate.effectiveDate,
  });

  if (expiryError) return expiryError;

  const effectiveDate = formData.common.effectiveDate.effectiveDate;
  const syncUpgradeTime = formData.config.nextScheduledSynchronizerUpgradeTime?.value ?? '';
  const syncMigrationId = formData.config.nextScheduledSynchronizerUpgradeMigrationId?.value ?? '';

  const synchronizerUpgradeError = validateNextScheduledSynchronizerUpgrade(
    syncUpgradeTime,
    syncMigrationId,
    effectiveDate,
    currentMigrationId
  );
  if (synchronizerUpgradeError) return synchronizerUpgradeError;

  const logicalSynchronizerUpgradeError = validateNextScheduledLogicalSynchronizerUpgrade(
    formData.config.nextScheduledLogicalSynchronizerUpgradeTopologyFreezeTime?.value ?? '',
    formData.config.nextScheduledLogicalSynchronizerUpgradeUpgradeTime?.value ?? '',
    formData.config.nextScheduledLogicalSynchronizerUpgradeNewPhysicalSynchronizerSerial?.value ??
      '',
    formData.config.nextScheduledLogicalSynchronizerUpgradeNewPhysicalSynchronizerProtocolVersion
      ?.value ?? '',
    effectiveDate
  );
  if (logicalSynchronizerUpgradeError) return logicalSynchronizerUpgradeError;

  return false;
};

export const validateNextScheduledLogicalSynchronizerUpgrade = (
  topologyFreezeTime: string,
  upgradeTime: string,
  newPhyiscalSynchronizerSerial: string,
  newPhyiscalSynchronizerProtocolVersion: string,
  effectiveDate: string | undefined
): string | false => {
  const all = [
    topologyFreezeTime,
    upgradeTime,
    newPhyiscalSynchronizerSerial,
    newPhyiscalSynchronizerProtocolVersion,
  ];

  if (all.every(value => value === '')) {
    return false;
  }

  if (!all.every(value => value !== '')) {
    return 'Topology freeze time, upgrade time, new physical synchronizer serial, and new physical synchronizer protocol version are required for a Scheduled Logical Synchronizer Upgrade';
  }

  const freezeTimeDate = dayjs.utc(topologyFreezeTime);
  const effectivity = dayjs(effectiveDate);

  const freezeTimeIsAfterEffectiveDate = freezeTimeDate.isAfter(effectivity.add(1, 'hour'));
  if (!freezeTimeIsAfterEffectiveDate) {
    return 'Topology Freeze Time must be at least 1 hour after the Effective Date';
  }

  const upgradeTimeDate = dayjs.utc(upgradeTime);
  if (!upgradeTimeDate.isAfter(freezeTimeDate)) {
    return 'Upgrade Time must be after Topology Freeze Time';
  }

  return false;
};
