import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { Dna } from 'react-loader-spinner';
import Contact from "../components/Contact";
import { MapContainer,TileLayer,Marker,Popup } from "react-leaflet";




export default function Listing() {
    SwiperCore.use([Autoplay, Navigation, Pagination]);
    const auth = getAuth();
    const params=useParams();
    const [listing,setListing]=useState(null);
    const [contactLandlord, setContactLandlord] = useState(false);
    const [loading,setLoading]=useState(true);
    const [shareLinkCopied,setShareLinkCopied]=useState(false);
    useEffect(() => {
      async function fetchListing() {
        const docRef = doc(db, "listings", params.listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing(docSnap.data());
          setLoading(false);
        }
      }
      fetchListing();
    }, [params.listingId]);
    if (loading) {
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
    <main>
       <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[400px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="fixed top-[13%] right-[3%] z-10 cursor-pointer w-12 h-12 flex justify-center items-center"
         onClick={()=>{
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true);
          setTimeout(()=>{
            setShareLinkCopied(false)
          },1000)
          }}
>
        <FaShare className="text-white text-4xl" />
      </div>
      {shareLinkCopied && <p  className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">Link Copied</p>}
      <div className="mt-4  flex flex-col md:flex-row max-w-[80%] lg:mx-auto p-4 rounded-lg shadow-lg bg-white  lg:space-x-8">
        <div className="w-full ">
        <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} - ₹{" "}
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-700 mr-1" />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
          <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            {listing.offer && (
              <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
                ₹{+listing.regularPrice - +listing.discountedPrice} discount
              </p>
            )}
          </div>
          <p className="mt-3 mb-3">
            <span className="font-semibold">Description - </span>
            {listing.description}
          </p>
          <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? "Parking spot" : "No parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {listing.furnished ? "Furnished" : "Not furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6">
              <button onClick={()=>setContactLandlord(true)}
                   className="px-7 py-3 bg-blue-600 text-white font-medium text-sm rounded shadow-md w-[80%]"
              >
               Contact Landlord
              </button>
            </div>
          )}
          {contactLandlord && <Contact userRef={listing.userRef} listing={listing}/>}
        </div>
        <div className=" w-full  z-10 overflow-x-hidden">
        <MapContainer style={{height:"100%" , width:"100%"}} center={[listing.geolocation.lat,listing.geolocation.lng]} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[listing.geolocation.lat,listing.geolocation.lng]}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>
        </div>
      </div>
    </main>
  )
}
