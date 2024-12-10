import {Request, Response, NextFunction} from 'express'
import authService from '../services/auth.service'
import { sendJsonSuccess } from '../helpers/responseHandler';

const login = async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const {email, password} = req.body;
    const tokens = await authService.login(email, password);
    sendJsonSuccess(res)(tokens);

  } catch (error) {
    next(error)
  }
}
const profile = async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const {_id} = res.locals.staff;

    const result = await authService.getProfile(_id)
    sendJsonSuccess(res)(result);

  } catch (error) {
    next(error)
  }
}
const refreshToken = async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const staff = res.locals.staff;
    const tokens = await authService.getTokens(staff)

    //tạo cặp token mới
    sendJsonSuccess(res)(tokens);

  } catch (error) {
    next(error)
  }
}
// dùng cho client
const loginClient = async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const {email, password} = req.body;
    const tokens = await authService.loginClient(email, password);
    sendJsonSuccess(res)(tokens);

  } catch (error) {
    next(error)
  }
}


const profileClient = async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const {_id} = res.locals.customer;

    const result = await authService.getProfileClient(_id)
    sendJsonSuccess(res)(result);

  } catch (error) {
    next(error)
  }
}

const refreshTokenClient = async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const customer = res.locals.customer;

    const tokens = await authService.getTokensClient(customer)

    //tạo cặp token mới
    sendJsonSuccess(res)(tokens);

  } catch (error) {
    next(error)
  }
}
export default {
  login,
  profile,
  refreshToken,
  loginClient,
  profileClient,
  refreshTokenClient
}