import User from "./User";

export let users: Array<User> = [];

export const addUser = (id: string, name: string, room: string) => {
  const newUser = new User(id, name, room);
  const userExists = users.find((u: User) => u.id === id && u.room === room);
  if (userExists) {
    return new Error(`User with name ${userExists.name} already exists.`);
  }
  const updated_users = [...users, newUser];
  users = updated_users;
  return newUser;
};

export const removeUser = (id: string) => {
  const index = users.findIndex(u => u.id === id);
  console.log("INDEX", index);
  if (index !== -1) {
    const user = users.splice(index, 1)[0];
    console.log("User to be removed: ", user);
    return user;
  }
};

export const getAvailableRooms = () => {
  const rooms = users.map(m => m.room);
  const set = [...new Set(rooms)];
  console.log(set);
  return set;
};
