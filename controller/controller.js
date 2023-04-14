const EventEmitter = require('events');
const qs = require('qs');
const scope = require('../lib/scope');


/**
 * 基本 Controller
 */
class Controller extends EventEmitter {
  /**
   * 初始化
   *
   * @param  {object} app Koa's Application
   * @param  {object} namespace 命名空間
   */
  constructor(app, namespace) {
    super();

    this.app = app;

    const { router } = app;
    const routes = this.routes();

    routes.forEach((route) => {
      const [method, uri, func, verify] = route;

      const wrapFunc = async (ctx) => {
        const start = new Date();
        let res;

        try {
          ctx.form = JSON.stringify(ctx.request.body); // koa-body
          ctx.files = ctx.request.files;
          ctx.query = qs.parse(ctx.search.substring(1)); // qs

          res = await (func)(ctx);
        } catch (e) {
          const time = new Date() - start;
          return ctx.app.emit('controller.onException', { error: e, time, context: ctx });
        }

        const time = new Date() - start;
        ctx.app.emit('controller.onResponse', { response: res, time, context: ctx });
      };

      const verifyFunc = async (ctx, next) => {
        if (!verify) {
          await next();
        } else {
          await verify(ctx, next);
        }
      };

      // const prev = scope(namespace);
      // console.log(prev);

      if (method === 'get') {
        router.get(uri, verifyFunc, wrapFunc);
      }

      if (method === 'put') {
        router.put(uri, verifyFunc, wrapFunc);
      }

      if (method === 'post') {
        router.post(uri, verifyFunc, wrapFunc);
      }

      if (method === 'delete' || method === 'del') {
        router.delete(uri, verifyFunc, wrapFunc);
      }

      if (method === 'all') {
        router.all(uri, verifyFunc, wrapFunc);
      }
    });
  }

  /**
   * 設定綁定的路徑
   *
   * @return {array}
   */
  routes() {
    /* istanbul ignore next */
    return [];
  }
}

module.exports = Controller;
