// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, test } from 'vitest';
import { dsoInfo } from '@canton-network/splice-common-test-handlers';
import { Contract } from '@canton-network/splice-common-frontend-utils';
import { AmuletRules } from '@daml.js/splice-amulet/lib/Splice/AmuletRules';
import { SvNodeState } from '@daml.js/splice-dso-governance/lib/Splice/DSO/SvState';
import { DsoRules } from '@daml.js/splice-dso-governance/lib/Splice/DsoRules';
import type { DsoInfo } from '@canton-network/splice-common-frontend';
import {
  getCurrentMigrationIdFromDsoInfo,
  getConfigFieldCurrentConfigurationValue,
  isValidMigrationIdFormat,
  MIGRATION_ID_WHOLE_NUMBER_ERROR,
  validateMigrationIdAgainstCurrent,
} from '../../utils/migrationId';
import {
  validateNextScheduledSynchronizerUpgrade,
  getSynchronizerUpgradeFieldError,
  SYNCHRONIZER_UPGRADE_MUTUAL_REQUIREMENT_MESSAGE,
} from '../../components/forms/formValidators';
import { nextScheduledSynchronizerUpgradeFormat } from '@canton-network/splice-common-frontend-utils';

const testDsoInfo: DsoInfo = {
  svUser: dsoInfo.sv_user,
  svPartyId: dsoInfo.sv_party_id,
  dsoPartyId: dsoInfo.dso_party_id,
  votingThreshold: BigInt(dsoInfo.voting_threshold),
  amuletRules: Contract.decodeOpenAPI(dsoInfo.amulet_rules.contract, AmuletRules),
  dsoRules: Contract.decodeOpenAPI(dsoInfo.dso_rules.contract, DsoRules),
  nodeStates: dsoInfo.sv_node_states.map(c => Contract.decodeOpenAPI(c.contract, SvNodeState)),
};

describe('migrationId utils', () => {
  test('getCurrentMigrationIdFromDsoInfo reads sequencer migration id from node states', () => {
    expect(getCurrentMigrationIdFromDsoInfo(testDsoInfo)).toBe(0);
  });

  test('getCurrentMigrationIdFromDsoInfo returns undefined when node states are missing', () => {
    expect(getCurrentMigrationIdFromDsoInfo({ ...testDsoInfo, nodeStates: [] })).toBeUndefined();
  });

  test('getConfigFieldCurrentConfigurationValue uses cluster migration id when unset', () => {
    expect(
      getConfigFieldCurrentConfigurationValue('nextScheduledSynchronizerUpgradeMigrationId', '', 0)
    ).toBe('0');
    expect(
      getConfigFieldCurrentConfigurationValue('nextScheduledSynchronizerUpgradeMigrationId', '2', 0)
    ).toBe('2');
    expect(getConfigFieldCurrentConfigurationValue('voteCooldownTime', '', 0)).toBe('');
  });

  test('isValidMigrationIdFormat accepts whole numbers without leading zeros', () => {
    expect(isValidMigrationIdFormat('0')).toBe(true);
    expect(isValidMigrationIdFormat('42')).toBe(true);
    expect(isValidMigrationIdFormat('')).toBe(false);
    expect(isValidMigrationIdFormat('-1')).toBe(false);
    expect(isValidMigrationIdFormat('1.5')).toBe(false);
    expect(isValidMigrationIdFormat('abc')).toBe(false);
    expect(isValidMigrationIdFormat('01')).toBe(false);
    expect(isValidMigrationIdFormat(' 1')).toBe(false);
    expect(isValidMigrationIdFormat(String(Number.MAX_SAFE_INTEGER))).toBe(true);
    expect(isValidMigrationIdFormat(String(Number.MAX_SAFE_INTEGER + 1))).toBe(false);
  });

  test('validateMigrationIdAgainstCurrent requires current + 1', () => {
    expect(validateMigrationIdAgainstCurrent('1', 0)).toBe(false);
    expect(validateMigrationIdAgainstCurrent('6', 5)).toBe(false);
    expect(validateMigrationIdAgainstCurrent('0', 0)).toBe(
      'Migration ID must be 1 (current migration ID + 1)'
    );
    expect(validateMigrationIdAgainstCurrent('2', 0)).toBe(
      'Migration ID must be 1 (current migration ID + 1)'
    );
    expect(validateMigrationIdAgainstCurrent('4', 5)).toBe(
      'Migration ID must be 6 (current migration ID + 1)'
    );
    expect(validateMigrationIdAgainstCurrent('7', 5)).toBe(
      'Migration ID must be 6 (current migration ID + 1)'
    );
    expect(validateMigrationIdAgainstCurrent('abc', 0)).toBe(MIGRATION_ID_WHOLE_NUMBER_ERROR);
    expect(validateMigrationIdAgainstCurrent('01', 0)).toBe(MIGRATION_ID_WHOLE_NUMBER_ERROR);
    expect(validateMigrationIdAgainstCurrent('1', undefined)).toBe(
      'Unable to determine current migration ID'
    );
  });
});

