import * as yup from 'yup';


const loginSchema = yup
  .object({
    body: yup.object({
      email: yup.string().email().required(),
      password: yup.string().min(8).required(),
    }),
  })
  .required();


export default {
    loginSchema
}