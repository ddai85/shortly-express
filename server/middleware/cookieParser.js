const parseCookies = (req, res, next) => {

  const cookieObj = {};
  const cookieString = req.headers.cookie || '';
  if (cookieString.length) {
    const cookieArray = cookieString.split('; ');

    cookieArray.forEach(cookie => {
      const cookiePair = cookie.split('=');
      cookieObj[cookiePair[0]] = cookiePair[1];
    });
  }

  req.cookies = cookieObj;
  next();
};

module.exports = parseCookies;