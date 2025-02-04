-- Use the TaskManager database
USE TaskManager;

-- Create a procedure to update passwords using SHA2 hashing
DELIMITER $$

CREATE PROCEDURE HashAndUpdatePasswords()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE userEmail VARCHAR(255);
    DECLARE userPassword VARCHAR(255);
    DECLARE cur CURSOR FOR SELECT email, password FROM users;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO userEmail, userPassword;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        SET @hashedPassword = SHA2(userPassword, 256);
        UPDATE users SET password = @hashedPassword WHERE email = userEmail;
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;
