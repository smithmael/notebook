const defineAbilityFor = require('../utils/ability');

const authorize = (action, subject) => {
  return (req, res, next) => {
    const user = req.user; // set by auth.js

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const ability = defineAbilityFor(user);

    if (ability.can(action, subject)) {
      return next();
    }

    return res.status(403).json({ message: 'Forbidden' });
  };
};

module.exports = authorize;