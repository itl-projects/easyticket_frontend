import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { TextField, IconButton, InputAdornment } from '@material-ui/core';
import { Icon } from '@iconify/react';
import clockIcon from '@iconify/icons-eva/calendar-outline';
import 'react-datepicker/dist/react-datepicker.css';

DateTimeChooser.propTypes = {
  label: PropTypes.string,
  value: PropTypes.objectOf(Date),
  onChange: PropTypes.func,
  helperText: PropTypes.string,
  error: PropTypes.bool
};

export default function DateTimeChooser({ label, value, onChange, helperText, error }) {
  return (
    <DatePicker
      selected={value}
      onChange={onChange}
      timeInputLabel=""
      dateFormat="MM/dd/yyyy h:mm aa"
      showTimeInput
      showTimeSelect
      customInput={
        <TextField
          label={label}
          fullWidth
          size="small"
          error={error}
          helperText={helperText}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end">
                  <Icon icon={clockIcon} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      }
    />
  );
}
