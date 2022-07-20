'use strict';
const mysql = require('mysql');
const conf = require('../conf');
const STATUS_CODES = require('http').STATUS_CODES;
const mysqlpool = mysql.createPool({
    connectionLimit: 10,
    multipleStatements: true,
    host: conf.mysqlconf.host,
    database: conf.mysqlconf.database,
    user: conf.mysqlconf.user,
    password: conf.mysqlconf.password,
  });

  const commit = function (conn, code, ret, rollback) {
    conn.commit((err) => {
      if (err) {
        handleError(err, conn, rollback);
      } else {
        conn.release();
        if (!ret) {
          ret = {
            msg: STATUS_CODES[code],
          };
        }
      }
    });
  };
  
  var handleError = function (err, conn, rollback) {
    console.log('Mysql error: ', err);
    if (rollback) {
      conn.rollback(() => {
        conn.release();
      });
    } else if (conn) conn.release();
  };
  
  const transaction = function (pool, cb) {
    pool.getConnection((err, conn) => {
      if (err) handleError(err, null, false);
      else {
        conn.beginTransaction((err) => {
          if (err) handleError(err, conn, false);
          else cb(conn);
        });
      }
    });
  };
  
  module.exports = {
    handleError,
    transaction,
    commit,
    mysqlpool,
  };
  