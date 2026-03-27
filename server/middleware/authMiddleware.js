import jwt from 'jsonwebtoken'; 

const protect = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: "invalid token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        next(); 
    } catch {
        return res.status(401).json({ message: "not authorized" }); 
    }
}; 

export default protect; 
