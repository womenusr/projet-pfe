import { Link } from "react-router";
import { useEffect, useState } from "react";

function Hero() {
  const [goUp, setGoUp] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bookBtn = () => {
    document
      .querySelector("#booking-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const onPageScroll = () => {
      setGoUp(window.pageYOffset > 600);
    };
    window.addEventListener("scroll", onPageScroll);

    return () => {
      window.removeEventListener("scroll", onPageScroll);
    };
  }, []);

  return (
    <section id="home" className="relative bg-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="text-center md:text-left max-w-2xl">
            <h4 className="text-[#EE7A46] text-lg font-semibold mb-2 uppercase">
              Engagez-vous pour un avenir plus sûr
            </h4>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#0E2159] leading-tight">
              Priorisez la <span className="text-[#EE7A46]">sécurité</span> et
              la <span className="text-[#EE7A46]">prévention</span> au quotidien
            </h1>
            <p className="text-black text-base md:text-lg mb-8 max-w-[90%] mx-auto md:mx-0">
              Sensibilisez, formez et agissez pour créer un environnement de
              travail sain et sécurisé. Notre approche HSE vous accompagne dans
              l’amélioration continue de vos performances en matière d’hygiène,
              sécurité et environnement.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/"
                onClick={bookBtn}
                className="bg-[#EE7A46] hover:bg-[#d76633] text-white px-6 py-3 rounded-full text-base font-semibold flex items-center justify-center transition duration-300"
              >
                Découvrir nos solutions&nbsp;
                <i className="fa-solid fa-circle-check ml-2"></i>
              </Link>

              <Link
                to="/"
                onClick={() =>
                  document
                    .querySelector("#plantrip")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border-2 border-[#EE7A46] text-[#EE7A46] hover:bg-[#EE7A46] hover:text-white px-6 py-3 rounded-full text-base font-semibold flex items-center justify-center transition duration-300"
              >
                En savoir plus&nbsp;
                <i className="fa-solid fa-angle-right ml-2"></i>
              </Link>
            </div>
          </div>

          {/* Car Image (optional HSE-related image can be added) */}
          {/* <img
            src={YourHSEImage}
            alt="hse-image"
            className="w-full md:w-1/2 object-contain"
          /> */}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <div
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 w-10 h-10 flex items-center justify-center bg-[#EE7A46] text-white rounded-full cursor-pointer text-xl transition-opacity duration-300 ${
          goUp ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        title="Retour en haut"
      >
        ^
      </div>
    </section>
  );
}

export default Hero;
