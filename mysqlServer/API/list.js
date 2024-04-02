let db = require('../db/index')

exports.all = (req, res) => {    
   //获取info表全部数据
    var sql = 'select * from user'
    db.query(sql, (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}
exports.get = (req, res) => {        //通过id查询数据
    var sql = 'select * from user where id = ?'    //？用于占位
    db.query(sql, [req.query.id], (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}

exports.del = (req, res) => {
    var sql = 'DELETE FROM user WHERE id = ?';
    // 假设你使用的是路由参数
    db.query(sql, [req.params.id], (err, data) => {
        if(err) {
            console.error('Error:', err.message); // 仅在服务器日志中记录详细错误
            return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
        if(data.affectedRows > 0) {
            res.status(200).json({
              status: 'success',
              message: '删除成功'
            });
        } else {
            // 如果没有删除任何记录，可能是因为找不到ID对应的用户
            res.status(404).json({
              status: 'error',
              message: '未找到用户，删除失败'
            });
        }
    });
};


exports.add = (req, res) => {// 打印请求体内容以调试
    var sql = 'INSERT INTO user (name, address, tel) VALUES (?, ?, ?)';
    
    db.query(sql, [req.body.name, req.body.address, req.body.tel], (err, data) => {
        if (err) {
            console.error(err); // 记录错误到你的错误日志
            return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
        
        if (data.affectedRows > 0) {
            res.json({
                status: 200,
                message: 'User added successfully'
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Failed to add user'
            });
        }
    });
};



exports.update = (req, res) => {
    var sql = 'UPDATE user SET name = ?, address = ?, tel = ? WHERE id = ?';
    // 使用 req.body 替代 req.query 来获取请求体中的数据
    console.log(req.body);
    const { name, address, tel ,id} = req.body;
    db.query(sql, [name, address, tel, id], (err, data) => {
        if (err) {
            console.error(err); // 在生产环境中，避免直接向客户端发送错误细节
            return res.status(500).send({ status: 'error', message: 'Internal Server Error' });
        }
        if (data.changedRows > 0) {
            res.send({
                status: 200,
                message: 'User updated successfully'
            });
        } else {
            res.status(404).send({ // 如果没有行被改变，可能是因为找不到指定的用户
                status: 'error',
                message: 'User not found'
            });
        }
    });
};
