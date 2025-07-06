import * as THREE from "three";

export const createCurvePoints = (distance) => [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, -distance * 1),
  new THREE.Vector3(100, 0, -2 * distance),
  new THREE.Vector3(-100, 0, -3 * distance),
  new THREE.Vector3(100, 0, -4 * distance),
  new THREE.Vector3(0, 0, -5 * distance),
  new THREE.Vector3(0, 0, -6 * distance),
  new THREE.Vector3(0, 0, -7 * distance),
];
