import { useState } from "react";

interface ProductGalleryProps {
  data: {
    images: string[];
  };
}

export default function ProductGallery({
  data,
}: ProductGalleryProps) {

  const [activeImage, setActiveImage] = useState(
    data.images[0]
  );


  if (!data.images.length) {
    return null;
  }


  return (
    <div className="flex flex-col gap-6">


      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-3xl bg-surface-secondary">

        <img
          src={activeImage}
          alt="Product"
          className="h-full w-full object-cover"
        />

      </div>



      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto">

        {data.images.map((image, index) => (

          <button
            key={index}
            onClick={() => setActiveImage(image)}
            className={`
              h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border
              ${
                activeImage === image
                  ? "border-primary ring-2 ring-primary"
                  : "border-border"
              }
            `}
          >

            <img
              src={image}
              alt={`Product ${index + 1}`}
              className="h-full w-full object-cover"
            />

          </button>

        ))}

      </div>


    </div>
  );
}