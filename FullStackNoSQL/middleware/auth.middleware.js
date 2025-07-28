import jwt from "jsonwebtoken";
export const isLoggedIn = async (req, res, next) => {
  try {
    console.log(req.cookies);
    //check token
    let token = req.cookies?.token;
    console.log("Token Found:", token ? "YES" : "NO");
    //
    if (!token) {
      console.log("NO token");
      return res.status(401).json({
        success: false,
        message: "Authentication Failed",
      });
    }
    console.log("check the data ");

    try {
      console.log("data is  ");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decode data is:", decoded);
      req.user = decoded;
      next();
    } catch (error) {
      console.log("Auth  meddlewarre failure", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  } catch (error) {}
  
};
