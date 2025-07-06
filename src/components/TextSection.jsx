import React from "react";

import { Text } from "@react-three/drei";
import { fadeOnBeforeCompileFlat } from "../utils";

const TextSection = ({ title, subtitle, ...props }) => {
  return (
    <group {...props}>
      {!!title && (
        <Text
          color="#81318b"
          anchorX={"left"}
          anchorY={"bottom"}
          fontSize={0.52}
          maxWidth={4.25}
          lineHeight={1}
          font={"/fonts/Cinzel/Cinzel-VariableFont_wght.ttf"}
        >
          {title}
          <meshStandardMaterial
            color={"white"}
            onBeforeCompile={fadeOnBeforeCompileFlat}
          />
        </Text>
      )}

      <Text
        color="white"
        anchorX={"left"}
        anchorY={"top"}
        fontSize={0.2}
        maxWidth={4.5}
        font={"/fonts/Cinzel/Cinzel-VariableFont_wght.ttf"}
      >
        {subtitle}
      </Text>
    </group>
  );
};

export default TextSection;
