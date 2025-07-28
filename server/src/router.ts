import express from "express";
import authAction from "./modules/auth/auth.action";
import userAction from "./modules/user/userAction";

const router = express.Router();

// User Action Routes
router.get("/user", userAction.browse);
router.get("/user/:id([0-9]+)", userAction.read);
router.post("/user", userAction.add);
router.put("/user/:id", userAction.edit);
router.delete("/user/:id", userAction.destroy);
router.delete("/waiting-user/:id", userAction.deleteWaitingUser);
router.get("/waiting-list", userAction.getWaitingList);
router.get("/waiting-list-info", userAction.getWaitingListInfo);

//auth Action routes
router.post("/auth/signin", authAction.signIn);
router.post("/auth/signup", authAction.signUp);
router.post("/auth/ask-access", authAction.askAcess);

export default router;
