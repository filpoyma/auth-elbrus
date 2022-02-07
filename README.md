# Express Authentication Skeleton

Данный репозиторий содержит пример реализации аутентификации с помощью `express`.

Совсем не обязательно использовать все концепции, применённые здесь, при обучении.
Но в реальном проекте было бы неплохо.

Так что советуем разобраться в коде.

## Какие темы полезно разобрать

* [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
* [Constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)


 ##  Для запуска проекта



 1. npm install

 2. psql postgres
    CREATE USER admindb WITH PASSWORD 'admindb' CREATEDB CREATEROLE;

 3. Установите  redis Database  на компьютер
    sudo apt-get install redis-server -y
    service redis start
    
    MAC:
    brew update
    brew install redis
    To have launchd start redis now and restart at login:  
    brew services start redis
            
4. В database.json  в обьект production  добавьте 
        "dialectOptions": {
              "ssl": {
                "require": true,
                "rejectUnauthorized": false
              }
            }
5. В package.json добавьте:
    "engines": {
        "node": "16.x"
      },

6.  в app.use(session({
        ....
        cookie: {
              secure: false, - установите это
              ...
            },

        }))

7. в fetch добавить credentials: 'include'
  
8.  На heroku.com    
    - создайте новый application
    - создайте "Heroku Postgres" (Resourses -> Add-ons)
    - создайте "Redis To Go"  базы данных (вкладка Resourses)
    - скопируйте url`s  подключения к базам данных. занеcите из в .env
      (из  url для redis store удалите имя БД -  так нужно для "Redis To Go")
    - пропишите на Heroku все переменные окружения из .env (Settings -> Config Vars)
    - опубликуйте проект на  Heroku (через гитхаб или терминал)

9   npx sequelize db:create - создание локальной БД  
9.1 NODE_ENV="production" npx sequelize db:migrate -  миграция для удаленной БД
10. npx sequelize db:migrate -  для локальной бд

11. npm run dev - локально
12. npm run prod - продакшн
# authSkeletonCookiePostgres

//Postgres - Sequilize Problemssss
https://stackoverflow.com/questions/25000183/node-js-postgresql-error-no-pg-hba-conf-entry-for-host
https://dba.stackexchange.com/questions/83984/connect-to-postgresql-server-fatal-no-pg-hba-conf-entry-for-host
