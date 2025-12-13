
"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'


const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfiemPassword] = useState("");
    const router = useRouter();

    const handleSumit = async (e:React.FormEvent<HTMLFormElement>)=>{
        // console.log(email, password, confirmPassword)
        // router.push("/login");
        e.preventDefault();
        if(password !== confirmPassword){
            alert("passwords do not match");
            return;
        }
        try {
         const res  = await fetch("/api/auth/register",{
             method:"POST",
             headers:{
                "Content-Type": "application/json"
             },
             body:JSON.stringify({
                email,
                password,
             })
         })

        const data = await res.json();

        if(!res.ok){
            throw new Error(data.error || "registration failed");
        }

        console.log(data);
        router.push("/login")
        } catch (error) {
          console.error(error);
        }
    }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSumit}>
         <input
         type="email"
         placeholder='Email'
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         />

          <input
         type="password"
         placeholder='password'
         value={email}
         onChange={(e) => setPassword(e.target.value)}
         />

          <input
         type="password"
         placeholder='Confirm Password'
         value={confirmPassword}
         onChange={(e) => setConfiemPassword(e.target.value)}
         />


        
        
        
        </form> 

        <div>
          <p>ALready have an account? <a href='/login'>Login</a></p>
        </div>
    </div>
  )
}

export default RegisterPage
