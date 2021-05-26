import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

function Home(props) {
    return(
        <div className="container text-center mx-auto px-0 w-100 col">
            <div className="mx-auto col-sm-12 row">
                <h3>Hello for now (WIP)</h3>
            </div>
        </div>
    );
}


export default withRouter(Home);