import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import background from '../../resources/background.jpg'

function Home(props) {
    return(
        <div className="text-center mx-auto px-0 w-100 col">
            <Image className="mx-auto" alt="Background_image" src={background} fluid/>
            <div className="container bg-dark mx-auto my-3 py-2 col-sm-10 rounded text-light">
                <h3>Runtime Terror</h3>
                <hr className="mx-auto col-sm-8"></hr>
                <p>This is a web application, that collects data from our mobile application and other web sites with publicly accessible data.</p>
            </div>
        </div>
    );
}


export default withRouter(Home);