let db = require('../db/index')

exports.all = (req, res) => {        //获取info表全部数据
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

exports.del = (req, res) => {        //通过id删除数据
    var sql = 'delete from user where id = ?'
    db.query(sql, [req.query.id], (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        if(data.affectedRows > 0) {
            res.send({
              status: 200,
              message: '删除成功'
            })
        }else{
            res.send({
              status: 202,
              message: '删除失败'
            })
        }
    })
}

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



exports.update = (req, res) => {        //通过id更新数据
    var sql = 'update user set name = ?, address = ?, tel = ? where id = ?'
    db.query(sql, [req.query.name, req.query.address, req.query.tel, req.query.id], (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        if(data.changedRows > 0) {
          res.send({
            status: 200,
            message: 'success'
          })
        }else{
          res.send({
            status: 202,
            message: 'error'
          })
        }
    })
}