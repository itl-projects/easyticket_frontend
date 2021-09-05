import * as React from 'react';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

DropdownActionButton.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.object,
  color: PropTypes.string,
  options: PropTypes.array,
  item: PropTypes.object
};

export default function DropdownActionButton({ title, icon, options, color, item }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Tooltip title={title}>
        <IconButton onClick={handleClick} size="small" sx={{ mz: 1 }} color={color}>
          <Icon icon={icon} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {options &&
          options
            .filter((el) => el.title)
            .map((menuItem, i) => (
              <MenuItem key={`menu-item-${title}-${i}`} onClick={() => menuItem.onClick(item)}>
                {menuItem.title}
              </MenuItem>
            ))}
      </Menu>
    </>
  );
}
