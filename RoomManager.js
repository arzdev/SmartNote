class RoomManager{
  constructor(){
    this.rooms = {}
    this.socketMap = {}
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
    if(this.room_exists(room_name)){
	    return this.get_room(room_name)["history"]
    }
	return {}
  }
  
  room_exists(room_name){
    return room_name in this.rooms
  }

  remove_user(user){
    let room_name = this.socketMap[user]
    if(typeof room_name !== 'undefined'){
      let users = this.rooms[room_name]["users"]
      for(var i = users.length - 1; i >= 0; i--) {
        if(users[i] === user) {
          users.splice(i, 1);
          console.log('disconnect removed!')
        }
      }
    }
  }

  add_user(room_name, user){
    let room;
    this.socketMap[user] = room_name
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
    if(this.room_exists(room_name)){
      this.get_history(room_name).push({"stroke": stroke})
    }
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
