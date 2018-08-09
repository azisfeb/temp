var express = require('express');   
var router = express.Router();
var md5 = require('md5');
var Sequelize = require('sequelize');
var model = require('../model/user_m');

router.get('/', function(req, res, next){
  var sequelize = req.conn;
  var models = new model(Sequelize, sequelize);
  var sess = req.session;
  if(!sess.username){
    res.redirect('/login');
  }

  // defined model 
  var User = models.user;
  var Article = models.article;

  Article.belongsTo(User, {targetKey: 'id', foreignKey: 'user_id'});

  
  Article.findAll({
    include: [
      User
    ]
  }).then(function(user){
    res.render('index', {
      users: user,
      username: sess.username, 
      password: sess.password
    });
  });
});

router.get('/add', function(req, res, next){
  var sess = req.session;
  if(sess.username == null){
    res.redirect('/login');
  }
  res.render('crud/add', {title: "add"});
});

router.post('/add', function(req, res, next){
  req.check('uname', 'Username cannot be left blank').isLength({min: 4});
  req.check('pass', 'Password cannot be left blank').isLength({min: 4});
  req.check('pass1', 'Password not match').equals(req.body.pass);

  var errors = req.validationErrors();
  if(errors){
    var error_msg = ''
    errors.forEach(function(error) {
        error_msg += '<li>'+error.msg+'</li>';
    });
    req.flash('error', error_msg);
    res.redirect('/add');
  } else {
    req.getConnection(function(err, connection){
      var pass = md5(req.body.pass);
      connection.query('INSERT INTO tbl_user VALUES(?, ?, ?)', ['', req.body.uname, pass], function(err, rows){
        if(err) throw err
        req.session.success = true;
        res.redirect('/');
      });
    });
  }
});

router.get('/edit/:id', function(req, res, next){
  var sess = req.session;
  if(sess.username == null){
    res.redirect('/login');
  }
  req.getConnection(function(err, connection){
    connection.query('SELECT * FROM tbl_user WHERE id=?', [req.params.id], function(err, rows){
      if(err) throw err
      res.render('crud/edit', {users: rows})
    });
  });
});

router.post('/edit', function(req, res, next){
  req.check('uname', 'Username cannot be left blank').isLength({min: 4});
  req.check('pass', 'Password cannot be left blank').isLength({min: 4});

  var errors = req.validationErrors();
  if(errors){
    req.session.errors = errors;
    res.redirect('/add');
    req.session.errors = null;
  } else {
    req.getConnection(function(err, connection){
      var pass = md5(req.body.pass);
      connection.query('UPDATE tbl_user SET username=?, password=? WHERE id=?', [req.body.uname, pass, req.body.userid], function(err, rows){
        if(err) throw err
        req.flash('edit', 'data has been edited!');
        res.redirect('/');
      });
    });
  }
});

router.get('/delete/:id', function(req, res, next){  
  req.getConnection(function(err, connection){
    connection.query('DELETE FROM tbl_user WHERE id=?', [req.params.id], function(err, rows){
      if(err) throw err
      req.flash('delete', 'data has been deleted!');
      res.redirect('/');
    });
  });
});

module.exports = router;
