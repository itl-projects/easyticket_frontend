import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { TextField, Grid } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// ----------------------------------------------------------------------

export default function UserForm() {
  const userAddSchema = Yup.object().shape({
    PNR: Yup.string().required('PNR is required')
  });

  const formik = useFormik({
    initialValues: {
      PNR: ''
    },
    validationSchema: userAddSchema,
    onSubmit: () => {}
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} md={3}>
            <TextField
              label="PNR Number"
              placeholder="Enter PNR Number"
              {...getFieldProps('PNR')}
              fullWidth
              error={Boolean(touched.PNR && errors.PNR)}
              helperText={touched.PNR && errors.PNR}
            />
          </Grid>
          <Grid item xs={6} md={3}>
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
