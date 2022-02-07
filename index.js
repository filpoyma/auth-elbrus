require('dotenv').config(); // подключаем чтение из файла .env
const redis = require('redis');
const express = require('express');
const session = require('express-session'); // библиотека для работы с сессиями// cookie-parser уже включен в express-session
const path = require('path');
const morgan = require('morgan');
const dbConnect = require('./db/dbconnect');

let RedisStore = require('connect-redis')(session);

const redisUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REDISTOGO_URL
    : process.env.REDISTOGO_URL_DEV;
    
let redisClient = redis.createClient({
  url: redisUrl,
});

// импорт роутов
const indexRouter = require('./src/routes/index.js');
const authRouter = require('./src/routes/auth.js');
const privateRouter = require('./src/routes/private.js');

// импорт миделваре функций  и контроллеров
const userMiddleware = require('./middlewares/user.js');
const notFoundPage = require('./controllers/notfound404.js');
const errorPage = require('./controllers/error.js');

const app = express();

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'hbs');

app.use(express.static('public')); // middlewares
app.use(express.json());
app.use(morgan('dev'));

dbConnect();

// записывает переменную req.session.user,  данные из session storage, относящиеся к прилетевшей куке.
//  если куки нету или она не найдена в session storage - req.session.user -> unfefined
app.use(
  session({
    name: 'sid', // название куки
//     store: new RedisStore({ client: redisClient }),
    secret: process.env.COOKIE_SECRET, // ключ для шифрования cookies // require('crypto').randomBytes(10).toString('hex')
    resave: false, // Если true,  пересохраняет сессию, даже если она не поменялась
    saveUninitialized: false, // Если false, куки появляются только при установке req.session
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 10, // время жизни cookies, ms (10 дней)
    },
  })
);

//  сохраняем в обьект res.locals.username имя пользователя для использования username в hbs
// app.use(userMiddleware);

// app.use((req, res, next) => {
//   req.session.user = {name: 'aaa'}
//   next()
// })

app.use((req, res, next) => {
  res.locals.username = req.session?.user?.name;

  console.log('\n\x1b[33m', 'req.session.user :', req.session.user);
  console.log('\x1b[35m', 'res.locals.username:', res.locals.username);
  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/private', privateRouter);

// союда программа дойдет, если не сработает ни один роут.
app.use(notFoundPage);

// ф-я errorPage выполниться, если в каком-то роуте,
// вызовется ф-я next('some_error_message') с аргументом
app.use(errorPage);

const port = process.env.PORT ?? 3100;
app.listen(port, () => {
  console.log('Сервер запущен. http://localhost:%s', port);
});
