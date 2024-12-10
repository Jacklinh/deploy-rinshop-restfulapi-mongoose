import * as yup from 'yup';


const createSchema = yup
  .object({
    body: yup.object({
      fullName: yup.string().trim().min(5).required('Họ và tên không được để trống!'),
      phone: yup.string().trim().max(10).matches(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số').required(),
      email: yup.string().email().required('Email không được để trống!'),
      address: yup.string().nullable()
    }),
  })
  .required();


export default {
    createSchema
}