const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { firestore } = require('../service/firestore');

const usersCollection = firestore.collection('users');

const register = async (name, email, password) => {
    const userDoc = await usersCollection.doc(email).get();
    if (userDoc.exists) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.doc(email).set({ name, email, password: hashedPassword });

    return { message: 'User registered successfully' };
};

const login = async (email, password) => {
    const userDoc = await usersCollection.doc(email).get();
    if (!userDoc.exists) {
        throw new Error('Invalid email or password');
    }

    const user = userDoc.data();
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user: { name: user.name, email: user.email } };
};


module.exports = {
    register,
    login
};
