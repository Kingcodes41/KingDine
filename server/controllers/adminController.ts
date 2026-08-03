import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { Restaurant } from "../models/Restaurant.js";
import { User } from "../models/User.js";
import { Booking } from "../models/Booking.js";



// Get all restaurant for admin management 
// GET/api/admin/restaurants




export const getAllRestaurants= async(req:AuthRequest, res:Response):Promise<void>=>{
    try {
        const restaurant=await Restaurant.find({}).populate("owner","name email phone").sort({createdAt:-1})
        res.json(restaurant)

        
    } catch (error:any) {
        console.log(error);
        res.status(400).json({message:error.message});
        
        
    }


}

// Approve/reject a restaurant profile
// PUT/api/admin/restaurants/:id/approve

export const approveRestaurants= async(req:AuthRequest, res:Response):Promise<void>=>{
    try {
        const {status}=req.body;
        if(!status||!["approved","rejected","pending"].includes(status)){
            res.status(400).json({message:"Please provide a valid  approval status"});
            return;
        

}
const restaurant=await Restaurant.findById(req.params.id);
if(!restaurant){
    res.status(404).json({message:"Restaurant profile not found"});
    return;
}

restaurant.status=status;
await restaurant.save();
res.json(restaurant);


        
    } catch (error:any) {
        console.log(error);
        res.status(400).json({message:error.message});
        
        
    }


}

// Get system statistics
// GET/api/admin/restaurants/:id/approve

export const getAdminStats= async(req:AuthRequest, res:Response):Promise<void>=>{
    try {
        const totalUsers=await User.countDocuments({role:"user"});
        const totalOwners=await User.countDocuments({role:"owner"});
        const totalBooking=await Booking.countDocuments({});
        const totalRestaurants=await Restaurant.countDocuments({});
    
        // Get latest 10 bookings
        const latestBookings=await Booking.find({}).populate("user","name email phone").populate("restaurant","name").sort({createdAt:-1}).limit(10);
        res.json({User:{
            totalUsers,totalOwners,
            total:totalUsers + totalOwners,
        },
        restaurant:{
            total:totalRestaurants,
        },
        booking:{
            total:totalBooking,
        
        },
        latestBookings

        })
        

        
        
        
    } catch (error:any) {
        console.log(error);
        res.status(400).json({message:error.message});
        
        
    }


}