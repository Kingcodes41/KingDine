import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { cancelBooking, createBooking, getMyBooking } from "../controllers/bookingController.js";

const bookingRouter=Router();

bookingRouter.post("/",protect,createBooking)
bookingRouter.post("/my",protect,getMyBooking)
bookingRouter.get("/:id/cancel",protect,cancelBooking)

export default bookingRouter;