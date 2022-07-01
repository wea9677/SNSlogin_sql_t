const router = require('express').Router()
const passport = require('passport');
const { Users } = require('../models')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
require('dotenv').config()


router.get('/kakao', passport.authenticate('kakao'))

const kakaoCallback = (req, res, next) => {
    console.log("여기는 지나가나요!!!!!");
    passport.authenticate(
        'kakao',
        { failureRedirect: '/' },
        async (err, user, info) => {
            console.log("여기는 지나가나요");
            if (err) return next(err)
            const agent = req.headers['user-agent']
            const { userId } = user
            let firstLogin = false
            const currentUser = await userService.getUser(userId)
            const token = jwt.sign({ userId: userId }, process.env.TOKENKEY, {
                expiresIn: process.env.VALID_ACCESS_TOKEN_TIME,
            })
            const refreshToken = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                { expiresIn: process.env.VALID_REFRESH_TOKEN_TIME }
            )

            const key = userId + agent
            await userService.setRedis(key, refreshToken)

            if (!currentUser.likeLocation) firstLogin = true

            return res.json({
                succcss: true,
                token,
                refreshToken,
                userId,
                nickname: currentUser.nickname,
                profileUrl: currentUser.profileUrl,
                firstLogin,
                agreeSMS: currentUser.agreeSMS,
            })
        }
    )(req, res, next)
}
router.get('/kakao/callback', kakaoCallback)


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