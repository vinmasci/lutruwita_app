import React from 'react';
import { ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSidebar } from './SidebarContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  id: string;
}

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.active': {
    backgroundColor: theme.palette.action.selected,
  },
  '&.disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 40,
  color: theme.palette.text.primary,
}));

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  onClick,
  active = false,
  disabled = false,
  id,
}) => {
  const { expanded, setActiveItem } = useSidebar();

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!disabled && onClick) {
      setActiveItem(id);
      onClick();
    }
  };

  const item = (
    <StyledListItem
      onClick={handleClick}
      className={`${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      disabled={disabled}
    >
      <StyledListItemIcon>{icon}</StyledListItemIcon>
      {expanded && <ListItemText primary={label} />}
    </StyledListItem>
  );

  if (!expanded) {
    return (
      <Tooltip title={label} placement="right">
        {item}
      </Tooltip>
    );
  }

  return item;
};
