const Controller = require('./controller')
const Order = require('../models/Order.js');
const verify = require('../lib/JWT_Token');

let app;

class OrderController  extends Controller {
    constructor(_app,){
        super(_app);
        app = _app;
    }

    /**
     * @inheritdoc
     */
    routes() {
        return [
            ['post', '/v1/order'],
            ['get', '/v1/order/find/:id'],
            ['put', '/v1/order/:id'],
            ['delete', '/v1/order/:id'],
            ['get', '/v1/order'],
        ];
    }


}
