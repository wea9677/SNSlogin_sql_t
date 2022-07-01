const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Router = require('./routes')
const passport = require('passport')
const passportConfig = require('./passport')
const path = require('path')
const PORT = 8080


require('dotenv').config()


const corsOptions = {
    origin: [
        'http://localhost:3000',
     
    ], // 허락하고자 하는 요청 주소
    credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
}

app.use(cors(corsOptions))

app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))



passportConfig()

//! express-session에 의존하므로 뒤에 위치해야 함
// app.use(passport.initialize()) // 요청 객체에 passport 설정을 심음
// app.use(passport.session()) // req.session 객체에 passport정보를 추가 저장
// passport.session()이 실행되면, 세션쿠키 정보를 바탕으로 해서 passport/index.js의 deserializeUser()가 실행하게 한다.

app.use('/', Router)

app.get('/', (req, res) => {
    res.send("안녕")
})



app.use((err, req, res, next) => {
    console.log(err)
    Logger.error(`${err.message} \n ${err.stack ? err.stack : ''} `)
    return res.status(400).json({ success: false, message: err.message })
})

app.listen(PORT, function(){
    console.log('server on! http://localhost:'+ PORT);
  });

module.exports = app