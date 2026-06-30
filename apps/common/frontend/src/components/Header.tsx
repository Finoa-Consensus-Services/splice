// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { NavLink } from 'react-router';

import { Warning } from '@mui/icons-material';
import { Badge, Box, Stack, Toolbar, useTheme } from '@mui/material';
import Typography, { TypographyOwnProps } from '@mui/material/Typography';
import type { Theme } from '@mui/material/styles';

interface HeaderProps extends React.PropsWithChildren {
  title: string;
  titleVariant?: TypographyOwnProps['variant'];
  navLinks?: { name: string; path: string; badgeCount?: number; hasAlert?: boolean }[];
  noBorder?: boolean;
  /** Figma top nav from CF-design-system (initiate-proposal-1.html). */
  variant?: 'default' | 'governance';
}

const navPillStyle = (theme: Theme, isActive: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '10px',
  borderRadius: '20px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  color: theme.palette.colors.fieldLabel,
  outline: isActive ? `2px solid ${theme.palette.colors.tertiary}` : 'none',
});

const Header: React.FC<HeaderProps> = ({
  children,
  title,
  titleVariant,
  navLinks,
  noBorder,
  variant = 'default',
}) => {
  const theme = useTheme();
  const isGovernance = variant === 'governance';

  const applyNavStyle = (isActive: boolean): React.CSSProperties =>
    isGovernance
      ? navPillStyle(theme, isActive)
      : {
          color: 'white',
          textDecoration: isActive ? 'underline' : 'none',
          whiteSpace: 'nowrap',
        };

  return (
    <Toolbar
      disableGutters
      sx={{
        borderBottom: isGovernance || noBorder ? 0 : 1,
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: { xs: 2, md: isGovernance ? 4 : 2 },
        px: isGovernance ? { xs: 2, md: 6 } : 0,
        py: isGovernance ? 1 : 0,
        minHeight: isGovernance ? 'auto' : undefined,
      }}
    >
      <Typography
        id="app-title"
        variant={isGovernance ? 'brandWordmark' : titleVariant || 'h5'}
        textTransform={isGovernance ? 'none' : 'uppercase'}
        fontFamily={isGovernance ? undefined : theme => theme.fonts.brand.fontFamily}
        fontWeight={isGovernance ? undefined : theme => theme.fonts.brand.fontWeight}
        sx={{ flexShrink: 0, textWrap: 'balance' }}
      >
        {title}
      </Typography>

      {navLinks && (
        <Stack
          direction="row"
          spacing={isGovernance ? 7 : 3}
          alignItems="center"
          justifyContent={isGovernance ? 'flex-start' : 'space-evenly'}
          sx={{ flex: 1, flexWrap: 'wrap' }}
        >
          {navLinks.map((navLink, index) => (
            <Box key={`nav-link-${index}`}>
              <NavLink
                id={`navlink-${navLink.path}`}
                data-testid={`navlink-${navLink.path}`}
                to={navLink.path}
                style={({ isActive }) => applyNavStyle(isActive)}
              >
                <Typography
                  component="span"
                  variant={isGovernance ? 'navItem' : undefined}
                  sx={{
                    color: 'inherit',
                    textDecoration: 'inherit',
                    ...(isGovernance ? {} : { fontWeight: 700 }),
                  }}
                >
                  {navLink.name}
                </Typography>

                {navLink.badgeCount ? (
                  <Badge
                    id={`nav-badge-${navLink.path}-count`}
                    color="error"
                    badgeContent={navLink.badgeCount}
                    sx={{
                      ml: isGovernance ? 0 : 2,
                      '& .MuiBadge-badge': {
                        position: 'static',
                        transform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 400,
                        minWidth: 20,
                        height: 20,
                        borderRadius: '12px',
                      },
                    }}
                  />
                ) : navLink.hasAlert ? (
                  <Badge
                    id={`nav-badge-${navLink.path}-alert`}
                    badgeContent={
                      <Warning fontSize="small" color="secondary" sx={{ ml: isGovernance ? 0 : 3 }} />
                    }
                    sx={{
                      ml: isGovernance ? 0 : 2,
                      '& .MuiBadge-badge': { position: 'static', transform: 'none', p: 0, bg: 'transparent' },
                    }}
                  />
                ) : null}
              </NavLink>
            </Box>
          ))}
        </Stack>
      )}
      {children}
    </Toolbar>
  );
};

export default Header;
