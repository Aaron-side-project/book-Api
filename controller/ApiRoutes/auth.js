const Controller = require('../controller')
const User = require('../../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


let app;

class AuthController extends Controller {
    constructor(_app, namespace) {
      super(_app, namespace);
      app = _app;
    }

    /**
     * @inheritdoc
     */
    routes() {
      return [
        // 登入
        ['post', '/v1/login', this.login],
        // 註冊
        ['post', '/v1/register', this.register],
      ];
    }

    async login(ctx) {
        const loginData = ctx.request.body;

        try {
            const userData = await User.findOne({ username: loginData.username }) || await User.findOne({ email: loginData.email });

            if(!userData) {
                ctx.body = {
                    result: 'error',
                    msg: '輸入錯帳號或密碼'
                };
            }

            const isPasswordCorrect = await bcrypt.compare(loginData.password, userData.password)

            if (!isPasswordCorrect) {
                ctx.body = {
                    result: 'error',
                    msg: '輸入錯帳號或密碼'
                };
            }

            const token = jwt.sign({ id: userData._id, isAdmin: userData.isAdmin }, process.env.JWT)

            ctx.cookies.set('token', token, { httpOnly: true })
            ctx.cookies.set('isLogin', true, { httpOnly: false })
            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: {
                    username: userData.username,
                }
            };


        } catch (error) {
            ctx.status = 400;
        }
    };

    async register(ctx) {
        const registerData = ctx.request.body;

        try {
            const checkUser = await User.findOne({ username: registerData.username }) || await User.findOne({ email: registerData.email });

            if(checkUser) {
                ctx.body = {
                    result: 'error',
                    msg: '此帳號或信箱已被註冊'
                };
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(registerData.password, salt);
            const newUser = new User({
                username: registerData.username,
                email: registerData.email,
                password: hash,
            })

            await newUser.save();

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
            };
        } catch (error) {
            ctx.status = 400;
        }
    };
};

module.exports = AuthController;
