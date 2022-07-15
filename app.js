'use strict';
const express = require('express');
const app = express();
const path = require('path');
const loginmethod = require('./login');
const conf = require('./conf');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('static', path.join(__dirname, 'tmp'));


app.use(`/login`, loginmethod.login);
app.get('/',(req,res)=>{
    res.send("hey")
    console.log("getted")
});
app.use('/getOpenid',loginmethod.getOpenid);

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