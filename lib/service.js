/**
 * 可用服務
 */
class Service {
  /**
   * 初始化
   *
   * @param  {object} app Koa's Application
   */
  constructor(app) {
    this.initial(app);

    this.app = app;
  }

  /**
   * 初始化，對 app 進行功能擴充
   *
   * @param {Oobject} app Koa's Application
   */
  initial(app) {
    if (!('set' in app)) {
      app.set = (alias, service) => {
        app.context.service[alias] = service;
      };
    }

    app.context.service = {};
  }
}

module.exports = (app) => {
  new Service(app);
};
