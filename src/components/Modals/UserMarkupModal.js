import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Grid, TextField, Autocomplete, Box } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useAdminContext } from '../../context/AdminContext';
import { settingsAPI, usersAPI } from '../../services/admin';
import { successMessage, errorMessage } from '../../utils/helperFunctions';

export default function UserMarkupModal() {
  const adminContext = useAdminContext();
  const { showUserMarkupModal, toggleShowUserMarkupModal } = adminContext;
  const [markup, setMarkup] = useState(null);
  const [markups, setMarkups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const getMarkups = async () => {
    setLoading(true);
    const res = await settingsAPI.getAllMarkups();
    if (res && res.status === 200) {
      if (res.data && res.data.success) {
        setMarkups(
          res.data.data.map((el) => ({
            label: el.name,
            value: el.id
          }))
        );
      }
    }
    setLoading(false);
  };

  const addMarkupToUser = async () => {
    if (!markup) {
      setError('Please choose markup to apply.');
      return;
    }

    setSubmitting(true);
    const data = {
      agentId: showUserMarkupModal.id,
      markupId: markup.value
    };
    const res = await usersAPI.addMarkupToUser(data);
    setSubmitting(false);
    if (res && res.status === 201) {
      if (res.data && res.data.success) {
        successMessage(res.data.message);
        toggleShowUserMarkupModal(null);
        return;
      }
      errorMessage(res.data.message);
      return;
    }
    errorMessage('Sorry! something went wrong.');
    setSubmitting(false);
  };

  useEffect(() => {
    if (showUserMarkupModal !== null) {
      getMarkups();
      if (showUserMarkupModal.markup)
        setMarkup({
          label: showUserMarkupModal.markup.name,
          value: showUserMarkupModal.markup.id
        });
    } else {
      setMarkup(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUserMarkupModal]);

  return (
    <Dialog
      onClose={() => toggleShowUserMarkupModal(null)}
      open={showUserMarkupModal !== null}
      maxWidth="sm"
      fullWidth
    >
      <MuiDialogTitle onClose={() => toggleShowUserMarkupModal(null)}>
        {showUserMarkupModal?.markup ? 'Update' : 'Add'} Markup
      </MuiDialogTitle>
      <MuiDialogContent dividers>
        <Grid container sx={{ py: 4, px: 4 }}>
          <Grid item xs={6} md={8} lg={8}>
            <Autocomplete
              fullWidth
              options={markups}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(o, v) => o.value === v.value}
              value={markup}
              loading={loading}
              onChange={(e, v) => {
                setMarkup(v);
                if (v) setError('');
                else setError('Please choose markup to apply.');
              }}
              renderOption={(props, option) => (
                <Box component="li" sx={{ fontSize: 15 }} {...props} key={option.value}>
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!error}
                  helperText={error}
                  size="small"
                  label="Select Mark up"
                />
              )}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={4} sx={{ px: 4 }}>
            <LoadingButton
              variant="contained"
              onClick={addMarkupToUser}
              fullWidth
              loading={submitting}
            >
              Apply
            </LoadingButton>
          </Grid>
        </Grid>
      </MuiDialogContent>
      <MuiDialogActions>
        <Button color="error" variant="outlined" onClick={() => toggleShowUserMarkupModal(null)}>
          Close
        </Button>
      </MuiDialogActions>
    </Dialog>
  );
}
