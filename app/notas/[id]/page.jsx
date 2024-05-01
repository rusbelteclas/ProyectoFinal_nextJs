"use client"
import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import { getProductById } from "../create/actions";
import "react-image-gallery/styles/css/image-gallery.css";

export default function ProductPage({ params }) {

  const [product, setProduct] = useState(null);

  //campo gallery: tipo JSONB
  const images = [
    {
      original: "https://umnmtzhlkgrgcdgloyjd.supabase.co/storage/v1/object/public/gallery/notes/notes_1/neymar.jpg?t=2024-02-29T22%3A30%3A23.313Z",
      thumbnail: "https://umnmtzhlkgrgcdgloyjd.supabase.co/storage/v1/object/public/gallery/notes/notes_1/neymar.jpg?t=2024-02-29T22%3A30%3A23.313Z",
    },
    {
      original: "https://umnmtzhlkgrgcdgloyjd.supabase.co/storage/v1/object/public/gallery/notes/notes_2/messi.jpg?t=2024-02-29T22%3A27%3A53.532Z",
      thumbnail: "https://umnmtzhlkgrgcdgloyjd.supabase.co/storage/v1/object/public/gallery/notes/notes_2/messi.jpg?t=2024-02-29T22%3A27%3A53.532Z",
    },
    {
      original: "https://umnmtzhlkgrgcdgloyjd.supabase.co/storage/v1/object/public/gallery/notes/notes_3/luka.jpg",
      thumbnail: "https://umnmtzhlkgrgcdgloyjd.supabase.co/storage/v1/object/public/gallery/notes/notes_3/luka.jpg",
    },
  ];
  useEffect(()=>{
    const getData =async ()=>{
        //llamar a la accion
        const productResult = await getProductById(params.id);
        setProduct(productResult.product);
        if (productResult.error) {
            alert(productResult.error.message);
        } 
    };
    getData();
}, []);

return (
  <div>
    <p>Información del producto</p>
    <b>{product?.name}</b>
    {product ? <ImageGallery items={images} /> : null}
  </div>
);
}