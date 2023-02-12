import { Server } from 'socket.io';

export default class Websocket {
  public globalSocketIo: Server;

  public setGlobalSocket = (socketIo: Server) => {
    this.globalSocketIo = socketIo;
  };
}
