"use strict";
const digestRequest = require('request-digest');
const uuid = require('uuid');
const conf = require("../conf");
const request = require('request');
var CryptoJS = require("crypto-js");
var mysqlutils = require("../utils/mysql");
var mysqlpool = mysqlutils.mysqlpool;
var startTransaction = mysqlutils.transaction;
var commit = mysqlutils.commit;
var moment = require("moment");
var handleError = mysqlutils.handleError;

function getUserByOpenid(openid){
    return new Promise((resolve, reject) => {
        startTransaction(mysqlpool, function (conn) {
            conn.query("SELECT id,name,phone FROM tb_xhuser where openid=?", [openid], function (err, res) {
                commit(conn, 201, null, false);//数据库事务
                var xueshengbiaoIDstr='';
                res.forEach(element => {
                    xueshengbiaoIDstr += element.xueshengbiaoID.toString()+",";
                });
                console.log(xueshengbiaoIDstr)
                xueshengbiao.getXueshengModel(xueshengbiaoIDstr.slice(0,-1)).then(result=>{
                    console.log(result)
                    result.forEach((ele,index)=>{
                        ele.VIPyue=res[index].reportVIP;
                    })
                    resolve(result)
                }).catch(err=>{
                    reject(err)
                });
            });
        });
    });
}