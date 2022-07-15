/*
errcode:
0: no err
1: something wrong with our backstage
2: something wrong with tencent
*/

const request = require('request');
const conf = require('./conf');

function login(req,res){
    console.log(req.query)
    res.send("hi-login")
    console.log("login!")
}

function finduser(openid){
    havethis = 0;
    if( havethis ){
        return {
            id:0,
            name:"gaojie",
            phone:"12"
        };
    }else{
        return null;
    }
}

function getOpenid(req, response) {
    console.log(req.query.code);
    let code = req.query.code;
    let options = {
        url: `https://api.weixin.qq.com/sns/jscode2session?appid=${conf.miniConfig.appid}&secret=${conf.miniConfig.appsecret}&js_code=${code}&grant_type=authorization_code`,
        json: true,
        method: "GET"
    };

    request(options, function (err, res, body) {
        if (!body.openid) {
            console.log("!!!body:")
            response.json({
                errcode: 2,
                openid: null,
                msg: "无法获取openid",
                list: []
            });
            return;
        }
        else{
            console.log("openid got")
            usr = finduser(body.openid)
            if(usr!=null){
                response.json({
                    errcode: 0,
                    openid: body.openid,
                    msg: "success",
                    usrinfo: usr
                });
            }else{
                response.json({
                    errcode: 1,
                    openid: body.openid,
                    msg: "success",
                    usrinfo: usr
                });
            }
            
            return;
        }
    });
};

module.exports = {
    login,
    getOpenid
};