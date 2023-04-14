const Controller = require('../controller')
const User = require('../../models/User.js');
const bcrypt = require('bcryptjs');
const verify = require('../../lib/JWT_Token');

let app;

class UsersController extends Controller {
    constructor(_app) {
      super(_app);
      app = _app;
    }

    /**
     * @inheritdoc
     */
    routes() {
      return [
        // 更新使用者
        ['put', '/v1/users/:id', this.updateUser, verify.verifyUser],
        // 刪除
        ['delete', '/v1/users/:id', this.deleteUser, verify.verifyUser],
        // 取得所有會員
        ['get', '/v1/users', this.getAllUsers, verify.verifyAdmin],
        // 取得單一會員
        ['get', '/v1/users/:id', this.getUser, verify.verifyUser],
      ];
    }


    async updateUser (ctx) {
        const id = ctx.params.id;
        const body = ctx.request.body

        try {
            const updatedUser = await User.findByIdAndUpdate(id, {$set:body}, {new:true});

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: updatedUser,
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    }

    async deleteUser (ctx) {
        const id = ctx.params.id;

        try {
            await User.findByIdAndDelete(id);

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: "刪除資料成功",
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    }

    async getAllUsers (ctx) {
        try{
            const usersList = await User.find();

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: usersList,
            };
        }catch(error){
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    }

    async getUser (ctx) {
        const id = ctx.params.id;
        try{
            const getUser = await User.findById(id);

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: getUser,
            };
        }catch(error){
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    }

};

module.exports = UsersController;
