import { Response } from 'express';

// hàm gửi khi thành công
const sendJsonSuccess = (res: Response, message = "Success", code = 200) => {
    return (data: any = null) => {
        const resData = data ? {
            statusCode: code,
            message,
            data
        }: {
            statusCode: code,
            message
        }
        res.status(code).json(resData);
    }
}

// hàm gọi khi có lỗi
const sendJsonErrors = (res: Response, error: any) => {
    return res.status(error.status || 500).json({
        statusCode: error.status || 500,
        message: error.message || "Unhandled error",
        data: null
    })
}

export {
    sendJsonSuccess,
    sendJsonErrors
}