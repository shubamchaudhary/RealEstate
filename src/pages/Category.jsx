import React from 'react'
import { doc, getDoc, orderBy, query,limit ,where} from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";
import "swiper/css/bundle";

import { getAuth } from "firebase/auth";
import { Dna } from 'react-loader-spinner';
import { getDocs,collection } from 'firebase/firestore';
import { Slide } from 'react-toastify';
import ListingItem from '../components/ListingItem';
import Slider from '../components/Slider';
export default function Category() {
  const [categoryListings,setCategoryListings]=useState(null);
  const [loading,setLoading]=useState(true);
  const params=useParams();
  useEffect(()=>{
    async function fetchListings(){
      try {
        const listingRef=collection(db,"listings");
        const q=query(listingRef,where("type","==",params.categoryName),orderBy("timestamp","desc"))
        const querySnap=await getDocs(q);
        const listings=[];
        querySnap.forEach((doc)=>{
          return listings.push({
            id:doc.id,
            data:doc.data(),
          })
        })
        setCategoryListings(listings)
        setLoading(false)
        
      } catch (error) {
        console.log(error)
      }
    }
    fetchListings();
  },[])

  if(loading) {
    return  <div className="h-screen flex items-center justify-center">
       <Dna
    visible={true}
    height="500"
    width="500"
    ariaLabel="dna-loading"
    wrapperStyle={{}}
    wrapperClass="dna-wrapper"
  />
  </div>;
  }
  return (
      <div className='mt-6'>
      <h1 className=' text-center mt-[50px] mb-6 cursive'>{params.categoryName==="rent"?"Places for Rent" : "Places for Sale"}</h1>
        <div className='max-w-6xl mx-auto pt-4 space-y-6'>
         {categoryListings && categoryListings.length>0 && (
          <div className='m-2 mb-6'>
             <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
             {categoryListings.map((listing)=>(
              <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
             ))}
             </ul>
          </div>
         )}
        </div>
      </div>
  )
}

