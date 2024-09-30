-- Prepares a MySQL server for the project.
CREATE DATABASE IF NOT EXISTS at_test_db;
CREATE USER IF NOT EXISTS 'at_test_usr'@'localhost' IDENTIFIED BY 'at_usr_pwd';
GRANT ALL PRIVILEGES ON at_test_db.* TO 'at_test_usr'@'localhost';
GRANT SELECT ON performance_schema.* TO 'at_test_usr'@'localhost';