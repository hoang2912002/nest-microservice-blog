import z from "zod";

export const CreateUserSchema = z.object({
    name: z.string().trim(),
    gender: z.preprocess((val: string | number)=> {
        if (typeof val === "string") {
            val = parseInt(val, 10);
        }

        // Nếu là number -> ép về boolean
        if (typeof val === "number") {
            return val === 0; // 1 => true, 0 => false
        }
        return val
    },z.boolean()),
    email: z.string().email(),
    password: z.string().min(1),
    avatar: z.string(),
    roleId: z.string(),
    accountType: z.string(),
    isActive: z.preprocess((val) => {
        if(typeof val === 'string'){
            return val === 'on' ? true : false
        }
        return val
    },z.boolean())
})

export const UpdateUserSchema = z.object({
    _id: z.string(),
    name: z.string().trim(),
    gender: z.preprocess((val: string | number)=> {
        if (typeof val === "string") {
            const lower = val.toLowerCase().trim();
            if (lower === "true") return true;
            if (lower === "false") return false;
            const num = parseInt(val, 10);
            if (!isNaN(num)) {
            return num === 0; // 1 => true, 0 => false
            }
        }

        // Nếu là number
        if (typeof val === "number") {
            return val === 0; // 1 => true, 0 => false
        }

        // Nếu là boolean
        if (typeof val === "boolean") {
            return val;
        }
        return val
    },z.boolean()),
    email: z.string().email(),
    avatar: z.string(),
    roleId: z.string(),
    accountType: z.string(),
    isActive: z.preprocess((val) => {
        if(typeof val === 'string'){
            return val === 'on' ? true : false
        }
        return val
    },z.boolean())
})

export const DeleteUserSchema = z.object({
    _id: z.string()
})