let express = require('express')
let router = express.Router()
let user= require('./API/user')
let info = require('./API/list')

router.get('/user', user.get)
router.get('/list/all', info.all)
router.get('/list/get', info.get)
router.get('/list/add', info.add)
router.get('/list/update', info.update)
router.get('/list/del', info.del)

module.exports = router
