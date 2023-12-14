import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import user from "../../models/user";
export const JWT_SECRET = "axcdremsXvT";

class authController {

    // SignUp
    public static async signUpUser(request: any, response: any) {
        const { userName, password, email, lateFine, role } = request.body;
        try {
            // Check if the user already exists
            const existingUser = await user.findOne({ email });
            if (existingUser) {
                return response.status(400).json({
                    message: "User already exists"
                });
            }
            else {
                // userName and phone no is required fields
                if (!request.body.userName || !request.body.email) {
                    return response.status(400).send({
                        message: "Required fields are missing",
                    });
                }
                const newUser = new user({
                    userName, password, email, lateFine, role
                });
                const hash = await bcrypt.hash(password, 17);
                newUser.password = hash;

                const result = await newUser.save();
                response.status(201).json({
                    message: "User created successfully",
                    data: result,
                });
            }
        } catch (error) {
            response.status(500).json({
                message: "Internal server error"
            });
        }
    };

    // login 
    public static async login(request: any, response: any) {
        const { email, password } = request.body;
        try {
            let userData = await user.findOne({ email });
            if (!userData) {
                return response.status(400).send({
                    message: "You are not register user please signUp now",
                });
            }
            const passwordMatch = await bcrypt.compare(password, userData?.password);
            if (passwordMatch) {
                // To convert mongoose doc into plain object
                userData = userData.toObject();
                const token = jwt.sign({ _id: userData._id }, JWT_SECRET);
                (userData as any)["token"] = token;
                return response.status(200).send({
                    message: "User logged in successfully!",
                    token: token,
                });
            } else {
                return response.status(400).send({
                    message: "Invalid password please re-entered correct password",
                });
            }
        } catch (error: any) {
            response.status(500).json({
                message: "Internal server error"
            });
        }
    }
}
export default authController;