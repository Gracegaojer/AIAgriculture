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

//--------------对用户表的增删查改------------------
function exist_xhuser(openid){
    return new Promise((resolve, reject) => {
        startTransaction(mysqlpool, function (conn) {
            conn.query("SELECT id FROM tb_xhuser where openid=?", [openid], function (err, result) {
                if (err) {
                    reject(err)
                }
                else{
                    commit(conn, 201, null, false);
                    if(result.length>0){
                        console.log(result[0].id)
                        resolve(result[0].id);//有则返回列表第一个元素（正常来说列表应该就只有一个）
                    }
                    else {
                        console.log(-1)
                        resolve(-1);
                    }
                }
            });
        });
    });
}

async function insert_xhuser(user){
    /*user{
        id(auto)
        openid//oVtRc5ZA8i9S4qN7gG4K1lM3e_Hk
        name
        phone
        village
        role
    }*/
    console.log('--------------insert---------------')
    var userID;
    console.log(user)
    let flag=true;
    try {
        userID = await exist_xhuser(user.openid);
    } catch (err) {
        console.log(err);
        flag = false;
    }
    
    return new Promise((resolve, reject) => {
        if (!flag) {
            reject("用户表查找出错，请联系运维工作人员测试服务器功能");
        }else{
            console.log(userID)
            if(userID == -1){
                startTransaction(mysqlpool, function (conn) {
                    conn.query('insert into tb_xhuser set ?', user, function (err, result) {
                        commit(conn, 201, null, false);
                        if (err) {
                            console.log('err')
                            reject(err)
                        }
                        else{
                            console.log('suc')
                            commit(conn, 201, null, false);
                            resolve(result);
                        }
                    });
                });
            }
            else {
                resolve(0);
            }
        }
    });
}

function delete_xhuser(){
    
}

function alter_xhuser(){

}

function select_xhuser_byopenid(openid){
    return new Promise((resolve, reject) => {
        startTransaction(mysqlpool, function (conn) {
            conn.query("SELECT * FROM tb_xhuser where openid=?", [openid], function (err, res) {
                commit(conn, 201, null, false);
                if (err) {
                    reject(err)
                }
                else{
                    resolve(results);
                }
            });
        });
    });
}

module.exports = {
    exist_xhuser,
    insert_xhuser,
    delete_xhuser,
    alter_xhuser,
    select_xhuser_byopenid
};