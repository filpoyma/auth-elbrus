const bcrypt = require('bcrypt');
const { User } = require('../db/models');

exports.isValid = (req, res, next) => {
  const { name, password, email } = req.body;
  if(name && password && email) next();
  return;
};

exports.createUserAndSession = async (req, res, next) => {
  const { name, password, email } = req.body;
  try {
    // Мы не храним пароль в БД, только его хэш
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      password: hashedPassword,
      email,
    });
console.log('user %s created', user.name);
    // записываем в req.session.user данные (id & name) (создаем сессию)
  req.session.user = serializeUser(user); // req.session.user -> id, name
  res.cookie("sid", JSON.stringify(serializeUser(user)), {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
  });
  } catch (err) {
    console.error('Err message:', err.message);
    console.error('Err code', err.code);
    return failAuth(res, err.message);
  }

  res.status(200).end(); // ответ 200 + отправка cookies в заголовке клиенту
};

exports.checkUserAndCreateSession = async (req, res, next) => {
  const { name, password } = req.body;
  try {
    // Пытаемся сначала найти пользователя в БД
    const user = await User.findOne({ where: { name: name }, raw: true });
    if (!user) return failAuth(res, ' Неправильное имя/пароль');

    // Сравниваем хэш в БД с хэшем введённого пароля
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return failAuth(res, ' Неправильное имя\\пароль');

    req.session.user = serializeUser(user); // записываем в req.session.user данные (id & name) (создаем сессию)

  } catch (err) {
    console.error('Err message:', err.message);
    console.error('Err code', err.code);
    return failAuth(res, err.message);
  }
  res.status(200).end(); // ответ 200 + отправка cookies в заголовке клиенту
};

exports.destroySession = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('sid');
    res.redirect('/');
  });
}

exports.renderSignInForm = (req, res) => res.render('signin', { isSignin: true });
exports.renderSignUpForm = (req, res) => res.render('signup', { isSignup: true });

/**
 * Завершает запрос с ошибкой аутентификации
 * @param {object} res Ответ express
 * @param err  сообщение об ошибке
 */
function failAuth(res, err) {
  return res.status(401).json({err: err});
}

/**
 * Подготавливает пользователя для записи в сессию
 * Мы не хотим хранить пароль в сессии, поэтому извлекаем только нужные данные
 * @param {object} user Объект пользователя из БД
 */
function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
  };
}
