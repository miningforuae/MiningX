"use client";
import ImagesTwo from "@/components/Images/ImagesTwo";
import ImagesOne from "@/components/Images/ImagesOne";

const Images: React.FC = () => {
  return (
    <>

      <div className="flex flex-col gap-7.5">
        <ImagesOne />
        <ImagesTwo />
      </div>
    </>
  );
};

export default Images;
