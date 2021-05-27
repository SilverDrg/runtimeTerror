import React from "react";
import { withRouter } from "react-router-dom";

function Navigation() {
  return (
    <nav class="navbar navbar-expand-lg navbar-light border-rounded bg-dark text-white">
      <a class="navbar-brand text-white" href="/">Project</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto ">
            <li class="nav-item">
                <a class="nav-link text-light" href="/">Home</a> 
            </li>
            <li class="nav-item">
                <a class="nav-link text-light" href="/map">Map</a> 
            </li>
            <li class="nav-item">
                <a class="nav-link text-light" href="/aboutus">About us</a> 
            </li>
        </ul>
      </div>
    </nav>
  );
}

export default withRouter(Navigation);