import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/usermodel.js';  
import 'dotenv/config';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
  console.log("Incoming body:", req.body); 
  const { name, email, password } = req.body;


    if(!name || !email || !password){
        return res.json({success: false , message: "missing"})
    } 
    try {
        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.json({success: false , message: "user exist"});
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new userModel({name , email , password: hashPassword})
        await user.save();

        const token = jwt.sign({id: user._id} , process.env.JWT_SECRET , {expiresIn: '7d'});

        res.cookie('token' , token ,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
             
        const mailOption= {
            from : process.env.EMAIL_USER,
            to : email,
            subject: 'welcome to crypto',
            text : `welcome you account has been created with ${email} `
        } 
        await transporter.sendMail(mailOption);
        return res.json({success: true});
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const login = async (req ,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.json({success: false , message: "email and password is required"})
    }
    try{
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: 'invalid email'})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({success: false, message: 'invalid password'})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        return res.json({success: true});

    } catch (error){
        return res.json({success: false, message: error.message});
    }
}

export const logout = async (req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        }) 

        return res.json({success: true, message: "logged out"})
    } catch (error){
        return res.json({success: false, message: error.message});
    }
}

export const sendVerifyOtp = async(req, res) => {
    try {

        const userId = req.user.id; // Using middleware-injected user
        
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found1"
            });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({
                success: false,
                message: "Account already verified"
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        const mailOption = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Account verification OTP',
            text: `Your OTP is ${otp}. It will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOption);

        return res.json({
  success: true,
  message: "OTP sent successfully",
  userId: user._id
});

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;
        const userId = req.user._id; // Get ID from authenticated user
        // console.log(req);
        // console.log(user.req)
 
    if (!otp) {
      return res.json({ success: false, message: "OTP is required" });
    }
    console.log("2");

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    console.log("3");

    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "OTP not valid" });
    }
    console.log("4");

    if (user.verifyOtpAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }
    console.log("5");

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async(req, res) => {
      try {
          
            if (!req.user) {
                return res.json({ success: false, message: "Not authenticated" });
            }
            return res.json({ 
                success: true,
                user: {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email
                }
            });
      } catch(error) {
            res.json({ success: false, message: error.message });
      }
}

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const mailOption = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your reset OTP is ${otp}. It will expire in 15 minutes.`,
    };

    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: "Reset OTP sent" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }
  try {
    // Use .trim().toLowerCase() for email comparison
    const user = await userModel.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Password has been reset" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
