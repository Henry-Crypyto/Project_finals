let express = require('express');
let app = express();
let router = require('./router');
let cors = require('cors');


app.use(express.json()); // 用于解析 JSON 格式的请求体
app.use(express.urlencoded({extended: true}));
app.use(cors()); // 配置跨域
app.use(router); // 配置路由
app.listen(80, () => {
    console.log('服务器启动成功');
});


