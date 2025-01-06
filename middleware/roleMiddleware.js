import jwt from "jsonwebtoken";
const requireRole = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token----------:", token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded----", decoded); // Add this line to see the decoded token
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({
          message:
            "You are a user, not able to access this route. Only admins are allowed.",
        });
      }

      req.user = decoded; // Attach user info to request
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};
export default requireRole;
