import { render } from '@testing-library/react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React,{useEffect,useState} from 'react'
import { useNavigate, useLocation } from 'react-router'

export default function Header() {

    const [pageState,setPageState]=useState("sign-in");
    const [displayPageName,setDisplayPageName]=useState("Sign in");

    const auth=getAuth();

    useEffect(()=>onAuthStateChanged(auth,(user)=>{
          if(user){
            setPageState("profile");
            setDisplayPageName("Profile")
          }
          else{
            setPageState("sign-in");
            setDisplayPageName("Sign in")
          }
    }))

    const location=useLocation();

    const navigate=useNavigate();

    function isPath(route){
        if(route===location.pathname){
            return true;   
        }
    }
  return (
    <div  className='bg-gray-100  shadow-md sticky'>
        <header className='flex justify-between items-center px-8 max-w-8xl  top-0 z-50'>
            <div >
                <h1 onClick={()=>navigate("/")}  className=" font-bold h-[80px] cursor-pointer cursive " alt="" >RealEstate</h1>
            </div>
            <div >
                <ul  className='flex space-x-20'>
                    <li  onClick={()=>navigate("/")} className={`cursor-pointer py-8 text-sm font-semibold border-b-[3px] ${isPath("/") ? "text-black border-b-red-500" : " text-gray-400 border-b-transparent"}`}>
                        Home
                    </li>
                    <li onClick={()=>navigate("/offers")} className={`cursor-pointer py-8 text-sm font-semibold border-b-[3px]  ${isPath("/offers") ? "text-black border-b-red-500" : " text-gray-400 border-b-transparent"}`}>
                        Offers
                    </li>
                    <li onClick={()=>navigate(pageState)} className={`cursor-pointer py-8 text-sm font-semibold border-b-[3px]  ${(isPath("/sign-in") || isPath("/profile")) ? "text-black border-b-red-500" : " text-gray-400 border-b-transparent"}`}>
                        {displayPageName}
                    </li>
                </ul>
            </div>
        </header>
    </div>
  )
}
