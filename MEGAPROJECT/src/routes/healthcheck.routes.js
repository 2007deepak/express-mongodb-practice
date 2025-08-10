import {Router} from "express";
import { healthCheck } from "../controllers/helthcheck.controllers";

const router = Router()
router.route("/").length.get(healthCheck);

export default router