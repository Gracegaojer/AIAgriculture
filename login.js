const request = require('request');
const conf = require('./conf');
const xhuser = require('./db/xhuser');

function test(req,res){
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

function getUser(req, response) {
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
                msg: "无法获取openid，查看后端和微信后台",
                list: []
            });
            return;
        }
        else{
            console.log("openid got:",body.openid)
            xhuser.exist_xhuser(body.openid).then(userId=>{
                console.log(userId)
                if(userId == -1){
                    //没有该用户，插入空用户并返回，要求用户填写信息
                    response.json({
                        errcode: 1,//没有用户
                        openid: body.openid,
                        msg: "success"
                    });
                }
                else{
                    xhuser.select_xhuser(userId).then(user=>{
                        response.json({
                            errcode: 0,//有该用户
                            userInfo: user,
                            msg: "success"
                        });
                    }).catch(err=>{
                        console.log("something wrong2");
                        response("something wrong2");
                    });
                }
            })
            .catch(err=>{
                console.log("something wrong3");
                response("something wrong3");
            });
            return;
        }
    });
};

module.exports = {
    test,
    getUser
};