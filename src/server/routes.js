const authController = require('../service/authController');
const postPredictHandler = require('../server/handler');

module.exports = [
    {
        method: 'POST',
        path: '/register',
        handler: authController.register
    },
    {
        method: 'POST',
        path: '/login',
        handler: authController.login
    },
    {
        method: 'PUT',
        path: '/editUsers/{userId}',
        handler: authController.updateUser
    },
    {
        path: '/predict',
        method: 'POST',
        handler: postPredictHandler,
        options: {
          payload: {
            allow: 'multipart/form-data',
            multipart: true
          }
        }
    }
];