describe('validateNextScheduledSynchronizerUpgrade', () => {
  const effectiveDate = '2030-01-01T12:00:00';
  const validUpgradeTime = '2030-01-01T14:00:00Z';
  const formatError = MIGRATION_ID_WHOLE_NUMBER_ERROR;

  test('accepts empty upgrade time and migration id', () => {
    expect(validateNextScheduledSynchronizerUpgrade('', '', effectiveDate, 0)).toBe(false);
  });

  test('requires both upgrade time and migration id when one is set', () => {
    expect(validateNextScheduledSynchronizerUpgrade('', '1', effectiveDate, 0)).toBe(
      SYNCHRONIZER_UPGRADE_MUTUAL_REQUIREMENT_MESSAGE
    );
  });

  test('requires migration id to be current + 1', () => {
    expect(validateNextScheduledSynchronizerUpgrade(validUpgradeTime, '0', effectiveDate, 0)).toBe(
      'Migration ID must be 1 (current migration ID + 1)'
    );
    expect(validateNextScheduledSynchronizerUpgrade(validUpgradeTime, '2', effectiveDate, 0)).toBe(
      'Migration ID must be 1 (current migration ID + 1)'
    );
    expect(validateNextScheduledSynchronizerUpgrade(validUpgradeTime, '1', effectiveDate, 0)).toBe(
      false
    );
  });

  test('rejects invalid migration id format', () => {
    expect(
      validateNextScheduledSynchronizerUpgrade(validUpgradeTime, 'abc', effectiveDate, 0)
    ).toBe(formatError);
    expect(
      validateNextScheduledSynchronizerUpgrade(validUpgradeTime, '1.5', effectiveDate, 0)
    ).toBe(formatError);
    expect(validateNextScheduledSynchronizerUpgrade(validUpgradeTime, '-1', effectiveDate, 0)).toBe(
      formatError
    );
    expect(validateNextScheduledSynchronizerUpgrade(validUpgradeTime, '01', effectiveDate, 0)).toBe(
      formatError
    );
  });

  test('rejects migration id when current migration id is unavailable', () => {
    expect(
      validateNextScheduledSynchronizerUpgrade(validUpgradeTime, '1', effectiveDate, undefined)
    ).toBe('Unable to determine current migration ID');
  });

  test('rejects invalid upgrade time format', () => {
    expect(validateNextScheduledSynchronizerUpgrade('not-a-time', '1', effectiveDate, 0)).toBe(
      `Upgrade Time must be in ${nextScheduledSynchronizerUpgradeFormat} format`
    );
  });

  test('treats whitespace-only fields as empty for mutual requirement', () => {
    expect(validateNextScheduledSynchronizerUpgrade('   ', '', effectiveDate, 0)).toBe(false);
    expect(validateNextScheduledSynchronizerUpgrade('', '   ', effectiveDate, 0)).toBe(false);
    expect(validateNextScheduledSynchronizerUpgrade('   ', '1', effectiveDate, 0)).toBe(
      SYNCHRONIZER_UPGRADE_MUTUAL_REQUIREMENT_MESSAGE
    );
  });

  test('skips validation when effective date is undefined (effective at threshold)', () => {
    expect(validateNextScheduledSynchronizerUpgrade('', 'abc', undefined, 0)).toBe(false);
    expect(
      validateNextScheduledSynchronizerUpgrade('2030-01-01T14:00:00Z', 'abc', undefined, 0)
    ).toBe(false);
    expect(getSynchronizerUpgradeFieldError('migrationId', '', 'abc', undefined, 0)).toBe(false);
    expect(
      getSynchronizerUpgradeFieldError('upgradeTime', '2030-01-01T14:00:00Z', '', undefined, 0)
    ).toBe(false);
  });
});

describe('synchronizer upgrade field validators', () => {
  const effectiveDate = '2030-01-01T12:00:00';

  test('migration id field validates format before mutual requirement', () => {
    expect(getSynchronizerUpgradeFieldError('migrationId', '', 'abc', effectiveDate, 0)).toBe(
      MIGRATION_ID_WHOLE_NUMBER_ERROR
    );
    expect(getSynchronizerUpgradeFieldError('migrationId', '', '1', effectiveDate, 0)).toBe(
      SYNCHRONIZER_UPGRADE_MUTUAL_REQUIREMENT_MESSAGE
    );
  });

  test('upgrade time field requires migration id when upgrade time is set', () => {
    expect(
      getSynchronizerUpgradeFieldError('upgradeTime', '2030-01-01T14:00:00Z', '', effectiveDate, 0)
    ).toBe(SYNCHRONIZER_UPGRADE_MUTUAL_REQUIREMENT_MESSAGE);
  });
});
