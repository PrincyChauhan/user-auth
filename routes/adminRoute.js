import express from "express";
import requireRole from "../middleware/roleMiddleware.js";
// const AdminRouter = express.Router();

// AdminRouter.get("/admin-only", requireRole(["admin"]), (req, res) => {
//   res.status(200).json({ message: "Welcome Admin!" });
// });

// let items = [];

// AdminRouter.get("/items", requireRole(["admin", "user"]), (req, res) => {
//   res.status(200).json({ message: "Items fetched successfully", items });
// });

// AdminRouter.post("/items", requireRole(["admin"]), (req, res) => {
//   const { item } = req.body;

//   if (!item) {
//     return res.status(400).json({ message: "Item is required" });
//   }

//   items.push(item);
//   res.status(201).json({ message: "Item added successfully", items });
// });

// export default AdminRouter;

import express from "express";
import requireRole from "../middleware/roleMiddleware.js";
import ItemModel from "../models/itemModels.js";

const AdminRouter = express.Router();

// Route to view items (accessible to all authenticated users)
AdminRouter.get("/items", requireRole(["admin", "user"]), async (req, res) => {
  try {
    const items = await ItemModel.find();
    res.status(200).json({ message: "Items fetched successfully", items });
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
});

// Route to add items (accessible only to admins)
AdminRouter.post("/items", requireRole(["admin"]), async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required" });
  }

  try {
    const newItem = new ItemModel({
      name,
      description,
      createdBy: req.user.id, // Extracted from the decoded token
    });

    const savedItem = await newItem.save();
    res
      .status(201)
      .json({ message: "Item added successfully", item: savedItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding item", error });
  }
});

export default AdminRouter;
