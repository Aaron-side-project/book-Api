const jwt = require('jsonwebtoken');
const errorMessage = require('./errorMessage');

const JWT_Token = async (ctx, next, callBack) => {
    const token = ctx.cookies.get('token');
    if (!token) {
      ctx.status = 403;
      ctx.body = {
        result: '請登入',
      };
    } else {
      try {
        const payload = await jwt.verify(token, process.env.JWT);

        ctx.userData = payload;

        await callBack();
      } catch (err) {
        ctx.status = 401;
        ctx.body = {
          result: 'Token 驗證失敗',
        };
      }
    }
  };



const verifyUser = async (ctx, next) => {
    await JWT_Token(ctx, next, async () => { //req.params.id 是user的id
        const apiUserId = ctx.params.id
        if(ctx.userData.id == apiUserId || ctx.userData.isAdmin) {
            await next();
        } else {
            ctx.status = 403;
            ctx.body = {
                result: '只能修改個人自己的權限或是你不是管理員',
            };
        }
            // 只能修改個人自己的權限或是你不是管理員
    })
}

const verifyAdmin = async (ctx, next) => {
    await JWT_Token(ctx, next, async () => {
      if (ctx.userData.isAdmin) {
        await next();
      } else {
        ctx.status = 403;
        ctx.body = {
          result: '你沒有管理員權限',
        };
      }
    });
  };

module.exports = {
    verifyUser,
    verifyAdmin,
};
