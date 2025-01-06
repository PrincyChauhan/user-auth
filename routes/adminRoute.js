import express from "express";
import requireRole from "../middleware/roleMiddleware.js";
const AdminRouter = express.Router();

AdminRouter.get("/admin-only", requireRole(["admin"]), (req, res) => {
  res.status(200).json({ message: "Welcome Admin!" });
});

export default AdminRouter;
