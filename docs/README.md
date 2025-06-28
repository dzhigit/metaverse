# Metaverse Altyn Backend/Frontend

Интерфейс для браузерной метавселенной Altynverse, где каждый пользователь — активный майнер.

------------


🚀 Как запустить

Сперва собираем фронтенд
~/frontend 
`npm run build`


далее Express server
`npm install`
`npm run dev`

------------

Дальнейшая информация взята с шаблона. Она не актуальна. Просто для структуры

📦 Стек

    React + Vite
    TypeScript
    socket.io-client
    react-router-dom
    FingerprintJS


🌐 Возможности

    Анонимная идентификация через fingerprint
    Живой чат по socket.io
    Статистика хэшей и вычислений
    Маршруты (/, /new, и т.д.)

🧠 Идентификация

Каждый пользователь определяется по visitorId от FingerprintJS. Отпечаток не содержит персональных данных и не отправляется в сеть без вашего согласия.