import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";
import { Dna } from 'react-loader-spinner';

export default function Slider() {
  const navigate = useNavigate();
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  const [loading,setLoading]=useState(true);
  const [listings, setListings] = useState(true);
  useEffect(()=>{
    async function fetchListings(){
        const listingRef=collection(db,"listings");
        const q=query(listingRef,orderBy("timestamp","desc"));

        const querySnap=await getDocs(q);
        const listings=[];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false)
        console.log(listings)
    }
    fetchListings();
  },[])
  if(loading){
    return <div className="h-screen flex items-center justify-center">
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
  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings &&(
    <>
       <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
        {listings.map(({data,id}) => (
          <SwiperSlide
          onClick={()=>navigate(`/category/${data.type}/${id}`)}
           key={id} >
            <div
              className="relative w-full overflow-hidden h-[350px]"
              style={{
                background: `url(${data.imgUrls[0]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
            <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">
              {data.name}
            </p>
            <p className="text-[#f1faee] absolute left-1 bottom-3 font-medium max-w-[90%] bg-red-500 shadow-lg opacity-90 p-2 rounded-tr-3xl">
            ₹ {data.discountedPrice ?? data.regularPrice}
              {data.type=="rent" && " /month (rent)"}
              {data.type=="sale" && " (selling price)"}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  ))
}
