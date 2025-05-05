import Hero from "./Hero";

//import "../../../src/dist/styles.css";

import { useState } from "react";
import { Link } from "react-router";
//import Logo from "../images/logo/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";
import Footer from "../../layout/Footer";

function Home() {
  const [nav, setNav] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const openNav = () => {
    setNav(!nav);
  };

  return (
    <>
      <nav>
        {/* Mobile Navbar */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-[#0E2159] text-white p-8 z-50 transform ${
            nav ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <div onClick={openNav} className="text-3xl text-right cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </div>
          <ul className="mt-8 space-y-6 text-lg font-medium">
            <li>
              <a href="#hero" onClick={openNav}>
                Accueil
              </a>
            </li>
          </ul>
        </div>

        {/* Desktop Navbar */}
        <div className="flex justify-between items-center px-6 py-4 bg-[#0E2159] text-white shadow-md sticky top-0 z-40">
          <div className="cursor-pointer">
            <a href="#hero" onClick={() => window.scrollTo(0, 0)}>
              {/* <img src={Logo} alt="logo-img" className="h-10" /> */}
            </a>
          </div>

          <ul className="hidden md:flex gap-6 items-center text-[2vh] font-medium">
            <li>
              <a href="#hero" className="hover:text-[#EE7A46]">
                Accueil
              </a>
            </li>

            <li>
              <a href="#contact" className="hover:text-[#EE7A46]">
                Contact
              </a>
            </li>

            {user?._id != null ? (
              <>
                <li>
                  <Link
                    to={
                      user.role === "admin"
                        ? "/admin_dashboard"
                        : user.role === "agency"
                        ? "/agency_dashboard"
                        : "user_demandes"
                    }
                    className="hover:text-[#EE7A46]"
                  >
                    Espace Personelle
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    onClick={() => dispatch(logout())}
                    className="hover:text-[#EE7A46]"
                  >
                    Déconnection
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-[#EE7A46]">
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-[#EE7A46]">
                    S'Inscrire
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden text-2xl cursor-pointer" onClick={openNav}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>
      </nav>

      <div id="hero">
        <Hero />
      </div>

      <Footer />
    </>
  );
}

export default Home;
