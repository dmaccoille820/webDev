DELIMITER //

CREATE PROCEDURE ValidateSession(
    IN p_sessionId VARCHAR(255),
    OUT p_userId INT,
    OUT p_isValid INT
)
BEGIN
    DECLARE sessionCount INT;
    DECLARE nowTimestamp BIGINT;
    DECLARE sessionExpiresTimestamp BIGINT;
    DECLARE sessionIsValid INT;
    SET p_userId = NULL;
    
    -- Check if the session exists
    SELECT COUNT(*) INTO sessionCount FROM sessions WHERE session_id = p_sessionId;
    
    IF sessionCount > 0 THEN
    -- The session exists, let's validate
        SELECT UNIX_TIMESTAMP(expires_at), isValid INTO sessionExpiresTimestamp, sessionIsValid  FROM sessions WHERE session_id = p_sessionId;
        SET nowTimestamp = UNIX_TIMESTAMP();
        -- Is the session expired?
        IF nowTimestamp > sessionExpiresTimestamp THEN 
            -- Session is expired
            SET p_isValid = 0;
            -- Update isValid to 0
            UPDATE sessions SET isValid = 0 WHERE session_id = p_sessionId;
        ELSEIF sessionIsValid = 1 THEN
            -- Session is valid.
            SET p_isValid = 1;
            SELECT user_id INTO p_userId FROM sessions WHERE session_id = p_sessionId;
            -- Update the session expiration and return true
            
            UPDATE sessions
            SET expires_at = FROM_UNIXTIME(nowTimestamp + 3600) 
            WHERE session_id = p_sessionId;
        ELSE
            -- Session is not valid.
            SET p_isValid = 0;
            
        END IF;
    ELSE
    -- the session does not exist
        SET p_isValid = 0;
        
    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE FindUserByUsernameOrEmail(
    IN p_usernameOrEmail VARCHAR(255),
    OUT p_user_id INT
)
BEGIN
    SELECT user_id INTO p_user_id
    FROM users
    WHERE username = p_usernameOrEmail OR email = p_usernameOrEmail;
END //

DELIMITER ;
DELIMITER //

CREATE PROCEDURE findUserById(
    IN p_user_id INT,
    OUT p_name VARCHAR(255),
    OUT p_username VARCHAR(255),
    OUT p_email VARCHAR(255),
    OUT p_password VARCHAR(255)
)
BEGIN
    SELECT name, username, email, password
    INTO p_name, p_username, p_email, p_password
    FROM users
    WHERE user_id = p_user_id;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE CheckUsernameOrEmailAvailability(
    IN p_username VARCHAR(255),
    IN p_email VARCHAR(255),
    OUT p_isAvailable INT
)
BEGIN
    DECLARE usernameCount INT;
    DECLARE emailCount INT;

    SELECT COUNT(*) INTO usernameCount FROM users WHERE username = p_username;
    SELECT COUNT(*) INTO emailCount FROM users WHERE email = p_email;

    IF usernameCount > 0 THEN
        SET p_isAvailable = -1; -- Username taken
    ELSEIF emailCount > 0 THEN
        SET p_isAvailable = -2; -- Email taken
    ELSE
        SET p_isAvailable = 1; -- Available
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UpdateSessionUser(
    IN p_sessionId VARCHAR(255),
    IN p_userId INT
)
BEGIN
    UPDATE sessions
    SET user_id = p_userId, isValid = 1
    WHERE session_id = p_sessionId;
END //

DELIMITER ;