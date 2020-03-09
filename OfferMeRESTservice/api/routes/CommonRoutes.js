var userController = require('../controllers/UserController');

module.exports = (app) => {
  app.route('/tasks')
    .get(userController.basic)
};
