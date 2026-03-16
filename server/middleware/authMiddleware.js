import jwt from 'jsonwebtoken'; 

const protect = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        res.status(404).json({ error: "invalid token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        next(); 
    } catch {
        res.status(401).json({ message: "not authorized" }); 
    }
}; 

export default protect; 