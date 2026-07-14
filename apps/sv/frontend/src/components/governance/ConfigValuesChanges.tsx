// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { Box, Typography } from '@mui/material';
import { ConfigChange } from '../../utils/types';
import { PartyId } from '@canton-network/splice-common-frontend';
import {
  CREATE_PROPOSAL_FIELD_BODY_SX,
  CREATE_PROPOSAL_REVIEW_CONFIG_VALUE_PILL_SX,
} from '../../constants/createProposalLayout';
import { getWeightDiff } from '../../utils/governance';
import { WeightChangeArrowIcon } from './WeightChangeArrowIcon';
import { WeightDiffIndicator } from './WeightDiffIndicator';

interface ConfigValuesChangesProps {
  changes: ConfigChange[];
  isSummaryView?: boolean;
}

const detailValuePillSx = {
  px: 1.5,
  py: 0.5,
  bgcolor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 1,
  minWidth: 80,
  textAlign: 'center',
} as const;

interface ConfigValuePillProps {
  value: string;
  testId: string;
  isId?: boolean;
  isSummaryView?: boolean;
}

const ConfigValuePill: React.FC<ConfigValuePillProps> = ({
  value,
  testId,
  isId,
  isSummaryView,
}) => (
  <Box
    sx={isSummaryView ? CREATE_PROPOSAL_REVIEW_CONFIG_VALUE_PILL_SX : detailValuePillSx}
    data-testid={`${testId}-container`}
  >
    {isId ? (
      <PartyId partyId={value} id={testId} />
    ) : isSummaryView ? (
      <Typography
        component="span"
        data-testid={testId}
        sx={{ ...CREATE_PROPOSAL_FIELD_BODY_SX, whiteSpace: 'nowrap' }}
      >
        {value}
      </Typography>
    ) : (
      <Typography variant="body2" fontFamily="monospace" data-testid={testId}>
        {value}
      </Typography>
    )}
  </Box>
);

export const ConfigValuesChanges: React.FC<ConfigValuesChangesProps> = props => {
  const { changes, isSummaryView } = props;
  const textColor = isSummaryView ? undefined : 'text.primary';

  return (
    <Box
      id="proposal-details-config-changes-section"
      data-testid="proposal-details-config-changes-section"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: isSummaryView ? '16px' : 2 }}>
        {changes.length === 0 && (
          <Box sx={{ py: 1 }}>
            <Typography
              variant="body2"
              color={isSummaryView ? undefined : textColor}
              sx={isSummaryView ? CREATE_PROPOSAL_FIELD_BODY_SX : undefined}
            >
              No changes found.
            </Typography>
          </Box>
        )}

        {changes.map((change, index) => {
          const weightDiff =
            isSummaryView && change.currentValue
              ? getWeightDiff(`${change.currentValue}`, `${change.newValue}`)
              : null;

          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: isSummaryView ? '14px' : 2,
              }}
              data-testid="config-change"
            >
              <Typography
                variant={isSummaryView ? undefined : 'body1'}
                sx={
                  isSummaryView
                    ? { ...CREATE_PROPOSAL_FIELD_BODY_SX, flexShrink: 0 }
                    : { minWidth: 200 }
                }
                data-testid="config-change-field-label"
                color={textColor}
              >
                {change.label}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: isSummaryView ? '8px' : 0 }}>
                {change.currentValue && (
                  <>
                    <ConfigValuePill
                      value={`${change.currentValue}`}
                      testId="config-change-current-value"
                      isId={change.isId}
                      isSummaryView={isSummaryView}
                    />

                    {isSummaryView ? (
                      <WeightChangeArrowIcon direction="right" color="#FFFFFF" size={16} />
                    ) : (
                      <Typography component="span" variant="body1" sx={{ mx: 1 }}>
                        →
                      </Typography>
                    )}
                  </>
                )}

                <ConfigValuePill
                  value={`${change.newValue}`}
                  testId="config-change-new-value"
                  isId={change.isId}
                  isSummaryView={isSummaryView}
                />

                {weightDiff !== null && weightDiff !== 0 && (
                  <WeightDiffIndicator
                    current={`${change.currentValue}`}
                    next={`${change.newValue}`}
                    data-testid="config-change-weight-diff"
                  />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
