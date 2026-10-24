<?php
/**
 * CODELIX cPanel Database & API Configuration
 * Put your cPanel MySQL Database credentials here.
 */

define('DB_HOST', 'localhost');
define('DB_PORT', 3306);
define('DB_NAME', 'codepmuo_codelix');      // Your cPanel Database Name
define('DB_USER', 'codepmuo_user');         // Your cPanel Database Username
define('DB_PASS', 'YOUR_DB_PASSWORD_HERE'); // Your cPanel Database Password

function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            // Return null if database is not yet created or configured
            return null;
        }
    }
    return $pdo;
}
