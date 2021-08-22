import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { TextField, Grid } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { bookingsAPI } from '../../services/admin';
import { successMessage, errorMessage, warningMessage } from '../../utils/helperFunctions';
// ----------------------------------------------------------------------

export default function UserForm({ bookingId, ticketId, closeModal }) {
  const userAddSchema = Yup.object().shape({
    PNR: Yup.string().required('PNR is required')
  });

  const formik = useFormik({
    initialValues: {
      PNR: ''
    },
    validationSchema: userAddSchema,
    onSubmit: async () => {
      try {
        setSubmitting(true);
        const data = {
          pnr: values.PNR,
          ticket: ticketId
        };
        const res = await bookingsAPI.updatePNR(bookingId, data);
        setSubmitting(false);
        if (res && res.status === 200) {
          successMessage(res.data.message);
          closeModal(true);
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
        console.log(err);
        errorMessage('Something went wrong. Try later.');
      }
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} md={3}>
            <TextField
              // label="PNR Number"
              placeholder="Enter PNR Number"
              {...getFieldProps('PNR')}
              fullWidth
              error={Boolean(touched.PNR && errors.PNR)}
              helperText={touched.PNR && errors.PNR}
            />
          </Grid>
          <Grid item xs={4} md={2} sx={{ mt: 0.5 }}>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Update
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

UserForm.propTypes = {
  bookingId: PropTypes.string,
  ticketId: PropTypes.string,
  closeModal: PropTypes.func
};
