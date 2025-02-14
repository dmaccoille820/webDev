import { authenticateUser } from '../../models/loginModel.js';
import { queryDatabase } from '../../config/db.js';

const login = async (usernameOrEmail, password) => {
    async function getUserData(userId) {
        try {
            console.log("In getUserData in loginController with ", userId);
            const [userDataResult] = await queryDatabase('CALL FindUserById(?)', [userId]);
            const userData = userDataResult[0][0];
            console.log("userData: ", userData);
            return userData;    
        } catch (error) {
            console.error("Error in getUserData:", error);
            throw error;
        }
    }
    try {
        if (!usernameOrEmail || !password) {
            return { status: 400, message: "Username/Email and password are required" };
        }
        const user = await authenticateUser(usernameOrEmail, password);
        if (!user) {
            console.log("User Not Authenticated");
            return { status: 401, message: "Invalid credentials." };
        }

        // User is authenticated!  Send a success response with the user data
        // Create a client-safe user object
        const userData = await getUserData(user.user_id);
        const safeUser = {
            user_id: user.user_id, // Include userId
            username: user.username, // Include username
        };


        // Send a success response with the client-safe user data
        console.log("User Authenticated");
        return {status: 200, safeUser};


    } catch (error) {
        console.error('Error in login controller:', error);
        return {status: 500, message: "Internal server error" };
    }   
      
};

export { login };
