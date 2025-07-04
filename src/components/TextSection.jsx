import React from "react";

import { Text } from "@react-three/drei";
import { fadeOnBeforeCompileFlat } from "../utils";

const TextSection = ({ title, subtitle, ...props }) => {
  return (
    <group {...props}>
      {!!title && (
        <Text
          color="gold"
          anchorX={"left"}
          anchorY={"bottom"}
          fontSize={0.52}
          maxWidth={3}
          lineHeight={1}
          font={"/fonts/EBGaramond/EBGaramond-VariableFont_wght.ttf"}
        >
          {title}
          <meshStandardMaterial
            color={"gold"}
            onBeforeCompile={fadeOnBeforeCompileFlat}
          />
        </Text>
      )}

      <Text
        color="white"
        anchorX={"left"}
        anchorY={"top"}
        fontSize={0.2}
        maxWidth={3}
        font={"/fonts/EBGaramond/EBGaramond-VariableFont_wght.ttf"}
      >
        {subtitle}
      </Text>
    </group>
  );
};

export default TextSection;
