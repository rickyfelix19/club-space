import React, { useEffect, useState } from "react";

import * as facemesh from "@tensorflow-models/facemesh";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";

import { TRIANGULATION } from "./triangulations";

import AppSideMenu from "../../components/app-side-menu";
import Icon from "../../components/icon";
import PopUp from "../../components/pop-up";

import "./styles.css";

tfjsWasm.setWasmPath(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/tfjs-backend-wasm.wasm`
);

const available = true;
const id = "face-recognition";
const title = "Face Tracking";
const icon =
  "https://cdn4.iconfinder.com/data/icons/face-biometry/154/face-biometry-scan-dots-map-person-512.png";
const description =
  "Real-time face detection experience to demo machine learning platform capabilities";

interface IProps {
  onClose?: any;
  isOpen?: boolean;
}

const Interface = ({ onClose, isOpen }: IProps) => {
  const [appOpen, setAppOpen] = useState(false);
  return (
    <>
      {isOpen && (
        <AppSideMenu
          title={title}
          onClose={() => {
            onClose && onClose();
          }}
        >
          <p>How to use:</p>
          <ul>
            <li>Press "Start Experience" to start tracking your face</li>
            <li>
              Close the experience by pressing the cross in the top right corner
            </li>
          </ul>

          <button
            onClick={() => {
              onClose && onClose();
              setAppOpen(true);
            }}
          >
            Start Experience
          </button>
        </AppSideMenu>
      )}
      {appOpen && (
        <PopUp>
          <AppInterface
            onClose={() => {
              setAppOpen(false);
            }}
          />
        </PopUp>
      )}
    </>
  );
};

function drawPath(ctx: any, points: any, closePath: any) {
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.stroke(region);
}

let model: any,
  ctx: any,
  videoWidth: any,
  videoHeight: any,
  video: any,
  canvas: any,
  scatterGLHasInitialized: any = false,
  scatterGL: any;

const VIDEO_SIZE: any = 300;

// Don't render the point cloud on mobile in order to maximize performance and
// to avoid crowding limited screen space.
const renderPointcloud = false;
const state = {
  backend: "wasm",
  maxFaces: 1,
  triangulateMesh: true,
};

if (renderPointcloud) {
  // @ts-ignore
  state.renderPointcloud = true;
}

function setupDatGui() {
  // @ts-ignore
  const gui = new dat.GUI();
  gui
    .add(state, "backend", ["wasm", "webgl", "cpu"])
    .onChange(async (backend: any) => {
      await tf.setBackend(backend);
    });

  gui.add(state, "maxFaces", 1, 20, 1).onChange(async (val: any) => {
    model = await facemesh.load({ maxFaces: val });
  });

  gui.add(state, "triangulateMesh");

  if (renderPointcloud) {
    gui.add(state, "renderPointcloud").onChange((render: any) => {
      // @ts-ignore
      document.querySelector("#scatter-gl-container").style.display = render
        ? "inline-block"
        : "none";
    });
  }
}

async function setupCamera() {
  video = document.getElementById("video");

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      // Only setting the video to a specified size in order to accommodate a
      // point cloud, so on mobile devices accept the default size.
      width: VIDEO_SIZE,
      height: VIDEO_SIZE,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function renderPrediction() {
  const predictions = await model.estimateFaces(video);
  ctx.drawImage(
    video,
    0,
    0,
    videoWidth,
    videoHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  if (predictions.length > 0) {
    predictions.forEach((prediction: any) => {
      const keypoints = prediction.scaledMesh;

      if (state.triangulateMesh) {
        for (let i = 0; i < TRIANGULATION.length / 3; i++) {
          const points = [
            TRIANGULATION[i * 3],
            TRIANGULATION[i * 3 + 1],
            TRIANGULATION[i * 3 + 2],
          ].map((index) => keypoints[index]);

          drawPath(ctx, points, true);
        }
      } else {
        for (let i = 0; i < keypoints.length; i++) {
          const x = keypoints[i][0];
          const y = keypoints[i][1];

          ctx.beginPath();
          ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    });

    // @ts-ignore
    if (renderPointcloud && state.renderPointcloud && scatterGL != null) {
      const pointsData = predictions.map((prediction: any) => {
        let scaledMesh = prediction.scaledMesh;
        return scaledMesh.map((point: any) => [
          -point[0],
          -point[1],
          -point[2],
        ]);
      });

      let flattenedPointsData: any = [];
      for (let i = 0; i < pointsData.length; i++) {
        flattenedPointsData = flattenedPointsData.concat(pointsData[i]);
      }
      // @ts-ignore
      const dataset = new ScatterGL.Dataset(flattenedPointsData);

      if (!scatterGLHasInitialized) {
        scatterGL.render(dataset);
      } else {
        scatterGL.updateDataset(dataset);
      }
      scatterGLHasInitialized = true;
    }
  }

  requestAnimationFrame(renderPrediction);
}

const AppInterface = ({ onClose }: any) => {
  const main = async () => {
    await tf.setBackend(state.backend);

    await setupCamera();
    video.play();
    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    canvas = document.getElementById("output");
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const canvasContainer = document.querySelector(".canvas-wrapper");
    // @ts-ignore
    canvasContainer.style = `width: ${videoWidth}px; height: ${videoHeight}px`;

    ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.fillStyle = "#32EEDB";
    ctx.strokeStyle = "#32EEDB";
    ctx.lineWidth = 0.5;

    model = await facemesh.load({ maxFaces: state.maxFaces });
    renderPrediction();

    if (renderPointcloud) {
      // @ts-ignore
      document.querySelector(
        "#scatter-gl-container"
        // @ts-ignore
      ).style = `width: ${VIDEO_SIZE}px; height: ${VIDEO_SIZE}px;`;

      // @ts-ignore
      scatterGL = new ScatterGL(
        document.querySelector("#scatter-gl-container"),
        { rotateOnStart: false, selectEnabled: false }
      );
    }
  };
  useEffect(() => {
    main();
  }, []);
  return (
    <div className="face-wrapper">
      <div className="face-heading">
        <p>{title}</p>
        <button
          onClick={() => {
            onClose && onClose(false);
          }}
        >
          <Icon type="cross" />
        </button>
      </div>
      <div className="face-body">
        <div id="main">
          <div className="container">
            <div className="canvas-wrapper">
              <canvas id="output"></canvas>
              <video id="video" playsInline></video>
            </div>
            <div id="scatter-gl-container"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Applet = { id, title, icon, description, available, Interface };

export default Applet;
