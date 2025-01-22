import React from 'react';
import { Drawer, List, IconButton, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSidebar } from './SidebarContext';

const SIDEBAR_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

interface SidebarProps {
  children: React.ReactNode;
  anchor?: 'left' | 'right';
  toggleIcon?: React.ReactNode;
}

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded: boolean }>(({ theme, expanded }) => ({
  width: expanded ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  '& .MuiDrawer-paper': {
    width: expanded ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  anchor = 'left',
  toggleIcon,
}) => {
  const { expanded, toggleExpanded } = useSidebar();

  return (
    <StyledDrawer
      variant="permanent"
      anchor={anchor}
      expanded={expanded}
      PaperProps={{
        elevation: 0,
      }}
    >
      <List component="nav" sx={{ height: '100%', pt: 1, pb: 7 }}>
        {children}
      </List>
      {toggleIcon && (
        <Box sx={{ position: 'relative', height: 0 }}>
          <ToggleButton onClick={toggleExpanded} size="small">
            {toggleIcon}
          </ToggleButton>
        </Box>
      )}
    </StyledDrawer>
  );
};

export type { SidebarProps };
