import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/core/Autocomplete';
// eslint-disable-next-line import/extensions
import AIRPORTS from '../../data/airports';

export default function AirportAutocomplete({ label, value, onChange, error, helperText }) {
  const getValue = React.useEffect(
    () =>
      AIRPORTS.filter((el) => el.ID === value) ? AIRPORTS.filter((el) => el.ID === value)[0] : null,
    [value]
  );

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
      // name="source"
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
      // {...getFieldProps('source')}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          size="small"
          // InputProps={{
          //   ...params.inputProps,
          //   endAdornment: (
          //     <InputAdornment position="end">
          //       <IconButton edge="end">
          //         <Icon icon={flightTackoffIcon} />
          //       </IconButton>
          //     </InputAdornment>
          //   )
          // }}
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
