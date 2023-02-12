"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>Websocket
});
let Websocket = class Websocket {
    constructor(){
        this.setGlobalSocket = (socketIo)=>{
            this.globalSocketIo = socketIo;
        };
    }
};

//# sourceMappingURL=Websocket.js.map