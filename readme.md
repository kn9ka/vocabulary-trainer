
Run it if you want to develop

`npm i`

`npm run start`

If you want to build

`npm i`

`npm run build`


https://fundraiseup.notion.site/Frontend-test-dba2aced238f42318ca7e3982e23f84a

# Задача

Напишем клиентскую часть тренажера для тренировки и запоминания английских слов.

Вот как должен выглядеть результат.


## Верстка

Используйте **[готовую верстку](https://gist.github.com/anton-isaykin/6018c5e125ecf8b66ac89634d839960d)** для приложения. Измените разметку, если потребуется.

## Бизнес-логика

- Набор слов для тренировок зашит в приложении.

    ```json
    [
      "apple",
      "function",
      "timeout",
      "task",
      "application",
      "data",
      "tragedy",
      "sun",
      "symbol",
      "button",
      "software"
    ]
    ```

- Каждая тренировка содержит 6 случайных слов из списка и представляет собой последовательный набор заданий.
- В каждом задании пользователь получает слово, разбитое на буквы, перемешанные в случайном порядке.
- Задача пользователя — собрать слово целиком.
- Пользователь может кликать на кнопки с буквами или нажимать соответствующие клавиши на клавиатуре.
- Если пользователь выбирает некорректную букву, то приложение засчитывает ошибку и подсвечивает соответствующую кнопку красным цветом.
- При вводе с клавиатуры подсветка срабатывает только если буква присутствует в слове. Если она отсутствует, то приложение просто засчитывает ошибку без индикации.
- Максимальное кол-во ошибок на одном задании — 3. При достижении этого лимита все кнопки встают в правильном порядке, но перекрашиваются в красный цвет.
- Если пользователь нажал на клавиатуре на отсутствующую букву, то приложение засчитывает ошибку.
- После завершения тренировки приложение выдает статистику:
    - Число собранных слов без ошибок.
    - Число ошибок.
    - Слово с самым большим числом ошибок.
- Для вывода статистики нет готового UI, отобразите данные любым удобным способом.

## Бонус-трек

Выполните дополнительные требования, если задание показалось вам очень простым.

- Если пользователь закрывает вкладки или обновляет страницу до полного завершения задачи, то при повторном заходе на страницу приложение должно предложить продолжить ранее начатую тренировку. При согласии пользователя, приложение восстанавливается в том же состоянии, что было на момент закрытия вкладки или обновления страницы.
- Приложение реагирует на нажатие кнопок навигационных кнопок вперед-назад в браузере и позволяет перемещаться между уже выполненными заданиями.

# Технические требования

- Весь код должен быть написан на TypeScript.
- Самостоятельно настройте сборку проекта — Webpack 5, Babel, TS и dev server.
- В dev-сборке отдайте HTML страницу приложения используя Webpack Dev Server и hot module replacement.
- Не используйте фреймворки и готовые библиотеки. Все взаимодействие с DOM должно быть выполнено стандартными средствами.
- Не используйте Flux и ему подобные паттерны и для организации данных и логики приложения.
- Разделите бизнес-логику и логику представления таким образом, чтобы была возможность безболезненно заменить UI-слой — например, вместо DOM использовать Canvas.
- Весь код должен быть в одном репозитории.
- Приложите файл `README` с описанием процесса сборки и запуска приложения.
- Отформатируйте код с помощью [prettier](https://prettier.io/). Используйте дефолтный конфиг.
- Вместе со ссылкой на репозиторий пришлите пару слов о том, с какими сложностями пришлось столкнуться в процессе работы над тестовым, а так же сколько времени вы потратили.

# Как мы оцениваем тестовое

Мы очень внимательно проверяем тестовое. Два разработчика из нашей команды делают код-ревью и выносят решение. В итоге, все сводится к этим простым критериям:

- [ ]  Код простой и легко читается
- [ ]  Все требования ТЗ выполнены
- [ ]  Нет багов