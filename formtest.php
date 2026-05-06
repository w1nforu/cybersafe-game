<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получаем телефон
    $phone = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone'])) : 'Нет номера';
    
    // Получаем пометку (если ее нет, запишем "Обычная заявка")
    $source = isset($_POST['source']) ? htmlspecialchars($_POST['source']) : 'ТЕСТ';

    $date = date("d.m.Y H:i");

    // Формируем чистый лог: [Дата] Источник: Номер
    $log_entry = "[$date] $source: $phone" . PHP_EOL;

    // Записываем в файл
    file_put_contents("orders.txt", $log_entry, FILE_APPEND | LOCK_EX);

    // Редирект на главную (твой JS подхватит статус success)
    header("Location: index.html?status=success");
    exit();
}
?>