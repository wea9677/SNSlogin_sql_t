const router = require('express').Router()





const user = require('../user')
const { Users } = require('../models')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
require('dotenv').config()


router.use('/user', user)


// 테스트용 라우터
router.post('/testSignup', async (req, res) => {
    const { nickname, password } = req.body
    await Users.create({ nickname, profileUrl: 'aaa', social: password })
    res.status(200).send({
        success: true,
        message: '테스트 계정 완료',
    })
})
router.post('/testlogin', async (req, res) => {
    const { nickname, password } = req.body
    const data = await Users.findOne({
        where: { [Op.and]: [{ nickname }, { social: password }] },
    }).then((value) => {
        return value.dataValues.userId
    })
    if (data !== null) {
        const token = jwt.sign({ userId: data }, process.env.TOKENKEY)
        res.status(200).send({
            success: true,
            token,
        })
    }
})

module.exports = router