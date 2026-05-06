<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'] ?? '';
    $pass = $_POST['pass'] ?? '';
    $action = $_POST['action'] ?? '';
    $userCode = $_POST['code'] ?? '';

    // ЭТАП 2: Если код пришел, проверяем его
    if (!empty($userCode)) {
        if (isset($_SESSION['temp_code']) && $userCode == $_SESSION['temp_code']) {
            if ($_SESSION['temp_action'] === 'register') {
                $userData = "Email: " . $_SESSION['temp_email'] . " | Pass: " . $_SESSION['temp_pass'] . PHP_EOL;
                file_put_contents('users.txt', $userData, FILE_APPEND);
            }
            echo "success_auth";
            exit;
        } else {
            echo "wrong_code";
            exit;
        }
    }

    // ЭТАП 1: Проверка данных и "отправка" кода
    if ($action === 'login') {
        $file = 'users.txt';
        if (!file_exists($file) || strpos(file_get_contents($file), "Email: $email | Pass: $pass") === false) {
            echo "error";
            exit;
        }
    }

    // Генерируем код для лога
    $code = rand(100000, 999999);
    $_SESSION['temp_code'] = $code;
    $_SESSION['temp_email'] = $email;
    $_SESSION['temp_pass'] = $pass;
    $_SESSION['temp_action'] = $action;

    $log = "--- MOBILE AUTH ---\nКому: $email\nКод: $code\n-------------------\n\n";
    file_put_contents('mail_log.txt', $log, FILE_APPEND);

    echo "send_code";
    exit;
}
?>