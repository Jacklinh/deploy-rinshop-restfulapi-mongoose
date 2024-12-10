import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { globalConfig } from '../constants/configs';
import Staff from '../models/staffs.model';
import Customer from '../models/customers.model';
import { ObjectId } from 'mongoose';
// dùng cho dashboard
const login = async(email: string, password: string)=>{
	//b1. Check xem tồn tại staff có email này không
	const staff = await Staff.findOne({
		email: email
	})

	if(!staff){
		throw createError(400, "Invalid email or password")
	}
	//b2. Nếu tồn tại thì đi so sánh mật khẩu xem khớp không
	const passwordHash = staff.password;
	const isValid = password === passwordHash; // true
	if(!isValid){
		//Đừng thông báo: Sai mật mật khẩu. Hãy thông báo chung chung
		throw createError(400, "Invalid email or password")
	}
	//3. Tạo token
	const access_token = jwt.sign(
		{
			_id: staff?._id,
			email: staff.email
		},
		globalConfig.JWT_SECRET_KEY as string,
		{
			expiresIn: '1d', //Xác định thời gian hết hạn của token
			//algorithm: 'RS256' //thuật toán mã hóa
		}
	);

	//reFresh Token hết hạn lâu hơn
	const refresh_token = jwt.sign(
		{
		_id: staff?._id,
		email: staff.email,
		//role: staff.role,  //phân quyền
		},
		globalConfig.JWT_SECRET_KEY as string,
		{
		expiresIn: '1d', //Xác định thời gian hết hạn của token
		//algorithm: 'RS256' //thuật toán mã hóa
		}
	);
	//4. Trả về token về cho client
	return {
	access_token,
	refresh_token,
	}
}

const getProfile = async(id: string)=>{
	// SELECT * FROM staff WHERE id = id
	const staff = await Staff.
	findOne({
	  _id: id
	}).
	select('-password -__v');
	if(!staff){
	  throw createError(400, 'Staff Not Found')
	}
	return staff
}
/**
 * hàm để sinh ra 1 cặp tokken
 */
const getTokens = async (staff: {_id: ObjectId, email: string})=>{
  const access_token = jwt.sign(
	{
	  _id: staff._id,
	  email: staff.email
	},
	globalConfig.JWT_SECRET_KEY as string,
	{
	  expiresIn: '1d', //Xác định thời gian hết hạn của token
	  //algorithm: 'RS256' //thuật toán mã hóa
	}
);

//Fresh Token hết hạn lâu hơn
const refresh_token = jwt.sign(
  {
	_id: staff?._id,
	email: staff.email,
	//role: staff.role,  //phân quyền
  },
  globalConfig.JWT_SECRET_KEY as string,
  {
	expiresIn: '1d', //Xác định thời gian hết hạn của token
	//algorithm: 'RS256' //thuật toán mã hóa
  }
)
return {access_token, refresh_token}
}

// dùng cho client 
const loginClient = async(email: string, password: string)=>{
	//b1. Check xem tồn tại custormer có email này không
	const customer = await Customer.findOne({
		email: email
	})

	if(!customer){
		throw createError(400, "Invalid email or password")
	}
	//b2. Nếu tồn tại thì đi so sánh mật khẩu xem khớp không
	const passwordHash = customer.password;
	const isValid = password === passwordHash; // true
	if(!isValid){
		//Đừng thông báo: Sai mật mật khẩu. Hãy thông báo chung chung
		throw createError(400, "Invalid email or password")
	}
	//3. Tạo token
	const access_token = jwt.sign(
		{
			_id: customer?._id,
			email: customer.email
		},
		globalConfig.JWT_SECRET_KEY as string,
		{
			expiresIn: '1d', //Xác định thời gian hết hạn của token
			//algorithm: 'RS256' //thuật toán mã hóa
		}
	);

	//reFresh Token hết hạn lâu hơn
	const refresh_token = jwt.sign(
		{
		_id: customer?._id,
		email: customer.email,
		//role: staff.role,  //phân quyền
		},
		globalConfig.JWT_SECRET_KEY as string,
		{
		expiresIn: '1d', //Xác định thời gian hết hạn của token
		//algorithm: 'RS256' //thuật toán mã hóa
		}
	);
	//4. Trả về token về cho client
	return {
	access_token,
	refresh_token,
	}
}

const getProfileClient = async(id: string)=>{
	const customer = await Customer.
	findOne({
	  _id: id
	}).
	select('-password -__v');
	if(!customer){
	  throw createError(400, 'customer Not Found')
	}
	return customer
}
const getTokensClient = async (customer: {_id: ObjectId, email: string})=>{
	const access_token = jwt.sign(
	  {
		_id: customer._id,
		email: customer.email
	  },
	  globalConfig.JWT_SECRET_KEY as string,
	  {
		expiresIn: '1d', //Xác định thời gian hết hạn của token
		//algorithm: 'RS256' //thuật toán mã hóa
	  }
  );
  
  //Fresh Token hết hạn lâu hơn
  const refresh_token = jwt.sign(
	{
	  _id: customer?._id,
	  email: customer.email,
	  //role: staff.role,  //phân quyền
	},
	globalConfig.JWT_SECRET_KEY as string,
	{
	  expiresIn: '1d', //Xác định thời gian hết hạn của token
	  //algorithm: 'RS256' //thuật toán mã hóa
	}
  )
  return {access_token, refresh_token}
}
export default {
	getProfile,
	login,
	getTokens,
	getProfileClient,
	loginClient,
	getTokensClient
  }