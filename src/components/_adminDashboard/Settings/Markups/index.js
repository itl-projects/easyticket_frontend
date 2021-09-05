import * as Yup from 'yup';
import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import { LoadingButton } from '@material-ui/lab';
import { useFormik, Form, FormikProvider } from 'formik';
import MarkupDetailList from './MarkupDetailList';
import { successMessage, errorMessage, warningMessage } from '../../../../utils/helperFunctions';
import { settingsAPI } from '../../../../services/admin';
// ----------------------------------------------------------------------

export default function ContactDetailList({ ...other }) {
  const [reload, setReload] = useState(false);

  const userAddSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    price: Yup.number().typeError('Please enter only numbers').required('Price is required'),
    type: Yup.string().required('Markup type is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      price: 0,
      type: ''
    },
    validationSchema: userAddSchema,
    onSubmit: async () => {
      try {
        setSubmitting(true);
        const res = await settingsAPI.addMarkup(values);
        setSubmitting(false);
        if (res && res.status === 201) {
          if (res.data && res.data.success) {
            setReload(true);
            successMessage(res.data.message);
            resetForm();
          } else errorMessage(res.data.message);
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
          }
          warningMessage(res.data.message);
          return;
        }
        errorMessage('Something went wrong. Try later.');
      } catch (err) {
        console.log(err);
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
    setSubmitting,
    resetForm
  } = formik;

  return (
    <Grid container spacing={3} {...other}>
      <Grid item xs={12} lg={12}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Card sx={{ px: 2, py: 3 }}>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    {...getFieldProps('name')}
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    type="text"
                    label="Mark up Name"
                    placeholder="Enter Mark up Name"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    {...getFieldProps('price')}
                    fullWidth
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                    type="number"
                    label="Mark up Price"
                    placeholder="Enter Mark up Price"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Mark up Type"
                    select
                    // getOptionLabel={(option) => option.label}
                    {...getFieldProps('type')}
                    // value={values.type}
                    // onChange={(e, v) => setFIle}
                    fullWidth
                    error={Boolean(touched.type && errors.type)}
                    helperText={touched.type && errors.type}
                    size="small"
                  >
                    <MenuItem value="pax">Per PAX</MenuItem>
                    <MenuItem value="pnr">PNR</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} lg={12} justifyContent="center" display="flex">
                  <LoadingButton
                    size="medium"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Add Markup
                  </LoadingButton>
                </Grid>
              </Grid>
            </Card>
          </Form>
        </FormikProvider>
      </Grid>
      <Grid item xs={12} lg={12}>
        <MarkupDetailList reloadData={reload} reloadDone={(v) => setReload(v)} />
      </Grid>
    </Grid>
  );
}
