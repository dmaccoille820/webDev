import { queryDatabase } from '../controllers/db.js';
import bcrypt from 'bcrypt';


export const findUserByUsernameOrEmail = async (usernameOrEmail) => {
    console.log("findUserByUsernameOrEmail called with:", usernameOrEmail); 
    const [rows] = await queryDatabase('CALL FindUserByUsernameOrEmail(?, @user_id_out)', [usernameOrEmail]);
    console.log("findUserByUsernameOrEmail rows:", rows); 
    const [[result]] = await queryDatabase('SELECT @user_id_out AS user_id');
    console.log("findUserByUsernameOrEmail result:", result); 
    if (result && result.user_id) {
    return result.user_id;
    } else {
    return -1;
    }
    };
    
export const findUserById = async (userId) => {
    console.log('findUserById called with userId:', userId);
    console.log('findUserById: About to execute database query - CALL findUserById');
    await queryDatabase('CALL findUserById(?, @p_name, @p_username, @p_email, @p_password)', [userId]);
    console.log('findUserById: About to execute database query - SELECT @p_name');
    const result = await queryDatabase('SELECT @p_name as name, @p_username as username, @p_email as email, @p_password as password');
    console.log('findUserById: Query executed, result obtained.');
    if (result && result.length > 0) {
        console.log('findUserById: Results returned:');
        result.forEach((row, index) => {
            console.log(`  Row ${index + 1}:`, row);
        });
        return result[0];
    } else {
        console.log('findUserById: No results returned.');
        return null;
    }
};

export const authenticateUser = async (usernameOrEmail, password) => {
    console.log("authenticateUser - entered with:", usernameOrEmail);
      try {
        console.log("Trying to find user with:", usernameOrEmail);
         const queryString = "SELECT user_id, username, email, password, name FROM users WHERE username = ? OR email = ?";
        const queryParams = [usernameOrEmail, usernameOrEmail];
        console.log('queryString:', queryString);
        console.log('queryParams:', queryParams);
          const userResult = await queryDatabase(
            queryString,
            queryParams
          );
          console.log("User search result:", userResult);
          if (userResult.length === 0) {
              console.log("No user found with:", usernameOrEmail);
              return null;
          }
          const user = userResult[0];
          console.log('User found:', user.username || user.email, user); // NEW LOG
          console.log("Password from form:", password); // NEW LOG
          const userId = user.user_id;
          const passwordMatch = await bcrypt.compare(password, user.password);
          console.log("bcrypt.compare result:", passwordMatch); //Add this line
      
            if (passwordMatch) {
              return {user_id: userId}; // Password match
            } else {
              console.log("Password did not match");
              return null; // Incorrect password
            }
          } catch (error) {
            console.error('Error authenticating user:', error);
            return null;
          }
      };