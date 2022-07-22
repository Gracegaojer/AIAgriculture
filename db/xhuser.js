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
//openid -> id
function exist_xhuser(openid){
    return new Promise((resolve, reject) => {
        startTransaction(mysqlpool, function (conn) {
            conn.query("SELECT id FROM tb_xhuser where openid=? and chanchu=0", [openid], function (err, result) {
                if (err) {
                    reject(err)
                }
                else{
                    commit(conn, 201, null, false);
                    if(result.length>0){
                        console.log('user existed')
                        resolve(result[0].id);//有则返回列表第一个元素（正常来说列表应该就只有一个）
                    }
                    else {
                        console.log('no this user')
                        resolve(-1);
                    }
                }
            });
        });
    });
}

//插入user对象
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
            if(userID == -1){
                startTransaction(mysqlpool, function (conn) {
                    conn.query('insert into tb_xhuser set ?', user, function (err, result) {
                        if (err) {
                            console.log('err')
                            reject(err)
                        }
                        else{
                            console.log('suc')
                            commit(conn, 201, null, false);
                            resolve(result.insertId);
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

function delete_xhuser(id){
    //update shanchu=1
    return new Promise((resolve, reject) => {
        startTransaction(mysqlpool, function (conn) {
            conn.query("update tb_xhuser set shanchu=1 where id = ?", id, function (err, result) {
                if (err) {
                    reject(err)
                }
                else{
                    commit(conn, 201, null, false);
                    if (err) {
                        reject(err);
                    }else{
                        console.log(result);
                        if(result.changedRows == 1){//已更新
                            resolve(1);
                        }else{
                            resolve(0);
                        }
                    }
                }
            });
        });
    });
}

//更新user对象by id
function alter_xhuser(user){
    return new Promise((resolve, reject) => {
        startTransaction(mysqlpool, function (conn) {
            conn.query("update tb_xhuser set ? where id = ?", [user,user.id], function (err, result) {
                if (err) {
                    reject(err)
                }
                else{
                    commit(conn, 201, null, false);
                    if (err) {
                        reject(err);
                    }else{
                        console.log(result);
                        if(result.changedRows == 1){//已更新
                            resolve(1);
                        }else{
                            resolve(0);
                        }
                    }
                }
            });
        });
    });
}

function select_xhuser(id){
    return new Promise((resolve, reject) => {
        startTransaction(mysqlpool, function (conn) {
            conn.query("SELECT * FROM tb_xhuser where id=? and chanchu=0", [id], function (err, results) {
                commit(conn, 201, null, false);
                if (err) {
                    reject(err)
                }
                else{
                    resolve(results[0]);
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
    select_xhuser,
    delete_xhuser
};