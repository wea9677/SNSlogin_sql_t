// const passport = require('passport')
// const jwt = require('jsonwebtoken')
// require('dotenv').config()

// console.log("여기는 지나가나요?????");
// const kakaoCallback = (req, res, next) => {
//     console.log("여기는 지나가나요!!!!!");
//     passport.authenticate(
//         'kakao',
//         { failureRedirect: '/' },
//         async (err, user, info) => {
//             console.log("여기는 지나가나요");
//             if (err) return next(err)
//             const agent = req.headers['user-agent']
//             const { userId } = user
//             let firstLogin = false
//             const currentUser = await userService.getUser(userId)
//             const token = jwt.sign({ userId: userId }, process.env.TOKENKEY, {
//                 expiresIn: process.env.VALID_ACCESS_TOKEN_TIME,
//             })
//             const refreshToken = jwt.sign(
//                 { userId: userId },
//                 process.env.TOKENKEY,
//                 { expiresIn: process.env.VALID_REFRESH_TOKEN_TIME }
//             )

//             const key = userId + agent
//             await userService.setRedis(key, refreshToken)

//             if (!currentUser.likeLocation) firstLogin = true

//             return res.json({
//                 succcss: true,
//                 token,
//                 refreshToken,
//                 userId,
//                 nickname: currentUser.nickname,
//                 profileUrl: currentUser.profileUrl,
//                 firstLogin,
//                 agreeSMS: currentUser.agreeSMS,
//             })
//         }
//     )(req, res, next)
// }

// module.exports = {
//     kakaoCallback
// }