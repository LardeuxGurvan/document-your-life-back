const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
const router = require('./routes');

const app = express();
// app.use(cookieParser());
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors(process.env.CORS_DOMAINS ?? '*'));

// const sess = {
//     secret: process.env.SESSION_PASSWORD,
//     cookie: {},
// };

// if (app.get('env') === 'production') {
//     app.set('trust proxy', 1); // trust first proxy
//     sess.cookie.secure = true; // serve secure cookies
// }

// app.use(session(sess));

// app.use((request, response, next) => {
//     console.log('local utilisateur : ', response.locals);
//     response.locals.connectedUser = request.session.connectedUser;

//     next();
// });

app.use(router);

module.exports = app;
