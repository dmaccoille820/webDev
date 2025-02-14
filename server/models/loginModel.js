import bcrypt from 'bcrypt';
import { queryDatabase } from '../config/db.js';
async function authenticateUser(usernameOrEmail, password) {
    try {
        console.log("In authenticateUser in loginModel with ", usernameOrEmail, password);
        const [findUserResult] = await queryDatabase('CALL FindUserByUsernameOrEmail(?, @p_user_id_out)', [usernameOrEmail]);
        
        console.log("findUserResult:", findUserResult);
        if (!findUserResult[0] || findUserResult[0].length === 0) {
            console.log("User not found");
            return null;
        }
        const user = findUserResult[0].user_id_out;
        console.log("user:", user);
        const user_id_out = user
        
        
       
        if(user_id_out === undefined) {
            return null;
        }
        const [userDataResult] = await queryDatabase('CALL FindUserById(?)', [Number(user_id_out)]);

        const userData = userDataResult[0];
        console.log("userData", userData);

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        console.log("isPasswordValid: ", isPasswordValid);
        if (!isPasswordValid) {
            console.log("Invalid password");
            return null;
        }

        return {
            user_id: user_id_out,
            name: userData.name,
            username: userData.username,
            email: userData.email,
        };
    } catch (error) {
        console.error("Error in authenticateUser:", error);
        throw error;
    }
}

export { authenticateUser };
