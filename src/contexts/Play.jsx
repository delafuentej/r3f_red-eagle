import { createContext, useContext, useState } from "react";

// TO SHARE DATA BETWEEEN UI AND 3D SCENE WE CREATE A CONTEXT
const initialState = {
  play: false,
  end: false,
  hasScroll: false,
};

const Context = createContext();

export const PlayProvider = ({ children }) => {
  const [play, setPlay] = useState(initialState.play);
  const [end, setEnd] = useState(initialState.end);
  const [hasScroll, setHasScroll] = useState(initialState.hasScroll);

  const reset = () => {
    setEnd(false);

    // También puedes reiniciar el scroll:
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <Context.Provider
      value={{
        play,
        setPlay,
        end,
        setEnd,
        hasScroll,
        setHasScroll,
        reset,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const usePlay = () => {
  const context = useContext(Context);

  console.log("context", context);

  if (context === undefined) {
    throw new Error("usePlay must be used within a Play");
  }

  return context;
};

export { usePlay };
