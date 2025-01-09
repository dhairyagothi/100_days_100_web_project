import * as faceapi from 'face-api.js';

export async function loadFaceModels() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  ]);
}

export async function analyzeFaceExpressions(videoElement: HTMLVideoElement) {
  const detection = await faceapi
    .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  return detection?.expressions || null;
}