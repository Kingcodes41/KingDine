import{NextFunction,Request,Response} from 'express'
import  {User, IUser } from "../models/User.js"
import jwt from 'jsonwebtoken';



export interface AuthRequest extends Request {

    user?:IUser;

}

export const protect= async (req :AuthRequest ,res :Response,next:NextFunction):Promise<void> => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            // Get token from header
            token=req.headers.authorization.split(" ")[1]
            // Verify token
            const decoded=jwt.verify(token,process.env.JWT_SECRET as string)

        //    Get user from the token, exclude password
        const user=await User.findById((decoded as any).id).select("-password")
        if(!user){
            res.status(401).json({message:"Not authorized,ser not found"})
            return;



            }req.user=user;
            next();
    
}catch(error){
    console.log("Auth Middleware Error:", error);
    res.status(401).json({message:"Not authorized,token failed"})
    return;
}
}
if(!token){
    res.status(401).json({message:"Not authorized,no token"})
    return;
}
    }

    export const ownerOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(401).json({ message: "Access denied, not authorized" });
    }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && (req.user.role === "owner" || req.user.role === "admin")) {
        next();
    } else {
        res.status(401).json({ message: "Access denied, restaurant owner role required" });
    }
};
    



