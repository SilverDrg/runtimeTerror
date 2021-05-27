import { useEffect, useState } from "react";
import Image from "./Image";

function Images(props) {
    const [images, setImages] = useState([]);
    useEffect(function() {
        const getImages = async function() {
            const res = await fetch('http://localhost:3001/camera');
            const data = await res.json();
            console.log("images from api: \n" + data);
            setImages(data);
        };
        getImages();
    }, []);
    console.log(images);

    return (
        <div className="container mx-auto col-sm-10">
            {images.map((image) => (<Image key={image._id} image={image}/>))}
        </div>
    );
}

export default Images;