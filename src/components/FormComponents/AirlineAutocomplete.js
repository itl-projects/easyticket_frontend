import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/core/Autocomplete';
// import { InputAdornment, IconButton } from '@material-ui/core';
// import { Icon } from '@iconify/react';
// import flightTackoffIcon from '@iconify/icons-ic/baseline-flight-takeoff';
import { AIRLINES } from '../../utils/constants';

export default function AirlineAutocomplete({ label, value, onChange, error, helperText }) {
  const getValue = React.useEffect(
    () =>
      AIRLINES.filter((el) => el.id === value) ? AIRLINES.filter((el) => el.id === value)[0] : null,
    [value]
  );

  return (
    <Autocomplete
      fullWidth
      options={AIRLINES}
      getOptionLabel={(option) => option.label}
      //   getOptionSelected={(option, v) => option.id === v}
      value={getValue}
      onChange={(e, v) => {
        onChange(v ? v.id : null);
      }}
      // name="source"
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ fontSize: 15, '& > span': { mr: '10px', fontSize: 16 } }}
          {...props}
          key={option.value}
        >
          {option.label}
        </Box>
      )}
      // {...getFieldProps('source')}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          size="small"
          // InputProps={{
          //   startAdornment: (
          //     <InputAdornment position="start">
          //       <IconButton edge="start">
          //         <Icon icon={flightTackoffIcon} />
          //       </IconButton>
          //     </InputAdornment>
          //   ),
          //   ...params.inputProps
          // }}
        />
      )}
    />
  );
}

AirlineAutocomplete.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string
};
