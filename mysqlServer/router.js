let express = require('express')
let router = express.Router()
let user = require('./API/list')


router.get('/list/all', user.all)
router.get('/list/get', user.get)
router.get('/list/add', user.add)
router.get('/list/update', user.update)
router.get('/list/del', user.del)

module.exports = router
