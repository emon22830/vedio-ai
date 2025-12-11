import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import {NextRequest, NextResponse} from "next/server";

export async  function POST(request:NextRequest){
    try {
       const {email, password} = await request.json();
       if(!email || !password){
        return NextResponse.json(
            {error: "Email and password are required"},
            {status:400}
        )
       }
       await connectToDatabase()
       const existingUser = await User.findOne({email})
       if(existingUser){
        return NextResponse.json(
            {error: "User already requested"},
            {status:400}
        )
       }

       await User.create({
        email,
        password
       })

      
    } catch (error) {
        console.error("Registration error", error)
         return NextResponse.json(
        {message:"Failed to register"},
        {status: 400}
       );
    }
}