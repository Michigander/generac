//@ts-ignore
import "https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js";

async function main() {
  const videoEl = document.getElementById("feed") as HTMLVideoElement | null;
  const overlayEl = document.getElementById(
    "overlay"
  ) as HTMLCanvasElement | null;
  if (!videoEl || !overlayEl) {
    throw new Error("Could not find video or overlay element.");
  }
  const onPlay = async function () {
    while (true) {
      //@ts-ignore
      const snapshots = await faceapi.detectSingleFace(
        videoEl,
        //@ts-ignore
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 128,
          scoreThreshold: 0.5,
        })
      );

      console.log(snapshots);
      if (snapshots) {
        //@ts-ignore
        const dims = faceapi.matchDimensions(overlayEl, videoEl, true);

        //@ts-ignore
        faceapi.draw.drawDetections(
          overlayEl,
          //@ts-ignore
          faceapi.resizeResults(snapshots, dims)
        );
      }
    }
  };
  videoEl.addEventListener("play", onPlay);
  //@ts-ignore
  await faceapi.nets.tinyFaceDetector.load("/scratch");

  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  videoEl.srcObject = stream;

  // videoEl.removeEventListener("play", onPlay);
}

main();
