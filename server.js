const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const passport = require('passport')

const db = require('./config/keys').mongoURL
const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')

//使用 body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//设置跨域请求头
app.all('*', (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || '*';
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
  res.header("X-Powered-By", 'Express');
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});


//数据库连接
mongoose.connect(db)
    .then(()=>{
        console.log('数据库连接成功')
    })
    .catch(err=>{
        console.log(`错误:${err}`)
    })

// passport初始化 
app.use(passport.initialize()); 
require('./config/passport')(passport);


//路由
app.get('/',(req,res)=>{
    res.send('index.html')
})
app.use('/api/users',users)
app.use('/api/profiles',profiles)


const port = process.env.PORT || 3004; 
app.listen(port,()=>{
    console.log(`服务 http://localhost:${port}`)
})

















