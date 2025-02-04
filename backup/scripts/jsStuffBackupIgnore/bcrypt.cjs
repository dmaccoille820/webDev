import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
const saltRounds = 10; 
// Consider complexity cost security vs response time

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'taskmanager'
});

// Connect to the database
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the database');

  // Retrieve users' passwords from the database
  connection.query('SELECT email, password FROM users', (err, results) => {
    if (err) throw err;

    results.forEach(user => {
      const { email, password } = user;

      // Hash the password
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.error('Error hashing password for user', email, err);
          return;
        }

        // Update the database with the hashed password
        connection.query(
          'UPDATE users SET password = ? WHERE email = ?',
          [hash, email],
          (err, result) => {
            if (err) {
              console.error('Error updating password for user', email, err);
              return;
            }
            console.log(`Password for user ${email} updated successfully.`);
          }
        );
      });
    });
  });
});
/*
// Hashing during user registration
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt(saltRounds); // Generate unique salt
  const hash = await bcrypt.hash(password, salt);

  // ... store hash in database ...
});
*/
