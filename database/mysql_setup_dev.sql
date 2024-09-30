-- Prepares a MySQL server for the project.
CREATE DATABASE IF NOT EXISTS at_dev_db;
CREATE USER IF NOT EXISTS 'at_dev_usr'@'localhost' IDENTIFIED BY 'at_dev_pwd';
GRANT ALL PRIVILEGES ON at_dev_db. * TO 'at_dev_usr'@'localhost';
GRANT SELECT ON performance_schema. * TO 'at_dev_usr'@'localhost';