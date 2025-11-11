// Placeholder functions for Auth Module

// Register a new user
export const registerUserService = async ({ email, password }) => {
    // TODO: integrate Mongo + hash password
    return { id: '123', email, authProviders: ['local'] };
};

// Login user
export const loginUserService = async (email, password) => {
    // TODO: real login logic later
    return { token: 'fake-jwt-token', user: { id: '123', email } };
};

// Logout user
export const logoutUserService = async (userId) => {
    // TODO: invalidate session
    return { message: `User ${userId} logged out.` };
};