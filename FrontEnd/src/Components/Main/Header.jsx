import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "./Header.css";

const hd_logo = '/logo.png';  // Path relative to public folder

function Header( { onLoginClick } ) {

  function handleLoginClick() {
    onLoginClick();
  }

  function closeSidebar() {
    document.getElementById("sidebar-active").checked = false;
  }

  return (
    <header>
      <nav>
        <div className="logo">
          <img src={hd_logo} alt="Logo" />
        </div>

        <input type="checkbox" id="sidebar-active" />
        <label htmlFor="sidebar-active" className="open-sidebar-button">
        <svg xmlns="http://www.w3.org/2000/svg" 
          height="32" 
          viewBox="0 -960 960 960" 
          width="32">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
        </svg>
        </label>

        <label id="overlay" htmlFor="sidebar-active" />
        <div className="links-container">
          <label htmlFor="sidebar-active" className="close-sidebar-button">
          <svg xmlns="http://www.w3.org/2000/svg" 
            height="32" 
            viewBox="0 -960 960 960" 
            width="32">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
          </svg>
          </label>

            <HashLink onClick={closeSidebar} className="_link" smooth to="/#top">Hem</HashLink>
            <HashLink onClick={closeSidebar} className="_link" smooth to="/office/#top">Kontor</HashLink>
            <HashLink onClick={closeSidebar} className="_link" smooth to="/meetingroom/#top">Mötesrum</HashLink>
            <HashLink onClick={closeSidebar} className="_link" smooth to="/butik/#top" >Butik</HashLink>
            <Link onClick={closeSidebar} className="_link" to="/contactus" >Kontakt</Link>
            
            <HashLink onClick={(e) => { e.preventDefault(); handleLoginClick(); closeSidebar() }} className="svg-cont _link" smooth to="#">Community
              {/* <svg width="30" height="75" viewBox="-0.5 -5 33 1" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 0a9.5 9.5 0 0 1 4.581 17.825C27.427 19.947 32 25.94 32 33h-2c0-7.732-6.268-14-14-14S2 25.268 
                2 33H0c0-7.3 4.888-13.458 11.57-15.379A9.5 9.5 0 0 1 16.5 0m0 2a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15"/>
              </svg> */}
            </HashLink>

        </div>
      </nav>
    </header>
  );
}

export default Header;
