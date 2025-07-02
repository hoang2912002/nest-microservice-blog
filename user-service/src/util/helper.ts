import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const saltRounds = 10;
export const convertPassword = async (plainPassword:string) => {
    try {
       return await bcrypt.hash(plainPassword,saltRounds)
    } catch (error) {
        console.log(error)
    }
}

export const comparePassword = async (password:string,hashPassword) => {
    try {
        return await bcrypt.compare(password, hashPassword)
    } catch (error) {
        console.log(error)
    }
}

export const checkMongoIdValid = (id:string) => {
    return !!mongoose.isValidObjectId(id)
}