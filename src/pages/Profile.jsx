import { getAuth,updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import React from 'react'
import {FcHome} from 'react-icons/fc';
import ListingItem from "../components/ListingItem";

export default function Profile() {
    const auth = getAuth();
    const user=auth.currentUser;
    const navigate = useNavigate();
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
      name: user.displayName,
      email: user.email,
    });
  
    const {name,email}=formData;


    const [changeDetail,setChangeDetail]=useState(false);

    function onLogout() {
      auth.signOut();
      navigate("/");
    }

    async function onSubmit() {
      try {
        if (auth.currentUser.displayName !== name) {
          //update display name in firebase auth
          await updateProfile(auth.currentUser, {
            displayName: name,
          });
  
          // update name in the firestore
  
          const docRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(docRef, {
            name,
          });
        }
        toast.success("Profile details updated");
      } catch (error) {
        toast.error("Could not update the profile details");
      }
    }
    
    function onChange(e) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
   
  useEffect(()=>{
    async function fetchUserListings(){
      const listingRef=collection(db,"listings");
      const q=query(
        listingRef,
        where("userRef","==",auth.currentUser.uid),
        orderBy("timestamp","desc")
      );
      const querySnap=await getDocs(q);
      let listings=[];
      querySnap.forEach((doc)=>{
        return listings.push({
          id: doc.id,
          data:doc.data(),
        })
      })
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  },[auth.currentUser.uid])
  
  async function onDelete(listingID){
      if(window.confirm("Delete this listing?")){
       await deleteDoc(doc(db,"listings",listingID));
       const updatedListings=listings.filter((listing)=>
        listing.id!==listingID
       );
       setListings(updatedListings)
       toast.success("Listing deleted")
      }
  }
  function onEdit(listingID){
      navigate(`/edit-listing/${listingID}`);
  }

  return (
    <>
     <section className="max-w-6xl mx-auto flex justify-center items-center flex-col mt-[100px]">
        <h1 className="text-3xl text-center  cursive">
            My Profile
        </h1>
        <div className="w-full md:w-[50%]  px-3 mt-[60px]">
            <form>
                <input type="text" id="name" value={name} disabled={!changeDetail} onChange={onChange}  
                className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}>

                </input>
            <input
              type="email"
              id="email"
              value={email}
              disabled={changeDetail}
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
           />
              <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className="flex items-center ">
                Do you want to change your name?
                <span
                  onClick={() => {
                    //change detail agar true hai, to submit the information.
                    changeDetail && onSubmit();
                    setChangeDetail(!changeDetail);

                  }}
                  className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                >
                  {changeDetail ? "Apply Changes" : "Edit"}
                </span>
              </p>
              <p
                onClick={onLogout}
                className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
              >
                Sign out
              </p>
            </div>
            </form>
          <button type="submit" className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800">
             <Link to={"/create-listing"} className="flex justify-center items-center">
               <FcHome className="mr-2 text-3xl  p-1 " /> Sell or Rent Home?
             </Link>
          </button>
        </div>
     </section>
     <div className="max-w-8xl px-2 mt-20 md-20 ml-40 mr-40 mx-auto">
      {!loading && listings.length >0 &&(
        <div >
        <h2 className=" text-center  mb-6 cursive">My Listings</h2>
        <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {listings.map(listing=>
            <ListingItem  key={listing.id} id={listing.id} listing={listing.data}  onDelete={() => onDelete(listing.id)} onEdit={() => onEdit(listing.id)}/>
            )}
        </ul>
        </div>
      )}
     </div>
     
    </>
  )
}
