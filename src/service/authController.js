const userService = require('../service/userService');

exports.register = async (request, h) => {
    try {
        const { name, email, password } = request.payload;
        const result = await userService.register(name, email, password);
        return h.response(result).code(201);
    } catch (err) {
        return h.response({ error: err.message }).code(400);
    }
};

exports.login = async (request, h) => {
    try {
        console.log('Request payload:', request.payload);
        const { error } = loginSchema.validate(request.payload);
        if (error) {
            console.log('Validation error:', error.details[0].message);
            throw new Error(error.details[0].message);
        }
        const { email, password } = request.payload;
        const result = await userService.login(email, password);
        return h.response(result).code(200);
    } catch (err) {
        console.log('Login error:', err.message);
        return h.response({ error: err.message }).code(400);
    }
};

