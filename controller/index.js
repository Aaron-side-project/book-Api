const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const compose = require('koa-compose');

class ControllerLoader {
	constructor(app) {
		this.app = app;

		const router = new Router({ prefix: '/api' });
		app.router = router;

		// 自動載入所有Controller檔案
		const paths = [
		  'ApiRoutes',
		];
		paths.forEach((p) => {
		  fs.readdirSync(`${__dirname}/${p}`)
			.map((file) => `./${p}/${file}`)
			.forEach((file) => {
			  const Controller = require(file);
			  const c = new Controller(app);
			  const mod = path.basename(file, '.js');

			  app.set(`controller.${p}.${mod}`, c);
			});
		});

		app.use(router.routes());
		app.use(router.allowedMethods());

		app.use(async (ctx) => {
		  ctx.status = 404;
		  const res = {
			result: 'error',
			msg: `No route found for ${ctx.method} ${ctx.originalUrl}` || ctx.url,
		  };

		  app.emit('controller.onResponse', { request: ctx.req, response: res, context: ctx });
		});
	}
};

module.exports = (app) => {
	new ControllerLoader(app);
};