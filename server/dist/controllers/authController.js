import ;
// Help to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
// Register a user
// Post/api/auth/register
export const registerUser = async (req, res) => {
    try {
    }
    catch (error) {
    }
};
// Authenticate a user and get token
// Post/api/auth/login
export const loginUser = async (req, res) => {
    try {
    }
    catch (error) {
    }
};
// Get user profile
// GET/api/auth/me
// @access Private
export const getMe = async (req, res) => {
    try {
    }
    catch (error) {
    }
};
