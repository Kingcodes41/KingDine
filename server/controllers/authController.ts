import { Request, Response } from 'express'
import  jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middlewares/auth.js';






// Help to generate JWT token
const generateToken = (id:string)=>{
 return jwt.sign({id},process.env.JWT_SECRET as string,{expiresIn:"30d"})
}
// Register a user

// Post/api/auth/register




export const registerUser=async (req: Request , res:Response):Promise<void> => {

    try {

        const {name,email,password,phone,role}=req.body
        if(!name || !email || !password ){

            res.status(400).json({message:"All fields are required"})
            return;
        }

        // Check if user exists
        const userExists=await User.findOne({email})
        if(userExists){
            res.status(400).json({message:"User already exists"})
            return;
        }

        // Hash password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)


        // Create User
        const user=await User.create({name,email,password:hashedPassword,phone,role})

        if(user){
            res.status(201).json({

                _id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                role:user.role,
                token:generateToken(user._id.toString())
            })
        }else{
            res.status(400).json({message:"Invalid user data"})
        }



        
    } catch (error:any) {
        console.log(error);
        res.status(400).json({message:error.message})
        
    }
    
}


// Authenticate a user and get token
// Post/api/auth/login

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Login request body:", req.body);
    let { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }

    // Clean up email formatting to strip out accidental spaces
    email = email.trim().toLowerCase();

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      // Changed to 400 to match your current frontend error tracking
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Compare Password (FIXED: Added '!' check correctly)
   const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  res.status(400).json({ message: "Invalid credentials" });
  return;
    } else {
        // Success response
            res.status(200).json({
                success: true,
                token: generateToken(user._id.toString()),
                userData: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            });
    }

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
    
}

// Get user profile
// GET/api/auth/me
// @access Private


export const getMe=async (req: AuthRequest , res:Response):Promise<void> => {

    try {
        if(!req.user){
            res.status(401).json({message:"Not authorized"})
            return;
        }
        res.json(req.user)
        
    } catch (error:any) {
        console.log(error);
        res.status(400).json({message:"error,message"})
        
    }
    
}
