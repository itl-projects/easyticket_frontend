import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
// material
import { Autocomplete, TextField, InputAdornment, Grid, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useAdminContext } from '../../context/AdminContext';
import { usersAPI, creditRequestAPI } from '../../services/admin';
import { successMessage, errorMessage, warningMessage } from '../../utils/helperFunctions';

export default function TicketModalModal() {
  const adminContext = useAdminContext();
  const { showFundTransferModal, toggleShowFundTransferModal } = adminContext;
  const userAddSchema = Yup.object().shape({
    agent: Yup.string().required('Please select agent first'),
    // action: Yup.string().required('City is required'),
    amount: Yup.number().required('Amount is required'),
    remark: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      agent: '',
      // action: '',
      amount: '',
      remark: ''
    },
    validationSchema: userAddSchema,
    onSubmit: async () => {
      setSubmitting(true);
      const res = await creditRequestAPI.sendFundToUser(values);
      setSubmitting(false);
      if (res && res.status === 201) {
        if (res.data && res.data.success) {
          successMessage(res.data.message);
          toggleShowFundTransferModal();
          return;
        }
      }
      if (res && res.data) {
        if (res.data && res.status === 400) {
          if (typeof res.data.message === 'object' && res.data.message.length > 0) {
            res.data.message.forEach((el) => {
              warningMessage(el);
            });
            return;
          }
          warningMessage(res.data.message);
          return;
        }
        errorMessage(res.data.message);
        return;
      }
      errorMessage('Something went wrong. Try later.');
    }
  });

  const {
    errors,
    touched,
    values,
    isSubmitting,
    setSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    submitForm,
    resetForm
  } = formik;
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    setLoading(true);
    const res = await usersAPI.findUserByUsername(inputValue);
    setLoading(false);
    if (res && res.status === 200) {
      if (res.data && res.data.success) {
        setOptions(res.data.users);
      }
    }
  };

  useEffect(() => {
    // console.log(inputValue);
    if (inputValue.length > 2) getUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    () => () => {
      resetForm();
      setOptions([]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showFundTransferModal]
  );

  return (
    <div>
      <Dialog
        onClose={toggleShowFundTransferModal}
        aria-labelledby="customized-dialog-title"
        open={showFundTransferModal}
        maxWidth="sm"
        fullWidth
      >
        <MuiDialogTitle id="customized-dialog-title" onClose={toggleShowFundTransferModal}>
          Fund Transfer
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                mb={3}
                mt={0}
                px={12}
              >
                <Grid item xs={12}>
                  <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    fullWidth
                    // disableClearable
                    options={options}
                    loading={loading}
                    // value={inputValue}
                    noOptionsText="No Agent found"
                    getOptionLabel={(option) => {
                      if (option.username.match(new RegExp(inputValue, 'i')))
                        return option.username;
                      return `${option.firstName}  ${option.lastName}`;
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onInputChange={(event, newInputValue) => {
                      setInputValue(newInputValue);
                    }}
                    onChange={(e, v) => {
                      setFieldValue('agent', v ? v.id : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        type="text"
                        label="Agent Name/Ref"
                        // {...getFieldProps('agent')}
                        error={Boolean(touched.agent && errors.agent)}
                        helperText={touched.agent && errors.agent}
                        // InputProps={{
                        //   ...params.InputProps,
                        //   type: 'search'
                        // }}
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item xs={12}>
            <TextField
              select
              fullWidth
              type="text"
              label="Action"
              {...getFieldProps('action')}
              error={Boolean(touched.action && errors.action)}
              helperText={touched.action && errors.action}
            >
              <MenuItem value="allocation">Allocation</MenuItem>
              <MenuItem value="return">Return</MenuItem>
            </TextField>
          </Grid> */}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Amount"
                    {...getFieldProps('amount')}
                    error={Boolean(touched.amount && errors.amount)}
                    helperText={touched.amount && errors.amount}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="h5">₹</Typography>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Remark"
                    {...getFieldProps('remark')}
                    error={Boolean(touched.remark && errors.remark)}
                    helperText={touched.remark && errors.remark}
                  />
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button color="error" variant="outlined" onClick={toggleShowFundTransferModal}>
            cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            onClick={submitForm}
            color="primary"
            variant="outlined"
          >
            Transfer Fund
          </LoadingButton>
        </MuiDialogActions>
      </Dialog>
    </div>
  );
}
