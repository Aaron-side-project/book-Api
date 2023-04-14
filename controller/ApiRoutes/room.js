const Controller = require('../controller')
const Room = require('../../models/Room.js');
const Hotel = require('../../models/Hotel.js');
const verify = require('../../lib/JWT_Token');

let app;

class RoomController extends Controller {
    constructor(_app) {
      super(_app);
      app = _app;
    }

    /**
     * @inheritdoc
     */
    routes() {
      return [
        //創建第一個room
        ['post', '/v1/room/:hotelId', this.createRoom, verify.verifyAdmin],
        //更改room updatedRoom
        ['put', '/v1/room/:id', this.updatedRoom, verify.verifyAdmin],
        //刪除room
        ['delete', '/v1/room/:hotelId/:id', this.deleteRoom, verify.verifyAdmin],
        //讀取單筆room 資料 不用hotelId
        //是因為會多此一舉roomId來抓
        ['get', '/v1/room/:id', this.getRoom],
        //抓取rooms所有資料
        ['get', '/v1/room', this.getAllRooms],
        //抓取一個hotel 的rooms所有資料
        ['get', '/v1/room/findHotel/:hotelId', this.getHotelRooms],
      ];
    }

    async createRoom(ctx) {
        const hotelId = ctx.params.hotelId;
        const newRoom = new Room(ctx.request.body);

        try {
            const saveRoom = await newRoom.save();

            try {
                await Hotel.findByIdAndUpdate(hotelId,
                    {$push: { rooms: saveRoom._id}})
            } catch (error) {
                ctx.status = 400;
                ctx.body = {
                    result: 'error',
                };
            }

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: saveRoom,
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    };

    async getRoom(ctx) {
        const id = ctx.params.id;

        try {
            const getRoom = await Room.findById(id)

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: getRoom,
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    };

    async getHotelRooms(ctx) {
        const getHotel = ctx.params.hotelId;

        try {
            const hotelData = await Hotel.findById(getHotel);

            try {
                const roomList = await Promise.all(hotelData.rooms.map((roomId) => {
                    return Room.findById(roomId);
                }))

                ctx.status = 200;
                ctx.body = {
                    result: 'ok',
                    ret: roomList,
                };

            } catch (error) {
                ctx.status = 400;
                ctx.body = {
                    result: 'error',
                };
            }
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    };


    async getAllRooms (ctx) {
        try{
            const roomsList = await Room.find();

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: roomsList,
            };
        }catch(error){
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    }

    async updatedRoom (ctx) {
        const roomId = ctx.params.id;

        try {
            const upDataRoom = await Room.findByIdAndUpdate(roomId, { $set: ctx.request.body}, { new: true } );

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: upDataRoom,
            }
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    }

    async deleteRoom (ctx) {
        const roomId = ctx.params.id;
        const hotelId = ctx.params.hotelId;


        try {
            await Room.findByIdAndDelete(roomId);

            try {
                await Hotel.findByIdAndUpdate(hotelId, {$pull: { rooms: roomId }});

            } catch {
                ctx.status = 400;
                ctx.body = {
                    result: 'error',
                };
            }

            ctx.status = 200;
            ctx.body = {
                result: 'ok',
                ret: "刪除資料成功",
            };
        } catch {
            ctx.status = 400;
            ctx.body = {
                result: 'error',
            };
        }
    }

};

module.exports = RoomController;
