import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/core/Autocomplete';
// eslint-disable-next-line import/extensions
import AIRPORTS from '../../data/airports';

export default function AirportAutocomplete({ label, value, onChange, error, helperText }) {
  const getValue = React.useMemo(() => {
    if (!Number.isNaN(value)) {
      if (AIRPORTS.filter((el) => el.ID === Number(value)).length)
        return AIRPORTS.filter((el) => el.ID === Number(value))[0];
      return null;
    }
    return null;
  }, [value]);

  return (
    <Autocomplete
      fullWidth
      options={AIRPORTS}
      getOptionLabel={(option) => `${option.label} - ${option.value}`}
      //   getOptionSelected={(option, v) => option.id === v}
      value={getValue}
      onChange={(e, v) => {
        onChange(v ? v.ID : '');
      }}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ fontSize: 15, '& > span': { mr: '10px', fontSize: 16 } }}
          {...props}
          key={option.value}
        >
          {option.label}&nbsp;-&nbsp;<span>({option.value})</span>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={helperText}
          size="small"
          placeholder={label}
        />
      )}
    />
  );
}

AirportAutocomplete.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string
};
