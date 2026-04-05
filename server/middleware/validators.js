import { body, validationResult } from 'express-validator';

const handleValidationErrors = async (req, res, next) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()}); 
    }
     
    next(); 
}; 

const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ max: 50 }).withMessage('Name too long'),

    body('email')
        .trim() 
        .isEmail().withMessage('invlaid email address') 
        .normalizeEmail(), 

    body('password')
        .trim() 
        .isLength({ min: 6 }).withMessage("Password must be atleast 6 characters") 
        .matches(/\d/).withMessage('Password must contain a number'), 
    
    handleValidationErrorss
]; 

const validateLogin = [
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email') 
        .normalizeEmail(), 

    body('password') 
        .notEmpty().withMessage("Password is required"), 

    handleValidationErrors
];

const validateJob = [
    body('company')
        .trim()
        .notEmpty().withMessage('Company is required')
        .isLength({ max: 100 }).withMessage("Company name too long"), 

    body('role')
        .trim() 
        .notEmpty().withMessage('Role is required') 
        .isLength({ max: 100 }).withMessage("Role is too long"), 

    body('status') 
        .optional() 
        .isIn(["Applied", "Interview", "Offer", "Rejected"]).withMessage('Invalid status'), 

    body('notes')
        .optional()
        .isLength({ max: 500 }).withMessage("Note too long"), 

    handleValidationErrors, 
]; 

const validateForgotPassword = [ 
    body('email') 
        .trim() 
        .isEmail().withMessage("Invalid email") 
        .normalizeEmail(), 
    handleValidationErrors, 
]; 

const validateResetPassword = [
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be atleast 6 chararcters')
        .matches(/\d/).withMessage('Password must contain a number'), 
    handleValidationErrors, 
]; 

const validateProfileUpdate = [
    body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('Name cannot be empty')
        .isLength({ max: 50 }).withMessage('Name too long'),
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
    body('newPassword')
        .optional()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/\d/).withMessage('Password must contain a number'),
    handleValidationErrors,
];

export { handleValidationErrors, validateForgotPassword, validateJob, validateLogin, validateRegister, validateResetPassword, validateProfileUpdate }; 