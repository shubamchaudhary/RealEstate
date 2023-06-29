import React,{useState} from 'react'
import {AiFillEyeInvisible,AiFillEye} from 'react-icons/ai'
import OAuth from '../components/OAuth'
import {getAuth, createUserWithEmailAndPassword,updateProfile, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import { Link } from "react-router-dom";
import {db} from "../firebase"
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import {ToastContainer, toast } from 'react-toastify';

export default function SignUp() {
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:""
    })
    const {name,email,password}=formData;
    function onChange(e){
        setFormData((prevData)=>({
           ...prevData,
            [e.target.id]: e.target.value
        }))
        // console.log(formData.email);
        // console.log(formData.password);
    }

 const [showPassword,setShowPassword]=useState(false);

 const navigate=useNavigate();

 async function onSubmit(e){
   e.preventDefault();
   try {
      const auth=getAuth();
      const userCredential=await createUserWithEmailAndPassword(auth,email,password);
      updateProfile(auth.currentUser,{
         displayName:name
      })
      const user=userCredential.user;
      const formDataCopy={...formData}
      delete formDataCopy.password
      formDataCopy.timestamp=serverTimestamp()
      //pushing data to database(db)
      await setDoc(doc(db,"users",user.uid),formDataCopy)
      toast.success("congo.............id ban gyi apki")
      navigate("/")
   } catch (error) {
     toast.error("Something went wrong. filled all options?")
   }
 }

  return (<section> 
     <h1 className='text-3xl text-center mt-6  cursive'>Sign Up</h1>
     <div className='flex flex-wrap justify-center items-center px-6 py-[130px] max-w-10xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img className='rounded-2xl w-full' src="http://www.technocrazed.com/wp-content/uploads/2015/12/Home-Wallpaper-32.jpg" alt="" />
        </div>
        <div className='w-[100%] lg:w-[40%] md:w-[67%] lg:ml-20'>
          <form  onSubmit={onSubmit}>
            <div className='relative mb-6'>
            <input onChange={onChange} 
                    id='name' 
                    placeholder='Full Name' 
                    className='w-full text-xl text-gray-700 bg-gray-100 rounded-lg mb-6' 
                    type='text'
                     >
            </input>
            <input onChange={onChange} 
                    id='email' 
                    placeholder='Email address' 
                    className='w-full text-xl text-gray-700 bg-gray-100 rounded-lg mb-6' 
                    type='email'
                     >
            </input>
            <input onChange={onChange} 
                    type={showPassword ? "text" : "password"} 
                    placeholder='Password' 
                    className='w-full text-xl text-gray-700 bg-gray-100 rounded-lg' 
                    id='password'>
            </input>
            {/* <button className='absolute text-xl right-[10px] top-[58px]' onClick={()=>{setShowPassword(!showPassword)}}>{showPassword ? <AiFillEye /> : <AiFillEyeInvisible /> }</button> */}
            {showPassword ? 
            (<AiFillEye onClick={()=>{setShowPassword(!showPassword)}} className='absolute text-xl right-[10px] top-[154px]'/>) : 
            <AiFillEyeInvisible onClick={()=>{setShowPassword(!showPassword)}} className='absolute text-xl right-[10px] top-[154px]'/>}
            </div>
            <div className='flex justify-between text-lg mt-2 mb-8'>
            <p >Have an Account? <a className='text-red-600' href="/sign-in">Sine in</a></p>
            <a className='text-red-600' href='/forgot-password'>forgot password?</a>
         </div>
         <button className='mb-4 mt-4 w-full text-lg bg-blue-600 text-white h-14 rounded-md  hover:bg-blue-700 shadow-lg active:bg-blue-800' type='submit'>Sign Up</button>
          <div className='mt-2 mb-2 '>
            <p className='text-center'>OR</p>
          </div>
          <OAuth></OAuth>
          </form>
        </div>
     </div>
     </section>
  )
}
