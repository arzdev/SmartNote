class RoomManager{
  constructor(){
    this.rooms = {}
  }

  add_room(room_name){
    if(this.room_exists(room_name)){
      return this.rooms[room_name]
    }
    this.rooms[room_name] = {}//empty json room
    this.rooms[room_name]["users"] = []
    this.rooms[room_name]["size"] = 0
    this.rooms[room_name]["history"] = []
    return this.rooms[room_name]
  }

  get_room(room_name){
    return this.rooms[room_name]
  }

  get_history(room_name){
    return this.get_room(room_name)["history"]
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
    console.log(room)
    room["size"] += 1
  }

  push_stroke(room_name, stroke){
    this.get_history(room_name).push({"stroke": stroke})
  }

  get_host_socket(room_name){
    console.log('sockets in room: ' + this.rooms[room_name]["users"])
    return this.rooms[room_name]["users"][0]
  }
}

class Singleton{
  constructor(){
    if (!Singleton.instance) {
        Singleton.instance = new RoomManager();
    }    
  }

  getInstance(){
    return Singleton.instance
  }
}

module.exports = Singleton 
