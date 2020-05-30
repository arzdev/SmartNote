class RoomManager{
  constructor(){
    this.rooms = {}
  }

  add_room(room_name){
    this.rooms[room_name] = {}//empty json room
    this.rooms[room_name]["users"] = []
    this.rooms[room_name]["size"] = 0
    return this.rooms[room_name]
  }

  get_room(room_name){
    return this.rooms[room_name]
  }
  
  room_exists(room_name){
    return room_name in this.rooms
  }

  add_user(room_name, user){
    let room;
    if(!this.room_exists(room_name)){
      room = this.add_room(room_name)
    }
    else{
      room = this.get_room(room_name);
    }
    room["users"].push(user)
    room["size"] += 1
  }
}
module.exports = RoomManager
