<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // для сбора и фльтр инф
    $name    = isset($_POST['username']) ? htmlspecialchars(trim($_POST['username'])) : 'Не указано';
    $phone   = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone'])) : 'Не указано';
    $course  = isset($_POST['course']) ? htmlspecialchars(trim($_POST['course'])) : 'Не указано';
    $message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : 'Нет сообщения';

    // как будет сохранятся в папке
    $date = date("d.m.Y H:i");
    $log_message = "[$date] Имя: $name | Тел: $phone | Курс: $course | Сообщение: $message" . PHP_EOL;
    file_put_contents("orders.txt", $log_message, FILE_APPEND);
    header("Location: index.html?status=success");
    exit();

} else {
    // для защиты, если на прямую зайти в файл выкенить
    header("Location: index.html");
    exit();
}


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // сбор данных
    // трим оператор для проверки
    $name    = isset($_POST['username']) ? htmlspecialchars(trim($_POST['username'])) : 'Клиент (Тест)';
    $phone   = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone'])) : 'Не указан';
    $course  = isset($_POST['course']) ? htmlspecialchars(trim($_POST['course'])) : 'Не выбран';
    $message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

    // для определение источничка заявки
    // если в форме теста нет поля 'course', мы поймем, что это заявка с квиза
    $source = (isset($_POST['course'])) ? "Заявка с сайта" : "Пройден ТЕСТ (нужен PDF)";

    // подготовка для сохранения
    $date = date("d.m.Y H:i");
    
    // формируем красивую строку для лога
    $log_message = "------------------------------------------" . PHP_EOL;
    $log_message .= "[$date] ИСТОЧНИК: $source" . PHP_EOL;
    $log_message .= "Имя: $name | Тел: $phone" . PHP_EOL;
    
    if ($course !== 'Не выбран') {
        $log_message .= "Выбранный курс: $course" . PHP_EOL;
    }
    
    if (!empty($message)) {
        $log_message .= "Сообщение: $message" . PHP_EOL;
    }
    
    $log_message .= "------------------------------------------" . PHP_EOL . PHP_EOL;

    // 4. сохр в файл ордерс
    // FILE_APPEND и LOCK_EX для предотвращение ошибки при одновременной записи
    file_put_contents("orders.txt", $log_message, FILE_APPEND | LOCK_EX);

    // 5. для возвращние на главную после успеха
    header("Location: index.html?status=success");
    exit();

} else {
    // если кто то зашел в файл то его выкенет на главную
    header("Location: index.html");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Собираем данные из полей
    $name = isset($_POST['username']) ? htmlspecialchars(trim($_POST['username'])) : 'Без имени';
    $phone = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone'])) : 'Без телефона';
    
    // 2. Проверяем выбор курса (ключевой момент!)
    // Проверь, чтобы в HTML было <input type="hidden" name="selected_course" ...>
    if (!empty($_POST['selected_course']) && $_POST['selected_course'] !== 'Не выбран') {
        $course = htmlspecialchars($_POST['selected_course']);
    } else {
        $course = "Курс не был выбран кликом";
    }

    $date = date("d.m.Y H:i");

    // 3. Формируем красивый лог
    $log = "========== ЗАЯВКА С ТЕСТА ==========\n";
    $log .= "Дата: $date\n";
    $log .= "Имя: $name\n";
    $log .= "Телефон: $phone\n";
    $log .= "ВЫБРАННЫЙ КУРС: $course\n";
    $log .= "====================================\n\n";

    // 4. Записываем в файл
    file_put_contents("orders.txt", $log, FILE_APPEND | LOCK_EX);

    // 5. Редирект обратно (измени index.html на свою главную, если надо)
    header("Location: index.html?status=success");
    exit();
} else {
    // Если зашли на страницу напрямую без формы
    echo "Ошибка: форма не была отправлена.";
}


?>