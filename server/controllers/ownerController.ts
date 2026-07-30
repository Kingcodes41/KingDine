

import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { Restaurant } from "../models/Restaurant.js";
import{v2 as cloudinary}from "cloudinary"
import { Booking } from "../models/Booking.js";

// Helper function to upload buffer to cloudinary

const uploadToCloudinary=(fileBuffer:Buffer):Promise<{secure_url:string}>=>{

    return new Promise((resolve,reject)=>{

        const stream=cloudinary.uploader.upload_stream({folder:"kingDine"},(error,result)=>{
            if(error) return reject(error);
            if(!result)return reject(new Error("Upload failed"));
            resolve({secure_url:result.secure_url})
        })

        stream.end(fileBuffer)
    })
}

    






// Get owners restaurant
// GET/api/restaurant/restaurant


export const getOwnersRestaurant= async (req: AuthRequest, res:Response):Promise<void>=>{
    try{
        const restaurant=await Restaurant.findOne({owner:req.user?._id})
        if(!restaurant){
            res.status(200).json(null);
            return;
        }
        res.json(restaurant);





    }
    catch(error:any){
        console.log(error);
        res.status(400).json({message:error.message});
        
        
    }
}

// Get owners restaurant (submitted to pending)
// POST/api/restaurant/restaurant


export const createOwnersRestaurant= async (req: AuthRequest, res:Response):Promise<void>=>{
    try{

        const existing=await Restaurant.findOne({owner:req.user?._id});
         if (existing){
            res.status(400).json({message:"You already have a restaurant registered"})
            return;
           
         }
         const{name,description,cuisine,priceRange,location,address,image,chef,tags,availableSlots,totalSeats}=req.body;

         if(!name||!description||!cuisine||!priceRange||!location||!address||!chef){
            res.status(400).json({message:"Please provide all required restaurant details"});
            return;

         }

        //  Generate slug from 

        const slug=name.toLowerCase().replace(/[^a-z0-9]/g,"-").replace(/(^-|-$)+/g,"");


        const slugExists=await Restaurant.findOne({slug});
       
        if(slugExists){
            res.status(400).json({message:"A restaurant with this name already exists"});
            return;

        }


        // 


// Handle image


let imageUrl="";
if(req.file){

    const result=await uploadToCloudinary(req.file.buffer);
    imageUrl=result.secure_url;
    
    





    }


    // setup parsed tags and slots
    const parsedTags=typeof tags==="string"?tags.split(",").map((t)=>t.trim()):tags||[];
    const parsedSlots=typeof availableSlots==="string"?availableSlots.split(",").map((s)=>s.trim()):availableSlots||["17:00","18:00","19:00","20:00","21:00"];

    const restaurant=await Restaurant.create({
        name,
        slug,
        description,
        cuisine,
        priceRange,
        location,
        address,
        image:imageUrl,
        chef,
        tags:parsedTags,
        availableSlots:parsedSlots,
        totalSeats:totalSeats||20,
        owner:req.user?._id,
        status:"pending"
    })
    res.status(201).json(restaurant);}



    
    
    catch(error:any){
        console.log(error);
        res.status(400).json({message:error.message});
        
        
    }
}

// Update owners restaurant 
// PUT/api/restaurant/restaurant


export const updateOwnerRestaurant= async (req: AuthRequest, res:Response):Promise<void>=>{
    try{

        const restaurant=await Restaurant.findOne({owner:req.user?._id});
        if(!restaurant){
            res.status(404).json({message:"Restaurant profile not found"});
            return;}

            const{name,description,cuisine,priceRange,location,address,chef,tags,availableSlots,totalSeats}=req.body;

            if(name) restaurant.name=name;
            if(description) restaurant.description=description;
            if(cuisine) restaurant.cuisine=cuisine;
            if(priceRange) restaurant.priceRange=priceRange;
            if(location) restaurant.location=location;
            if(address) restaurant.address=address;
            if(chef) restaurant.chef=chef;
            
            
            if(totalSeats) restaurant.totalSeats=totalSeats;
            if (tags) {
                restaurant.tags = typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags;
            }
            if (availableSlots) {
                restaurant.availableSlots = typeof availableSlots === "string" ? availableSlots.split(",").map((s) => s.trim()) : availableSlots;
            }

            // Handle image update
            
if(req.file){

    const result=await uploadToCloudinary(req.file.buffer);
restaurant.image=result.secure_url;
    
    





    }
    const updated=await restaurant.save();
    res.json(updated);

            
        
    }
    catch(error:any){
        console.log(error);
        res.status(400).json({message:error.message});
        
        
    }
}

// Get Bookings for owner's Restaurant
// GET/api/owner/booking


export const getOwnerBookings= async (req: AuthRequest, res:Response):Promise<void>=>{
    try{
        const restaurant=await Restaurant.findOne({owner:req.user?._id});

        if(!restaurant){
            res.status(404).json({message:"Restaurant profile not found"});
            return;
        }

        const bookings=await Booking.find({restaurant:restaurant._id}).populate("user","name email phone").sort({date:1,time:-1});
        res.json(bookings);
        




    }
    catch(error:any){
        console.log(error);
        res.status(400).json({message:error.message});
        
        
    }
}

// Update status of booking
// PUT/api/owner/booking/:id/status


export const updateBookingStatus= async (req: AuthRequest, res:Response):Promise<void>=>{
    try{
        const { status } = req.body;
        if(!status || !["confirmed","cancelled","completed"].includes(status)) {
            res.status(400).json({message:"please enter a valid booking status"});
            return;

        }

        const booking=await Booking.findById(req.params.id);
        if(!booking){
            res.status(404).json({message:"Booking not found"});
            return;
        }

        // verify booking belong to Owner's restaurant

        const restaurant=await Restaurant.findById(booking.restaurant);
        if(!restaurant||restaurant.owner.toString()!==req.user?._id.toString()){
            res.status(404).json({message:"Not authorized to manage this booking"});
            return;
        }

        booking.status=status;
        await booking.save();
        res.json(booking);
        













    }
    catch(error:any){
        console.log(error);
        res.status(400).json({message:error.message});
        
        
    }
}