import jwt from "jsonwebtoken";

const auth = (req: any, res: any, next: any) => {
  console.log("reqw", req.params, req.header("Authorization"));
  const token = req.header("Authorization")?.split(" ")[1]; // 'Bearer Token'

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "secretKey");

    //@ts-ignore
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
export default auth;
