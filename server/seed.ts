import { log } from "console";
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/User.js";
import { Restaurant } from "./models/Restaurant.js";
import { Booking } from "./models/Booking.js";


const MONGO_URI=process.env.DATABASE_URI ||"mongodb://127.0.0.1:27017/king-dine";



const seedData=async()=>{
    try{
        console.log("Connecting to database for seeding...")
        

        await mongoose.connect(MONGO_URI)

        console.log("Database connected. Clearing existing collecting...");



        await User.deleteMany({})
        await Restaurant.deleteMany({})
        await Booking.deleteMany({})


        console.log("Creating default users...");


        const salt=await bcrypt.genSalt(10);
        const adminPassword=await bcrypt.hash("Chubiojo@41",salt);
        const userPassword=await bcrypt.hash("user123",salt);
        const ownerPassword=await bcrypt.hash("owner123",salt);

    //   Admin

    const adminUser=await User.create({
        name:"Abimaje Gideon",
        email:"abimajegideonchubiojo@gmail.com",
        phone:"+2349151019945",
        password:adminPassword,
        role:"admin"
    })


    // User

     const testUser=await User.create({
        name:"Test User",
        email:"user@example.com",
        phone:"+1234567890",
        password:userPassword,
        role:"user"});
    


        // Owner

        const ownerUser=await User.create({
        name:"Restaurant Owner",
        email:"owner@example.com",
        phone:"+0987654321",
        password:ownerPassword,
        role:"owner",});




        console.log("Creating restaurants....");
        
        const  restaurantData = [
    {
        
        name: "RSVP Lagos",
        slug: "oja-lagos",
        description:
            "A contemporary celebration of Nigerian cuisine in the heart of Lekki Phase 1. Oja Lagos blends bold West African flavors with elegant presentation and warm hospitality, offering a vibrant dining experience centered on fresh seafood, classic suya, and signature jollof rice.",
        cuisine: "West African",
        priceRange: "$$$",
        rating: 4.9,
        reviewCount: 88,
        location: "Lekki, Lagos",
        address: "35 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
        image: "/restaurant_5.png",
        chef: "Adaobi Okafor",
        tags: ["Nigerian", "Modern African", "Seafood", "Signature Jollof"],
        availableSlots: ["18:00", "19:00", "20:00", "21:00", "22:00"],
        featured: true,
        exclusive: false,
    },
    {
        
        name: "Tar Tar",
        slug: "the-burgundry",
        description:
            "An elegant modern French dining destination from Chef Stone. The Burgundry blends refined Burgundy-inspired cuisine with luxurious presentation and a warm, intimate atmosphere, highlighting premium local ingredients and sophisticated wine pairings.",
        cuisine: "Contemporary French",
        priceRange: "$$$$",
        rating: 4.7,
        reviewCount: 205,
        location: "Wuse 2, Abuja",
        address: "Central Area, Abuja, Nigeria",
        image: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnywk-Nn65nrFearAljkv0_pEtezhZURXO89pAU1_6XStjf6pxNkl8p9DyXKMeFJxFoJKrhacKIJRUqnuBaUcGmtFsBPBEXFxEF0b6KPIOeCuJxkUoJqc4Fgi9MfwC51o2ogMw2pA=s1360-w1360-h1020-rw",
        chef: "Chef Stone",
        tags: ["French", "Fine Dining", "Wine Pairing", "Chef's Tasting"],
        availableSlots: ["12:00", "13:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
        featured: true,
        exclusive: false,
    },
    {
        name: "CILANTRO ABUJA",
        slug: "cilantro-abuja",
        description:
            "A luxurious fusion of international fine dining and Nigerian hospitality. CILANTRO ABUJA showcases Chef Stone's signature tasting menu in a sleek, modern space located in the heart of Maitama, Abuja.",
        cuisine: "Contemporary International",
        priceRange: "$$$$",
        rating: 4.8,
        reviewCount: 92,
        location: "Maitama, Abuja",
        address: "Maitama, Abuja, Nigeria",
        image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/6d/9f/e3/nature-and-fine-dining.jpg?w=1100&h=-1&s=1",
        chef: "Chef Stone",
        tags: ["Fine Dining", "Signature Tasting", "Modern Elegance", "Global Flavors"],
        availableSlots: ["18:00", "20:30"],
        featured: true,
        exclusive: true,
    },
    {
       
        name: "Above Lifestyle",
        slug: "above-lifestyle",
        description:
            "Above Lifestyle brings a luxury lounge and dining experience to Lekki, combining modern continental plates with relaxed coastal vibes. Expect elevated small plates, signature cocktails, and panoramic views.",
        cuisine: "Contemporary",
        priceRange: "$$$",
        rating: 4.8,
        reviewCount: 110,
        location: "Lekki, Lagos",
        address: "Lekki, Lagos, Nigeria",
        image: "https://abovelifestyle.com/lekki/wp-content/uploads/2025/03/Untitled-design-69.jpg",
        chef: "Executive Chef",
        tags: ["Lounge", "Contemporary", "Coastal", "Cocktails"],
        availableSlots: ["11:30", "13:00", "14:30", "17:30", "19:00", "20:30"],
        featured: false,
        exclusive: false,
    },
    {
        
        name: "Kapadoccia aka The Cave",
        slug: "kapadoccia-the-cave",
        description:
            "Kapadoccia aka The Cave offers an immersive dining experience inspired by Anatolian cave restaurants — now reimagined for FCT Abuja with rustic stone interiors, charcoal-fired specialties, and intimate private dining caves.",
        cuisine: "Mediterranean",
        priceRange: "$$$$",
        rating: 4.6,
        reviewCount: 142,
        location: "FCT Abuja",
        address: "FCT Abuja, Nigeria",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/2a/52/ad/67/inside-kapadoccia-aka.jpg",
        chef: "Executive Chef",
        tags: ["Charcoal Grill", "Cave Dining", "Mediterranean", "Private Dining"],
        availableSlots: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
        featured: false,
        exclusive: false,
    },
    {
       
        name: "SEE",
        slug: "see",
        description:
            "SEE brings contemporary Japanese dining to the city with refined omakase courses, seasonal ingredients, and an elegant, minimal dining room.",
        cuisine: "Japanese",
        priceRange: "$$$$",
        rating: 4.9,
        reviewCount: 124,
        location: "Lagos, Nigeria",
        address: "Lagos, Nigeria",
        image: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkThE-DutGs9T-at8vwzzMIOSKy6jNUg0tdC3FPJofJL3ILmTyGgSC6KkTlTROYk_YQNfs-isX1WtQX9soyKIEl5OwA6BKUVvh2xX5fNLzrlpsrxKwM27CwZR9oN5ZHADm50ACY=s1360-w1360-h1020-rw",
        chef: "Executive Chef",
        tags: ["Omakase", "Japanese", "Fine Dining", "Seasonal"],
        availableSlots: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"],
        featured: true,
        exclusive: true,
    },
    {
        
        name: "Walis Suites",
        slug: "walis-suites",
        description:
            "Walis Suites offers refined hotel dining on Monrovia Street, Abuja — combining elegant continental dishes with attentive service in a sophisticated suite-style setting.",
        cuisine: "Contemporary",
        priceRange: "$$$",
        rating: 4.9,
        reviewCount: 88,
        location: "Monrovia St, Abuja",
        address: "Monrovia Street, Abuja, Nigeria",
        image: "https://q-xx.bstatic.com/xdata/images/hotel/840x460/424067517.jpg?k=cb4a589dc8ad1e4123425c9c1dd9832a127483b9321e0f67b4e235c8f352969e&o=&a=1925256",
        chef: "Executive Chef",
        tags: ["Hotel Dining", "Continental", "Suites", "Fine Service"],
        availableSlots: ["18:00", "19:00", "20:00", "21:00", "22:00"],
        featured: true,
        exclusive: false,
    },
];


console.log("Inserting Restaurant...");
const restaurantsToCreate = restaurantData.map((rest) => ({
    ...rest,
    owner: ownerUser._id,
    status: "approved",
    totalSeats: Math.floor(Math.random() * 31) + 20, // Random seats between 20-50
}));

await Restaurant.insertMany(restaurantsToCreate);
console.log(`${restaurantsToCreate.length} restaurants created successfully.`);


await mongoose.disconnect();
console.log("Disconnect from database.");







        


        

    }catch(error){
        console.log("seeding failed",error);
        await mongoose.disconnect();
        process.exit(1);
    
    }

        
}

seedData();