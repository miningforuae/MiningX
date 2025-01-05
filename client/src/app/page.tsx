
import LandingLayout from "@/components/Layouts/LandingLayout";
import LandingHome from "@/components/home/landingHome";
import { Poppins } from '@next/font/google';
import "@/css/style.css";
import 'leaflet/dist/leaflet.css';



export default function Home() {
  return (
    <>
    
       <LandingLayout>
        <LandingHome/>
      </LandingLayout> 
   
    </>
  );
}
