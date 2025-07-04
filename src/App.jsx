import { Canvas } from "@react-three/fiber";

import { ScrollControls } from "@react-three/drei";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { usePlay } from "./contexts/Play";
import { Experience, Overlay } from "./components";

// minute 3:54 video 3

function App() {
  const { play, end } = usePlay();
  return (
    <>
      <Canvas>
        <color attach="background" args={["#ececec"]} />
        <ScrollControls
          pages={play && !end ? 20 : 0}
          damping={0.5}
          style={{
            top: "10px",
            left: "0px",
            bottom: "10px",
            right: "10px",
            width: "auto",
            height: "auto",
            transition: "fadeIn 2.4s ease-in-out 1.2 forwards",
            opacity: 0,
          }}
        >
          <Experience />
        </ScrollControls>
        <EffectComposer>
          <Noise opacity={0.2} />
        </EffectComposer>
      </Canvas>
      <Overlay />
    </>
  );
}

export default App;
