import * as Yup from 'yup';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { useFormik, Form, FormikProvider } from 'formik';
import { styled, alpha } from '@material-ui/core/styles';
// material
import { TextField, Grid, Typography, InputAdornment } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useAdminContext } from '../../context/AdminContext';
import { creditRequestAPI } from '../../services/agent';
import { successMessage, errorMessage, warningMessage } from '../../utils/helperFunctions';

const TextArea = styled(TextareaAutosize)(({ theme }) => ({
  padding: theme.spacing(2, 2),
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  borderRadius: theme.shape.borderRadius,
  fontSize: theme.typography.fontSize,
  fontFamily: theme.typography.fontFamily,
  borderColor: theme.palette.divider,
  boderWidth: 2,
  width: '100%'
}));

CreditRequestModal.propTypes = {
  title: PropTypes.string.isRequired
};

export default function CreditRequestModal({ title }) {
  const adminContext = useAdminContext();
  const { showCreditRequestModal, toggleShowCreditRequestModal } = adminContext;

  const creditRequestSchema = Yup.object().shape({
    amount: Yup.number().required('Amount is required'),
    remark: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      remark: ''
    },
    validationSchema: creditRequestSchema,
    onSubmit: async () => {
      try {
        setSubmitting(true);
        const res = await creditRequestAPI.sendCreditRequest(values);
        setSubmitting(false);
        if (res && res.status === 201) {
          successMessage(res.data.message);
          toggleShowCreditRequestModal(false);
          return;
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
        }
        errorMessage('Something went wrong. Try later.');
      } catch (err) {
        setSubmitting(false);
        errorMessage('Something went wrong. Try later.');
      }
    }
  });

  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    submitForm,
    setSubmitting,
    resetForm
  } = formik;

  useEffect(() => {
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCreditRequestModal]);

  return (
    <Dialog
      onClose={() => toggleShowCreditRequestModal(false)}
      open={showCreditRequestModal}
      maxWidth="sm"
      fullWidth
    >
      <MuiDialogTitle onClose={() => toggleShowCreditRequestModal(false)}>{title}</MuiDialogTitle>
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
                <Typography sx={{ mb: 1, pl: 1 }}>Amount</Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Amount"
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
                <Typography sx={{ mb: 1, pl: 1 }}>Remark</Typography>
                <TextArea
                  fullWidth
                  type="text"
                  placeholder="Remarks"
                  {...getFieldProps('remark')}
                  minRows={3}
                />
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </MuiDialogContent>
      <MuiDialogActions>
        <Button
          color="error"
          variant="outlined"
          onClick={() => toggleShowCreditRequestModal(false)}
        >
          Close
        </Button>
        <LoadingButton
          loading={isSubmitting}
          color="success"
          variant="outlined"
          onClick={submitForm}
        >
          Send Request
        </LoadingButton>
      </MuiDialogActions>
    </Dialog>
  );
}
