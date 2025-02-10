import { queryDatabase } from '../config/db.js';
import bcrypt from 'bcrypt';


export const findUserByUsernameOrEmail = async (usernameOrEmail) => {
    await queryDatabase('CALL FindUserByUsernameOrEmail(?, @user_id_out)', [usernameOrEmail]);
    
    // Fetch the OUT parameter value
    const resultRows = await queryDatabase('SELECT @user_id_out AS user_id');
    const resultId = resultRows && resultRows.length > 0 ? resultRows[0] : null;
    
    if (resultId && resultId.user_id !== null && resultId.user_id !== undefined) {
        return resultId.user_id;
    } else {
        return -1;
    } 
};


export const authenticateUser = async (usernameOrEmail, password) => {
    try {
        
        const userId = await findUserByUsernameOrEmail(usernameOrEmail);
        if(userId === -1 || userId === null){return null;}
        
        const userRows = await queryDatabase('SELECT * FROM users WHERE user_id = ?', [userId]);
        const user = userRows && userRows.length > 0 ? userRows[0] : null;

        console.log("User found:", user.username || user.email, user);

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return { ...user, user_id: userId };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error authenticating user:", error);
        return null;
    } 
};
