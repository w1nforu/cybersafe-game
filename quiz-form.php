<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // для получения данных
    $email = $_POST['email'] ?? 'guest';
    $course = $_POST['course'] ?? 'Not selected';
    $phone = $_POST['phone'] ?? 'guest';
    $date = date("Y-m-d H:i:s");

    // для формирования строки 
    $orderData = "[$date] User: $email | Course: $course | Phone: $phone" . PHP_EOL;
    
    // сохраняем данные 
    file_put_contents('orders.txt', $orderData, FILE_APPEND);
    
    // выводим на главный экран
    header("Location: index.html?status=success");
    exit();
}
?>