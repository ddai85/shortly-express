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
      return models.Sessions.update({userId: null, hash: req.session.hash}, {userId: user.id});
    })
    .then(result => {
      console.log(result);
    })
    .catch(err =>{
      console.log(err);
    });


};