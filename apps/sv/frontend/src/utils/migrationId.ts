// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import type { DsoInfo } from '@canton-network/splice-common-frontend';

const collectMigrationIds = (dsoInfo: DsoInfo): number[] => {
  const localNodeState =
    dsoInfo.nodeStates.find(nodeState => nodeState.payload.sv === dsoInfo.svPartyId) ??
    dsoInfo.nodeStates[0];

  if (!localNodeState) {
    return [];
  }

  return localNodeState.payload.state.synchronizerNodes
    .entriesArray()
    .flatMap(([, config]) => {
      const ids: number[] = [];
      if (config.sequencer) {
        ids.push(Number(config.sequencer.migrationId));
      }
      if (config.legacySequencerConfig) {
        ids.push(Number(config.legacySequencerConfig.migrationId));
      }
      return ids;
    })
    .filter(id => Number.isInteger(id) && id >= 0);
};

export const getCurrentMigrationIdFromDsoInfo = (dsoInfo: DsoInfo): number | undefined => {
  const migrationIds = collectMigrationIds(dsoInfo);
  if (migrationIds.length === 0) {
    return undefined;
  }

  return Math.max(...migrationIds);
};

export const getConfigFieldCurrentConfigurationValue = (
  fieldName: string,
  configCurrentValue: string,
  currentMigrationId: number | undefined
): string => {
  if (fieldName === 'nextScheduledSynchronizerUpgradeMigrationId' && configCurrentValue === '') {
    return currentMigrationId !== undefined ? String(currentMigrationId) : '';
  }

  return configCurrentValue;
};

export const MIGRATION_ID_WHOLE_NUMBER_ERROR = 'Migration ID must be a whole number';

export const isValidMigrationIdFormat = (value: string): boolean =>
  /^(0|[1-9]\d*)$/.test(value) && Number.isSafeInteger(Number(value));

export const validateMigrationIdAgainstCurrent = (
  migrationId: string,
  currentMigrationId: number | undefined
): string | false => {
  if (!isValidMigrationIdFormat(migrationId)) {
    return MIGRATION_ID_WHOLE_NUMBER_ERROR;
  }

  if (currentMigrationId === undefined) {
    return 'Unable to determine current migration ID';
  }

  const expected = String(currentMigrationId + 1);
  if (migrationId !== expected) {
    return `Migration ID must be ${expected} (current migration ID + 1)`;
  }

  return false;
};
