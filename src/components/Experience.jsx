import React, { useLayoutEffect, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  // OrbitControls,
  Float,
  // Line,
  PerspectiveCamera,
  useScroll,
  Text,
} from "@react-three/drei";
import gsap from "gsap";
import { usePlay } from "../contexts/Play";

import Background from "./Background";
import Eagle from "./Eagle";
import Cloud from "./Cloud";
import TextSection from "./TextSection";

import {
  createCurvePoints,
  getClouds,
  getTextSections,
  fadeOnBeforeCompile,
} from "../utils";
import {
  LINE_NB_POINTS,
  CURVE_DISTANCE,
  CURVE_AHEAD_CAMERA,
  CURVE_AHEAD_EAGLE,
  EAGLE_MAX_ANGLE,
  FRICTION_DISTANCE,
} from "../config/constants";

const Experience = () => {
  const curvePoints = useMemo(() => createCurvePoints(CURVE_DISTANCE), []);
  const sceneOpacity = useRef(0);
  const lineMaterialRef = useRef();

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5);
  }, [curvePoints]);

  const textSections = useMemo(
    () => getTextSections(curvePoints),
    [curvePoints]
  );

  const clouds = useMemo(() => getClouds(curvePoints), [curvePoints]);

  // const linePoints = useMemo(() => {
  //   return curve.getPoints(LINE_NB_POINTS);
  // }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);

    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const cameraRail = useRef();
  const camera = useRef();
  const eagle = useRef();
  const scroll = useScroll();
  const lastScroll = useRef(0);

  const { play, setHasScroll, end, setEnd } = usePlay();

  useFrame((_state, delta) => {
    if (window.innerWidth > window.innerHeight) {
      //landscape
      camera.current.fov = 30;
      camera.current.position.z = 5;
    } else {
      //portrait
      camera.current.fov = 50;
      camera.current.position.z = 2;
    }
    if (lastScroll.current <= 0 && scroll.offset > 0) {
      setHasScroll(true);
    }
    // const currentPointIndex = Math.min(
    //   Math.round(scroll.offset * linePoints.length),
    //   linePoints.length - 1
    // );

    if (play && !end && sceneOpacity.current < 1) {
      camera.current.fov = 50;
      camera.current.position.z = 15;

      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        1,
        delta * 0.1
      );
    }

    if (end && sceneOpacity.current > 0) {
      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        0,
        delta
      );
    }

    lineMaterialRef.current.opacity = sceneOpacity.current;

    if (end) return;

    let friction = 1;

    let resetCameraRail = true;
    // to look close the text sections
    textSections.forEach((textSection) => {
      const distance = textSection.position.distanceTo(
        cameraGroup.current.position
      );
      if (distance < FRICTION_DISTANCE) {
        friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
        const targetCameraRailPosition = new THREE.Vector3(
          (1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist,
          0,
          0
        );
        cameraRail.current.position.lerp(targetCameraRailPosition, delta);
        resetCameraRail = false;
      }
    });
    if (resetCameraRail) {
      const targetCameraRailPosition = new THREE.Vector3(0, 0, 0);
      cameraRail.current.position.lerp(targetCameraRailPosition, delta);
    }

    const scrollOffset = Math.max(0, scroll.offset);

    // calculate lerped scroll offset

    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scrollOffset,
      delta * friction
    );

    // protect below 0 and above 1
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

    lastScroll.current = lerpedScrollOffset;
    tl.current.seek(lerpedScrollOffset * tl.current.duration());

    const currentPoint = curve.getPoint(lerpedScrollOffset); //curve.getPoint(scrollOffset); //linePoints[currentPointIndex];

    // folowing the curve points
    cameraGroup.current.position.lerp(currentPoint, delta * 24);

    //make the group look ahead on the curve
    const lookAtPoint = curve.getPoint(
      Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
    );

    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    );

    const targetLookAt = new THREE.Vector3()
      .subVectors(currentPoint, lookAtPoint)
      .normalize();

    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);

    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    );

    // eagle rotation
    const tangent = curve.getTangent(scrollOffset + CURVE_AHEAD_EAGLE);

    let nonLerpLookAt = new THREE.Group();
    nonLerpLookAt.position.copy(currentPoint);
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));

    tangent.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -nonLerpLookAt.rotation.y
    );

    let angle = Math.atan2(-tangent.z, tangent.x);
    angle = -Math.PI / 2 + angle;

    let angleDegrees = (angle * 180) / Math.PI;
    angleDegrees *= 2.4;

    //limit eagle angle
    if (angleDegrees < 0) {
      angleDegrees = Math.max(angleDegrees, -EAGLE_MAX_ANGLE);
    }
    if (angleDegrees > 0) {
      angleDegrees = Math.min(angleDegrees, EAGLE_MAX_ANGLE);
    }

    // converting the angle in radian
    angle = (angleDegrees * Math.PI) / 180;

    const targetEagleQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(eagle.current.rotation.x, eagle.current.rotation.y, angle)
    );

    eagle.current.quaternion.slerp(targetEagleQuaternion, delta * 2);

    //to detect if we are close to the end

    if (
      cameraGroup.current.position.z <
      curvePoints[curvePoints.length - 1].z + 100
    ) {
      setEnd(true);
      eagleOutTl.current.play();
    }
    // const pointAhead =
    //   linePoints[(Math.min(currentPointIndex + 1), linePoints.length - 1)];

    //const xDisplacement = (pointAhead.x - currentPoint.x) * -1;

    //math.pi / 2 => left
    //- math.pi /2 => right

    // const angleRotation =
    //   (xDisplacement < 0 ? 1 : -1) *
    //   Math.min(Math.abs(xDisplacement), Math.PI / 3);

    // const targetEagleQuaternion = new THREE.Quaternion().setFromEuler(
    //   new THREE.Euler(
    //     eagle.current.rotation.x,
    //     eagle.current.rotation.y,
    //     angleRotation
    //   )
    // );
    // eagle.current.quaternion.slerp(targetEagleQuaternion, delta * 2);
    // cameraGroup.current.quaternion.slerp(targetEagleQuaternion, delta * 2);

    // cameraGroup.current.position.lerp(currentPoint, delta * 24);
  });

  //animation with gsap
  const tl = useRef();
  const backgroundColors = useRef({
    colorA: "#87CEFA", // mediodía: azul cielo claro
    colorB: "#FFFFFF",
  });

  const eagleInTl = useRef();
  const eagleOutTl = useRef();

  useLayoutEffect(() => {
    tl.current = gsap.timeline();
    tl.current.to(backgroundColors.current, {
      ease: "power1.inOut",
      duration: 2,
      colorA: "#FF3C38", // rojo encendido
      colorB: "#FFD700", // dorado brillante (sunrise gold): naranja pastel
    });
    tl.current.to(backgroundColors.current, {
      ease: "power1.inOut",
      duration: 2,
      colorA: "#424242",
      colorB: "#ffcc00",
    });
    tl.current.to(backgroundColors.current, {
      ease: "power1.inOut",

      duration: 2,
      colorA: "#81318b",
      colorB: "#55ab8f",
    });
    tl.current.to(backgroundColors.current, {
      ease: "power1.inOut",
      duration: 2,
      colorA: "#6f35ff",
      colorB: "#ffad30",
    });

    tl.current.pause();
    eagleInTl.current = gsap.timeline();
    eagleInTl.current.pause();
    eagleInTl.current.from(eagle.current.position, {
      duration: 3,
      z: 5,
      y: -2,
    });

    eagleOutTl.current = gsap.timeline();
    eagleOutTl.current.pause();
    eagleOutTl.current.to(
      eagle.current.position,
      {
        duration: 10,
        z: -250,
        y: 10,
      },
      0
    );

    eagleOutTl.current.to(
      cameraRail.current.position,
      {
        duration: 8,
        y: 12,
      },
      0
    );

    eagleOutTl.current.to(eagle.current.position, {
      duration: 1,
      z: -1000,
    });
  }, []);

  useEffect(() => {
    if (play) {
      eagleInTl.current.play();
    }
  }, [play]);

  return useMemo(
    () => (
      <>
        <directionalLight position={[0, 1, 1]} intensity={0.1} />
        {/* <OrbitControls /> */}
        <group ref={cameraGroup}>
          <group ref={cameraRail}>
            <PerspectiveCamera
              ref={camera}
              position={[0, 2, 10]}
              fov={30}
              makeDefault
            />
          </group>
          <Background backgroundColors={backgroundColors} />

          {/* eagle */}
          <group ref={eagle}>
            <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
              <Eagle
                rotation-y={Math.PI / 2}
                scale={[0.5, 0.5, 0.5]}
                position-y={0.1}
              />
            </Float>
          </group>
        </group>

        {/* text */}
        {textSections.map((textSection, index) => (
          <TextSection {...textSection} key={index} />
        ))}

        {/* LINE */}
        <group position-y={0}>
          {/* <Line
          points={linePoints}
          color={"white"}
          opacity={0.7}
          lineWidth={2}
          transparent
        /> */}
          <mesh>
            {/* <extrudeGeometry
              args={[
                shape,
                {
                  steps: LINE_NB_POINTS,
                  bevelEnabled: false,
                  extrudePath: curve,
                },
              ]}
            /> */}
            <meshStandardMaterial
              color={"white"}
              ref={lineMaterialRef}
              transparent
              envMapIntensity={2}
              onBeforeCompile={fadeOnBeforeCompile}
            />
          </mesh>
        </group>

        {/* clouds */}
        {clouds.map((cloud, index) => (
          <Cloud sceneOpacity={sceneOpacity} {...cloud} key={index} />
        ))}
      </>
    ),
    [clouds, textSections]
  );
};

export default Experience;
