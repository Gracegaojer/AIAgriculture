'use strict';
const express = require('express');
const app = express();
const path = require('path');
const login = require('./login');
const conf = require('./conf');
const xhuser = require('./db/xhuser');

// var user = {
//     // id:1,
//     openid: 'oVtRc5ZA8i9S4qN7gG4K1lM3e_Hk1',
//     username:'gaojie',
//     phone: '18801191866',
//     village: '大王楼',
//     userrole:2,
//     shanchu:0
// };

// xhuser.insert_xhuser(user);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('static', path.join(__dirname, 'tmp'));


app.use(`/login`, login.test);
app.get('/',(req,res)=>{
    res.send("hey")
    console.log("getted")
});
app.use('/getUser',login.getUser);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
    });
});

var server = app.listen(conf.port, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`listening at ${port}`);
});