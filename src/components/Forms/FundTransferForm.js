import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { TextField, InputAdornment, Grid, MenuItem } from '@material-ui/core';
// import { Icon } from '@iconify/react';
// import flightIcon from '@iconify/icons-ic/baseline-flight';

// ----------------------------------------------------------------------

export default function FundTransferForm() {
  const userAddSchema = Yup.object().shape({
    agentNameOrRef: Yup.string().required('City is required'),
    action: Yup.string().required('City is required'),
    amount: Yup.string().required('City is required'),
    remark: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      agentNameOrRef: '',
      action: '',
      amount: '',
      remark: ''
    },
    validationSchema: userAddSchema,
    onSubmit: () => {}
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
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
            <TextField
              fullWidth
              type="text"
              label="Agent Name/Ref"
              {...getFieldProps('agentNameOrRef')}
              error={Boolean(touched.agentNameOrRef && errors.agentNameOrRef)}
              helperText={touched.agentNameOrRef && errors.agentNameOrRef}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
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
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="text"
              label="Amount"
              {...getFieldProps('amount')}
              error={Boolean(touched.amount && errors.amount)}
              helperText={touched.amount && errors.amount}
              InputProps={{
                endAdornment: <InputAdornment position="end">$</InputAdornment>
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
  );
}
