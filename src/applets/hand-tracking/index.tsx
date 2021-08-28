import React, { useEffect, useState } from "react";

import * as handpose from "@tensorflow-models/handpose";

import AppSideMenu from "../../components/app-side-menu";
import Icon from "../../components/icon";
import PopUp from "../../components/pop-up";

import "./styles.css";

const available = true;
const id = "hand-tracker";
const title = "Hand Tracking";
const icon =
  "https:////raw.githubusercontent.com/kulin-patel/Hand-Tracking/master/Output.png";
const description =
  "Track your hand movement using your webcam to discover a new world of gesture fun";

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
            <li>Press "Start Experience" to start tracking your hand</li>
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

let videoWidth: any,
  videoHeight: any,
  scatterGLHasInitialized: any = false,
  scatterGL: any,
  fingerLookupIndices: any = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
  };

const VIDEO_WIDTH = 400;
const VIDEO_HEIGHT = 275;

const mobile = false;
// Don't render the point cloud on mobile in order to maximize performance and
// to avoid crowding limited screen space.
const renderPointcloud = false;

const state = {};

function drawPoint(ctx: any, y: any, x: any, r: any) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

function drawKeypoints(ctx: any, keypoints: any) {
  const keypointsArray = keypoints;

  for (let i = 0; i < keypointsArray.length; i++) {
    const y = keypointsArray[i][0];
    const x = keypointsArray[i][1];
    drawPoint(ctx, x - 2, y - 2, 3);
  }

  const fingers = Object.keys(fingerLookupIndices);
  for (let i = 0; i < fingers.length; i++) {
    const finger = fingers[i];
    const points = fingerLookupIndices[finger].map(
      (idx: any) => keypoints[idx]
    );
    drawPath(ctx, points, false);
  }
}

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

let model: any;

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      "Browser API navigator.mediaDevices.getUserMedia not available"
    );
  }

  const video = document.getElementById("video");
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      // Only setting the video to a specified size in order to accommodate a
      // point cloud, so on mobile devices accept the default size.
      width: mobile ? undefined : VIDEO_WIDTH,
      height: mobile ? undefined : VIDEO_HEIGHT,
    },
  });

  // @ts-ignore
  video.srcObject = stream;

  return new Promise((resolve) => {
    // @ts-ignore
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadVideo() {
  const video = await setupCamera();
  // @ts-ignore
  video.play();
  return video;
}

const landmarksRealTime = async (video: any) => {
  videoWidth = video.videoWidth;
  videoHeight = video.videoHeight;

  const canvas: any = document.getElementById("output");

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  const ctx = canvas.getContext("2d");

  video.width = videoWidth;
  video.height = videoHeight;

  ctx.clearRect(0, 0, videoWidth, videoHeight);
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red";

  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  // These anchor points allow the hand pointcloud to resize according to its
  // position in the input.
  const ANCHOR_POINTS = [
    [0, 0, 0],
    [0, -VIDEO_HEIGHT, 0],
    [-VIDEO_WIDTH, 0, 0],
    [-VIDEO_WIDTH, -VIDEO_HEIGHT, 0],
  ];

  async function frameLandmarks() {
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
    const predictions = await model.estimateHands(video);
    if (predictions.length > 0) {
      const result = predictions[0].landmarks;
      // @ts-ignore
      drawKeypoints(ctx, result, predictions[0].annotations);

      // @ts-ignore
      if (renderPointcloud === true && scatterGL != null) {
        const pointsData = result.map((point: any) => {
          return [-point[0], -point[1], -point[2]];
        });
        // @ts-ignore
        const dataset = new ScatterGL.Dataset([
          ...pointsData,
          ...ANCHOR_POINTS,
        ]);

        if (!scatterGLHasInitialized) {
          scatterGL.render(dataset);

          const fingers = Object.keys(fingerLookupIndices);

          scatterGL.setSequences(
            fingers.map((finger) => ({
              indices: fingerLookupIndices[finger],
            }))
          );
          scatterGL.setPointColorer((index: any) => {
            if (index < pointsData.length) {
              return "steelblue";
            }
            return "white"; // Hide.
          });
        } else {
          scatterGL.updateDataset(dataset);
        }
        scatterGLHasInitialized = true;
      }
    }
    requestAnimationFrame(frameLandmarks);
  }

  frameLandmarks();

  if (renderPointcloud) {
    // @ts-ignore
    document.querySelector(
      "#scatter-gl-container"
      // @ts-ignore
    ).style = `width: ${VIDEO_WIDTH}px; height: ${VIDEO_HEIGHT}px;`;

    // @ts-ignore
    scatterGL = new ScatterGL(document.querySelector("#scatter-gl-container"), {
      rotateOnStart: false,
      selectEnabled: false,
    });
  }
};

const AppInterface = ({ onClose }: any) => {
  const main = async () => {
    model = await handpose.load();
    let video;

    try {
      video = await loadVideo();
    } catch (e) {
      console.log(e);
    }

    landmarksRealTime(video);
  };
  useEffect(() => {
    main();
  }, []);
  return (
    <div className="hand-wrapper">
      <div className="hand-heading">
        <p>{title}</p>
        <button
          onClick={() => {
            onClose && onClose(false);
          }}
        >
          <Icon type="cross" />
        </button>
      </div>
      <div className="hand-body">
        <div id="predictions"></div>
        <div id="canvas-wrapper">
          <canvas id="output"></canvas>
          <video id="video" playsInline></video>
        </div>
        <div id="scatter-gl-container"></div>
      </div>
    </div>
  );
};

const Applet = { id, title, icon, description, available, Interface };

export default Applet;
