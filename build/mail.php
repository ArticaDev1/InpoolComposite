<?php
  $to = "mail@centr-bsassein.ru"; // емайл получателя данных из формы
  $tema = "Форма обратной связи c сайта compasspools-centr.ru"; // тема полученного емайла
  $message = "<strong>Тема:</strong> ".$_POST['subject']."<br>";
  $message .= "<strong>Имя:</strong> ".$_POST['name']."<br>";//присвоить переменной значение, полученное из формы name=name
  $message .= "<strong>Номер телефона:</strong> ".$_POST['phone']."<br>"; //полученное из формы name=phone
  $message .= "<strong>Комментарий:</strong> ".$_POST['message']."<br>"; //полученное из формы name=email
  $headers  = 'MIME-Version: 1.0' . "\r\n"; // заголовок соответствует формату плюс символ перевода строки
    $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n"; // указывает на тип посылаемого контента
  mail($to, $tema, $message, $headers); //отправляет получателю на емайл значения переменных
?>