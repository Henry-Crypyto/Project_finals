let express = require('express');
let router = express.Router();
let user = require('./API/list');

// 获取所有用户
router.get('/list/all', user.all);

// 通过ID获取单个用户
// 注意：这里使用了 ':id' 作为路由参数
router.get('/list/get/:id', user.get);

// 添加一个新用户
router.post('/list/add', user.add);

// 更新用户信息
// 使用 PUT 请求，并且通过 ':id' 接收用户ID作为路由参数
router.put('/list/update/:id', user.update);

// 删除用户
// 使用 DELETE 请求，并且通过 ':id' 接收用户ID作为路由参数
router.delete('/list/del/:id', user.del);

module.exports = router;
