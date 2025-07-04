import * as THREE from "three";

export const getTextSections = (curvePoints) => [
  {
    cameraRailDist: -1,
    position: new THREE.Vector3(
      curvePoints[1].x - 3,
      curvePoints[1].y,
      curvePoints[1].z
    ),
    title: `Welcome to Red Eagle! ${"\n"}Where freedom finds its wings.`,
  },
  {
    cameraRailDist: 1.5,
    position: new THREE.Vector3(
      curvePoints[2].x + 2,
      curvePoints[2].y,
      curvePoints[2].z
    ),
    title: "A Flight Beyond Time",
    subtitle: `Beyond the mountains, beyond the sea, ${"\n"}flies the soul that dares to be.${"\n"}Not chained by earth, nor held by time,${"\n"}It dances high in air, sublime.${"\n"}`,
  },
  {
    cameraRailDist: -1,
    position: new THREE.Vector3(
      curvePoints[3].x - 3,
      curvePoints[3].y,
      curvePoints[3].z
    ),
    title: "Where Dreams Take Flight",
    subtitle: `Wings of light in morning skies,${"\n"}dreams awaken as they rise.${"\n"}To fly is not to flee the land,${"\n"}But seek the truth where stars expand.${"\n"}`,
  },
  {
    cameraRailDist: 1.5,
    position: new THREE.Vector3(
      curvePoints[4].x - 3,
      curvePoints[4].y,
      curvePoints[4].z
    ),
    title: "The Ascent of Truth",
    subtitle: `No cage, no chain, no whispered lie.${"\n"}Just wind, and will, and endless sky.${"\n"}Where freedom calls, the eagle knows:
the path is made where courage goes.`,
  },
  {
    cameraRailDist: -1,
    position: new THREE.Vector3(
      curvePoints[5].x - 3,
      curvePoints[5].y,
      curvePoints[5].z
    ),
    title: "Legacy of the Sky",
    subtitle: `Rise with the dawn, leave fear behind,${"\n"}the world is shaped by the soaring mind.${"\n"}For those who leap and dare to see,${"\n"}The sky becomes their legacy.`,
  },
  {
    cameraRailDist: 1.5,
    position: new THREE.Vector3(
      curvePoints[6].x - 3,
      curvePoints[6].y,
      curvePoints[6].z
    ),
    title: "The Higher Path",
    subtitle: `Feathers kissed by golden sun,${"\n"}A journey vast has just begun.${"\n"}Not all who wander fall or stray,${"\n"}Some simply choose a higher way.
`,
  },
];
