import { useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { usePlay } from "../contexts/Play";
import gsap from "gsap";

const Overlay = () => {
  const { progress } = useProgress();
  const { play, setPlay, hasScroll, end, setPlay: setReplay } = usePlay();

  useEffect(() => {
    if (end) {
      const tl = gsap.timeline();

      tl.to(".outro__text", {
        duration: 2,
        opacity: 0,
        y: -50,
        delay: 5,
        ease: "power2.out",
      })
        .set(
          ".logo",
          {
            top: "50vh",
            scale: 1,
            transformOrigin: "center center",
          },
          "<"
        )
        .to(
          ".logo",
          {
            opacity: 1,
            duration: 2,
            ease: "power2.out",
          },
          "<"
        )
        .to(
          ".img-logo",
          {
            opacity: 1,
            duration: 2,
            ease: "power2.out",
            onComplete: () => {
              setReplay(false);
            },
          },
          "<"
        );

      return () => tl.kill();
    }
  }, [end, setReplay]);

  return (
    <div
      className={`overlay ${play ? "overlay--disable" : ""} ${
        hasScroll ? "overlay--scrolled" : ""
      }`}
    >
      <div className={`${progress === 100 ? "loader--disappear" : "loader"}`} />
      {progress === 100 && (
        <div className={`intro ${play ? "intro--disappear" : ""}`}>
          <h1 className="logo">
            <img
              src="/images/eagle-logo.png"
              alt="img-logo"
              className="img-logo"
            />
            Red Eagle
            <div className="spinner">
              <div className="spinner__image" />
            </div>
          </h1>
          <p className="intro__scroll">Scroll to begin the journey</p>

          {!end && (
            <button
              className="explore"
              onClick={() => {
                setPlay(true);
              }}
            >
              Explore
            </button>
          )}
        </div>
      )}
      <div className={`outro ${end ? "outro--appear" : ""}`}>
        <p className="outro__text">
          <p>Eagle, fly free,</p>
          <p>let people see,</p>
          <p>just make it your own way.</p>
          <p>Let's time behind,</p>
          <p>follow the sign,</p>
          <p>together we'll fly someday</p>
        </p>
      </div>
    </div>
  );
};

export default Overlay;
