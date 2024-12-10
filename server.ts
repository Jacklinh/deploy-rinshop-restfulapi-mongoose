import app from "./src/app";
import { globalConfig } from "./src/constants/configs"
const PORT = globalConfig.PORT;
// import mongoose
import mongoose from "mongoose";
mongoose.connect(globalConfig.MONGODB_URL as string)
.then(() => {
    console.log('connected to mongodb');
    //should listen app here
    // Bạn có thể đưa đoạn code khởi tạo server của Express vào chổ `//should listen app here` để đảm bảo rằng. Phải kết nối server Mongoo thành công thì mới khởi tạo server NodeJs.
})
.catch((err) => {
    console.log('failded to connect to mongodb error');
})

app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}`)
})