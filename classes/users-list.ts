import { User } from './user';

export class UsersList {
  private list: User[] = [];

  constructor() {}

  public add(user: User) {
    this.list.push(user);
    console.log(this.list);
    return user;
  }

  public updateName(id: string, name: string) {
    for (const user of this.list) {
      if (user.id === id) {
        user.name = name;
        break;
      }
    }

    console.log('=== Updating user ===');
    console.log(this.list);
  }

  public getList() {
    return this.list.filter((user) => user.name !== 'no-name');
  }

  public getUser(id: string) {
    return this.list.find((user) => user.id === id);
  }

  public getAllUsersInRoom(room: string) {
    return this.list.filter((user) => user.room === room);
  }

  public deleteUser(id: string) {
    const userTemp = this.getUser(id);

    this.list = this.list.filter((user) => user.id !== id);

    return userTemp;
  }
}
