import userModel from "../models/user.model.js";

export class LoginManagerMongo {
    constructor(){
        this.model = userModel;
    }

    async byId(id) {
        const user = await this.model.findById(id);
        return user;
    }

    async byEmail(email) {
        const user = await this.model.findOne({ email });
        if (!user) {
            throw new Error("El usuario no existe");
        } 
        return user;
    }

    async newUser(userData) {
        const newUser = await this.model.create(userData);
        return newUser;
    }
}