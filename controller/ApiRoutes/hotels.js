const Controller = require('../controller')
const Hotel = require('../../models/Hotel.js');
const verify = require('../../lib/JWT_Token');

// const router = new Router()

// router.post('/api/v1/hotels', addHotels);
let app;

class HotelsController extends Controller {
    constructor(_app) {
      super(_app);
      app = _app;
    }

    /**
     * @inheritdoc
     */
    routes() {
      return [
        ['post', '/v1/hotels', this.addHotels, verify.verifyAdmin],
        ['get', '/v1/hotels/find/:id', this.findHotels],
        ['put', '/v1/hotels/:id', this.editHotels],
        ['delete', '/v1/hotels/:id', this.deleteHotels, verify.verifyAdmin],
        ['get', '/v1/hotels', this.getHotels],
        ['get', '/v1/hotels/amountoftype', this.amountOfType],
        ['get', '/v1/hotels/amountofcities', this.amountOfCities],

      ];
    }

    async addHotels(ctx) {
        const newHotel = new Hotel(ctx.request.body);

        try {
            const saveHotel = await newHotel.save();

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: saveHotel,
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    };

    async findHotels(ctx) {
        const id = ctx.params.id;

        try {
           const getHotel = await Hotel.findById(id);

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: getHotel,
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    };

    async editHotels (ctx) {
        const id = ctx.params.id;
        const body = ctx.request.body

        try {
            const updatedHotel = await Hotel.findByIdAndUpdate(id, {$set:body}, {new:true});

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: updatedHotel,
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            }
        }
    }

    async deleteHotels (ctx) {
        const id = ctx.params.id;

        try {
            await Hotel.findByIdAndDelete(id);

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: "刪除資料成功",
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                result: 'error',
                ret: "刪除資料失敗",
            }
        }
    }

    async getHotels (ctx) {
        const { city } = ctx.request.query;

        let query = {};

        if (city) {
            query = {
                ...query,
                city,
            }
        }

        try{
            const hotelsList = await Hotel.find({ ...query }).limit(7);

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: hotelsList,
            };
        }catch(error){
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            }
        }
    }

    async amountOfType(ctx) {
        const { type } = ctx.request.query;

        try {
            const list = await Promise.all(type.map((type) => {
                return Hotel.countDocuments({ type:type })
            }))

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: list,
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    };

    async amountOfCities(ctx) {
        const { type } = ctx.request.query;
        // const cityList = type.split(",");

        try {
            const list = await Promise.all(type.map((city) => {
                return Hotel.countDocuments({ city:city })
            }))

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: list,
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    };
};

// const addHotels = async (ctx) => {
//     const newHotel = new Hotel(ctx.request.body);

//     try {
//         const saveHotel = await newHotel.save();

//         ctx.status = 200;
//         ctx.body = {
//             result: 'ok',
//             ret: saveHotel,
//         };
//     } catch (error) {
//         ctx.status = 500;
//     }
// };

//router.get("/api/v1/hotels/find/:id", findHotels);

// const findHotels = async (ctx) => {
//     const id = ctx.params.id;

//     try {
//        const getHotel = await Hotel.findById(id);

//         ctx.status = 200;
//         ctx.body = {
//             result: 'ok',
//             ret: getHotel,
//         };
//     } catch (error) {
//         ctx.status = 500;
//     }
// };

// router.put("/api/v1/hotels/:id", editHotels);


// const editHotels = async (ctx) => {
//     const id = ctx.params.id;
//     const body = ctx.request.body

//     try {
//         const updatedHotel = await Hotel.findByIdAndUpdate(id, {$set:body}, {new:true});

//         ctx.status = 200;
//         ctx.body = {
//             result: 'ok',
//             ret: updatedHotel,
//         };
//     } catch (error) {
//         ctx.status = 500;
//     }
// }

// router.delete("/api/v1/hotels/:id", deleteHotels)

// const deleteHotels = async(ctx) => {
//     const id = ctx.params.id;

//     try {
//         await Hotel.findByIdAndDelete(id);

//         ctx.status = 200;
//         ctx.body = {
//             result: 'ok',
//             ret: "刪除資料成功",
//         };
//     } catch (error) {
//         ctx.status = 500;
//     }
// }

// router.get("/api/v1/hotels", getHotels)

// const getHotels = async(ctx) => {
//     try{
//         const hotelsList = await Hotel.find();

//         ctx.status = 200;
//         ctx.body = {
//             result: 'ok',
//             ret: hotelsList,
//         };
//     }catch(error){
//         ctx.status = 500;
//     }
// }

module.exports = HotelsController;
