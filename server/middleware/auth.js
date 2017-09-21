const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (!Object.keys(req.cookies).length) {
    return models.Sessions.create()
      .then(result => {
        return models.Sessions.get({id: result.insertId});
      })
      .then(session => {
        req.session = {};
        req.session['hash'] = session.hash;
        res.cookie('shortlyid', session.hash);
        next();
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    return models.Sessions.get({hash: req.cookies.shortlyid})
      .then(session => {
        if (session) {
          req.session = session;
          next();
        } else {
          req.cookies = {};
          module.exports.createSession(req, res, next);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.updateSession = (req, res, next) => {
  const {username} = req.body;
  return models.Users.get({username})
    .then(user => {
      return models.Sessions.update({hash: req.session.hash}, {userId: user.id});
    })
    .catch(err =>{
      console.log(err);
    });
};

module.exports.loginUser = (req, res, next) => {
  return module.exports.updateSession(req, res, next)
    .then(result => {
      return true;
    }) 
    .catch(err =>{
      return false;
      console.log(err);
    });
};

module.exports.logoutUser = (req, res, next) => {

  return models.Sessions.delete({hash: req.session.hash})
  .catch(err => {
    console.log(err);
  });
};

module.exports.verifySession = (req, res, next) => {
  if (models.Sessions.isLoggedIn(req.session)) {
    return true;
  } 
  res.redirect('/login');
};
