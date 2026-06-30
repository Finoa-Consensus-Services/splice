// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import { ContentCopy } from '@mui/icons-material';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import { theme } from '@canton-network/splice-common-frontend';

export type CopyableIdentifierSize = 'small' | 'large';

interface CopyableIdentifierProps {
  value: string;
  copyValue?: string;
  badge?: string;
  size: CopyableIdentifierSize;
  'data-testid': string;
}

const CopyableIdentifier: React.FC<CopyableIdentifierProps> = ({
  value,
  copyValue,
  badge,
  size,
  'data-testid': testId,
}) => (
  <Box
    sx={{ display: 'flex', alignItems: 'center', color: 'text.light', minWidth: 0 }}
    data-testid={testId}
  >
    <Typography
      variant={size === 'small' ? 'body2' : 'monoValue'}
      fontWeight="medium"
      sx={{
        fontFamily: theme.fonts.mono.fontFamily,
        fontSize: size === 'small' ? '0.875rem' : undefined,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
      data-testid={`${testId}-value`}
    >
      {value}
    </Typography>
    <IconButton
      color="secondary"
      data-testid={`${testId}-copy-button`}
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
        navigator.clipboard.writeText(copyValue ?? value);
      }}
    >
      <ContentCopy sx={{ fontSize: size === 'small' ? '14px' : '18px' }} />
    </IconButton>
    {badge !== undefined && <Chip label={badge} size="small" data-testid={`${testId}-badge`} />}
  </Box>
);

export default CopyableIdentifier;
