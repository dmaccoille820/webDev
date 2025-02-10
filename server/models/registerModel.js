import { queryDatabase } from '../config/db.js';
import bcrypt from 'bcrypt';

export const createUser = async (userData) => {
  console.log("createUser - entered", userData);
  const { name, username, email, password } = userData;
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(
    password,
    bcrypt.genSaltSync(saltRounds)
  );
  const result = await queryDatabase("CALL RegisterUser(?, ?, ?, ?, @p_userId)", [
    name,
    username,
    email,
    hashedPassword,
  ]);

  const userIdResult = await queryDatabase('SELECT @p_userId AS userId');
  const userId = userIdResult[0].userId;

  console.log("createUser - result", result);
  return userId;
};

export const checkUsernameAvailability = async (username, email) => {
  const rows = await queryDatabase(
      "CALL CheckUsernameOrEmailAvailability(?, ?, @p_isAvailable)",
      [username, email]
  );
  const result = await queryDatabase('SELECT @p_isAvailable AS isAvailable');

  console.log("Rows returned from database:", rows);
  console.log("result:", result);

  if (result && result.length > 0) {
      const isAvailableValue = result[0].isAvailable;
      console.log("is available? 1 = yes. -1, -2 are fails", isAvailableValue);
      return isAvailableValue;
  } else {
      return 0; 
  }
};






