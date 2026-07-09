// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { useSearchParams } from 'react-router';
import { Loading } from '@canton-network/splice-common-frontend';
import { CreateUnallocatedUnclaimedActivityRecordForm } from '../components/forms/CreateUnallocatedUnclaimedActivityRecordForm';
import { GrantRevokeFeaturedAppForm } from '../components/forms/GrantRevokeFeaturedAppForm';
import { OffboardSvForm } from '../components/forms/OffboardSvForm';
import { SelectAction } from '../components/forms/SelectAction';
import { SetAmuletConfigRulesForm } from '../components/forms/SetAmuletConfigRulesForm';
import { SetDsoConfigRulesForm } from '../components/forms/SetDsoConfigRulesForm';
import { UpdateSvRewardWeightForm } from '../components/forms/UpdateSvRewardWeightForm';
import { useDsoInfos } from '../contexts/SvContext';
import { createProposalActions } from '../utils/governance';
import type { SupportedActionTag } from '../utils/types';
import { Box } from '@mui/material';

const ProposalForm: React.FC<{ action: SupportedActionTag }> = ({ action }) => {
  const dsoInfosQuery = useDsoInfos();
  if (dsoInfosQuery.isPending) {
    return <Loading />;
  }
  switch (action) {
    case 'SRARC_UpdateSvRewardWeight':
      return <UpdateSvRewardWeightForm />;
    case 'SRARC_OffboardSv':
      return <OffboardSvForm />;
    case 'SRARC_GrantFeaturedAppRight':
      return <GrantRevokeFeaturedAppForm selectedAction={'SRARC_GrantFeaturedAppRight'} />;
    case 'SRARC_RevokeFeaturedAppRight':
      return <GrantRevokeFeaturedAppForm selectedAction={'SRARC_RevokeFeaturedAppRight'} />;
    case 'SRARC_CreateUnallocatedUnclaimedActivityRecord':
      return <CreateUnallocatedUnclaimedActivityRecordForm />;
    case 'SRARC_SetConfig':
      return <SetDsoConfigRulesForm />;
    case 'CRARC_SetConfig':
      return <SetAmuletConfigRulesForm />;
  }
};

/**
 * Figma's outer canvas is 1880px (matches `Layout.tsx`'s `Container
 * maxWidth="xl"`), but the actual page content column below the nav is a
 * narrower 1583px, centered within it (confirmed via Dev Mode: card padding
 * `60px 374px` around an 835px-wide field/button group = 374+835+374 = 1583).
 * `Layout.tsx` only constrains to the 1880px outer frame, so without this,
 * `SelectAction`'s full-width card background bleeds out to ~1768px instead
 * of Figma's 1583px column. Scoped to this route rather than `Layout.tsx`
 * since other pages haven't been reviewed against this constraint yet.
 */
const CREATE_PROPOSAL_MAX_WIDTH = 1583;

export const CreateProposal: React.FC = () => {
  const [searchParams, _] = useSearchParams();
  const action = searchParams.get('action');
  const selectedAction = createProposalActions.find(a => a.value === action);

  return (
    <Box sx={{ maxWidth: CREATE_PROPOSAL_MAX_WIDTH, mx: 'auto', p: 4 }}>
      {selectedAction ? (
        <ProposalForm action={selectedAction.value as SupportedActionTag} />
      ) : (
        <SelectAction />
      )}
    </Box>
  );
};
