import jwt from 'jsonwebtoken'; 

export const generateToken = async (userId, res) => {
    const payload = { id: userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d", 
    }); 

    res.cookie("jwt", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7, 
    });

    return token; 
}; 