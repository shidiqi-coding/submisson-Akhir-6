import "./script/component-web/index.js";

import "./script/view/home.js";

import "./styles/responsive.css";
import "./styles/loader.css";

import "./styles/style.css";



window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  


  loader.classList.add("loader-hidden");

  loader.addEventListener("transitioned", () => {
      document.body.removeChild("loader");
  })
})
