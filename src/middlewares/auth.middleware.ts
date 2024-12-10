import jwt, { JwtPayload }  from 'jsonwebtoken';
import Staff from '../models/staffs.model';
import Customer from '../models/customers.model';
import { Request, Response, NextFunction } from "express";
import createError from 'http-errors';
import { globalConfig } from '../constants/configs';
import { EnumRole } from '../types/models';

interface decodedJWT extends JwtPayload {
    _id?: string
}
// xác thực tài khoản 
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {

    //Get the jwt token from the head
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //If token is not valid, respond with 401 (unauthorized)
    if (!token) {
        return next(createError(401, 'Unauthorized'));
    }
    try {
        // giải mã token 
        const decoded = jwt.verify(token, globalConfig.JWT_SECRET_KEY as string) as decodedJWT;
        //try verify staff exits in database
        const staff = await Staff.findById(decoded._id);
        if (!staff) {
            return next(createError(401, 'Unauthorized'));
        }
        //Đăng ký biến staff global trong app
        res.locals.staff = staff;

        next();

    } catch (err) {
        return next(createError(403, 'Forbidden-authenticateToken'));
    }
};
// Hàm kiểm tra quyền
const checkAuthorization = (roles_allowed: EnumRole[], current_role: string): boolean => {
    // Chuyển đổi current_role thành enum
    const currentRoleLower = current_role.toLowerCase();
    const rolesAllowedLower = roles_allowed.map(role => role.toLowerCase());
    
    // Nếu là admin thì luôn cho phép
    if (currentRoleLower === 'admin') {
        return true;
    }

    // Nếu là user thì cho phép truy cập các quyền user và viewer
    if (currentRoleLower === 'user') {
        return rolesAllowedLower.includes('user') || rolesAllowedLower.includes('viewer');
    }

    // Các trường hợp khác
    return rolesAllowedLower.includes(currentRoleLower);
};
// kiểm tra quyền truy cập dựa vào role
export const authorizationAccess = (roles: EnumRole[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!res.locals.staff) {
                return next(createError(401, 'Unauthorized'));
            }

            const staffRole = res.locals.staff.role;
            if (roles.length && !checkAuthorization(roles, staffRole)) {
                return next(createError(403, 'Bạn không có quyền truy cập vào chức năng này'));
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

// xác thực tài khoản dành cho client
export const authenticateTokenClient = async (req: Request, res: Response, next: NextFunction) => {

    //Get the jwt token from the head
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //If token is not valid, respond with 401 (unauthorized)
    if (!token) {
        return next(createError(401, 'Unauthorized'));
    }
    try {
        // giải mã token 
        const decoded = jwt.verify(token, globalConfig.JWT_SECRET_KEY as string) as decodedJWT;
        //try verify customer exits in database
        const customer = await Customer.findById(decoded._id);
        if (!customer) {
            return next(createError(401, 'Unauthorized'));
        }
        //Đăng ký biến customer global trong app
        res.locals.customer = customer;

        next();

    } catch (err) {
        return next(createError(403, 'Forbidden-authenticateToken'));
    }
};
  
  