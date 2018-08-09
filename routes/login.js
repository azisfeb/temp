var express = require('express');   
var router = express.Router();
var md5 = require('md5');
var Sequelize = require('sequelize');
const model = require('../model/user_m.js');

router.get('/', function(req, res, next){
    res.render('login');
});

/*router.post('/', function(req, res, next){
    var sess = req.session;
    var uname = req.body.uname;
    var pass = md5(req.body.pass);
    req.getConnection(function(err, conn){
        conn.query("SELECT * FROM tbl_user WHERE username=?", [uname], function(err, rows){
            if(err){
                console.log(err);
            } else if(rows.length <= 0){
                req.flash('error', 'Username did not Exists');
                res.redirect('/login');
            } else {
                if(pass == rows[0].password){
                    sess.username = uname;
                    sess.password = pass;
                    sess.logged_in = true;
                    if(sess.logged_in){
                        res.redirect('/');
                    }
                } else {
                    req.flash('error', 'Username and password not match');
                    res.redirect('/login');
                }
            }
        });
    });
});*/

router.post('/', function(req, res, next){
    //console.log(model);
    var sequelize = req.conn;
    var models = new model(Sequelize, sequelize);
    var sess = req.session;
    var uname = req.body.uname;
    var pass = md5(req.body.pass);

    //defined model
    var User = models.user;

    User.findOne({where: {username: uname} }).then(row => {
        if(row == null){
            req.flash('error', 'Username did not Exists');
            res.redirect('/login');
        } else {
            if(pass == row.password){
                sess.username = uname;
                sess.password = pass;
                sess.logged_in = true;
                if(sess.logged_in){
                    res.redirect('/');
                }
            } else {
                req.flash('error', 'Username and password not match');
                res.redirect('/login');
            }
        }
    });
      
});

router.get('/logout', function(req, res, next){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/login');
        }
    });
});

module.exports = router;