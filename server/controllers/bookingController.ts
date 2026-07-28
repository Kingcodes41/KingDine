import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { Restaurant } from "../models/Restaurant.js";
import { Booking } from "../models/Booking.js";



// Create a new booking
// POST/api/booking
// @access private
export const createBooking= async (req:AuthRequest, res:Response):Promise<void>=>{
    try {
        const {restaurantId,date,time,guest,occasion,specialRequest}=req.body;
        if(!restaurantId||!date||!time||!guest){
            res.status(400).json({message:"Please provide all required reservation details"});
            return;
        }
        // Check if restaurant exist
        const restaurant=await Restaurant.findById(restaurantId);
        if(!restaurant){
            res.status(404).json({message:"Restaurant not found"});
            return;
        }

        // verify restaurant is approved

        if (restaurant.status !== "approved") {
            res.status(400).json({ message: "Reservation are not open for this restaurant yet" });
            return;
        }

        // verify seat availability

        const requestedGuests=Number(guest);
        const existingBooking=await Booking.find({
            restaurant:restaurantId,
            date:new Date(date),
            time,
            status:"confirmed"
        
        })

        const bookedSeats=existingBooking.reduce((sum,b)=>sum+b.guest,0)
        const totalSeats=restaurant.totalSeats||20;
        const availableSeats=totalSeats-bookedSeats;
        if(requestedGuests>availableSeats){
            res.status(400).json({
                message:`Unable to reserve. Only ${availableSeats} seats are available for this time slot`
            })

        }

        const booking=await Booking.create({
            user:req.user?._id,
            restaurant:restaurantId,
            date:new Date(date),
            time,
            guest: Number(guest),
            occasion,
            specialRequest,
            status:"confirmed"
        })
        
        // Populate restaurant info before returning

        const populatedBooking= await booking.populate("restaurant", "name location image address");

        res.status(201).json(populatedBooking);
                  
    } catch (error:any) {
        console.log(error);
        res.status(400).json({message:error.message});
        
        
    }
}

// Create a new bookings
// GET/api/booking/my
// @access private
export const getMyBooking= async (req:AuthRequest, res:Response):Promise<void>=>{
    try {
        const bookings=await Booking.find({user:req.user?._id}).populate("restaurant","name location image address slug").sort({date:1,time:-1})
        res.json(bookings);
        
    } catch (error:any) {
        console.log(error);
        res.status(400).json({message:error.message});
        
        
    }
}
// Cancel a booking
// PUT/api/booking/id/cancel
// @access private
export const cancelBooking= async (req:AuthRequest, res:Response):Promise<void>=>{
    try {

        const booking=await Booking.findById(req.params.id);
        if(!booking){
            res.status(404).json({message:"Booking not found"});
            return;
        }

        // verify user owns the booking
        if(booking.user.toString()!==req.user?._id.toString()){
            res.status(401).json({message:"You are not authorized to cancel this booking"});
            return;
        }

        booking.status="cancelled";
        await booking.save();
        const populatedBooking=await booking.populate("restaurant","name location image address ");
        res.json(populatedBooking);



        
    } catch (error:any) {
        console.log(error);
        res.status(400).json({message:error.message});
        
        
    }
}