import { useEffect, useState } from "react";

type XY = { x: number; y: number; };

type Vector = {
  magnitude: number;
  angle: number;
};

type Point = {
  x: number;
  y: number;
  timestamp: number;
};

const imageWidth = 200; // Width of the image in pixels
const imageHeight = 100; // Height of the image in pixels
const wheelTrackPeriod = 10000; // Time in milliseconds that the wheel tracks are visible
const maxSpeed = 200; // Maximum speed in pixels per second
const maxRotationRate = 180; // Maximum rotation rate in degrees per second

/**
 * Determines the x and y components of a vector
 * @param vector - The vector to convert
 * @returns - The x and y components of the vector
 */
function vectorToXY(vector: Vector): XY {
  return {
    x: Math.cos(vector.angle) * vector.magnitude,
    y: Math.sin(vector.angle) * vector.magnitude,
  };
}

/**
 * Calculates the new position of an object based on its speed and the time that has passed
 * @param oldPosition - The old position of the object
 * @param speed - The speed of the object
 * @param deltaMs - The time that has passed in milliseconds since the last update
 * @returns - The new position of the object
 */
function processPosition(oldPosition: XY, speed: Vector, deltaMs: number): XY {
  const speedComponents = vectorToXY(speed);

  const newPosition: XY = {
    x: oldPosition.x + speedComponents.x * (deltaMs / 1000),
    y: oldPosition.y + speedComponents.y * (deltaMs / 1000),
  };

  const min: XY = {
    x: 0,
    y: 0,
  };

  const max: XY = {
    x: window.innerWidth - imageWidth,
    y: window.innerHeight - imageHeight,
  };

  if (newPosition.x < min.x) newPosition.x = min.x;
  if (newPosition.x > max.x) newPosition.x = max.x;
  if (newPosition.y < min.y) newPosition.y = min.y;
  if (newPosition.y > max.y) newPosition.y = max.y;

  return newPosition;
}

function EasterEgg() {
  const [gamepad, setGamepad] = useState<Gamepad | null>(null);

  const input: XY = {
    x: 0,
    y: 0
  };

  const speed: Vector = {
    magnitude: 0,
    angle: 0
  };

  const [position, setPosition] = useState<XY>({
    x: window.innerWidth / 2 - imageWidth / 2,
    y: window.innerHeight / 2 - imageWidth / 2,
  });

  const [rotation, setRotation] = useState<number>(0);

  // Wheel tracks
  const [wheelBackLeft, setWheelBackLeft] = useState<Point[]>([]);

  // Add gamepad event listener
  useEffect(() => {
    function listener(event: GamepadEvent) {
      setGamepad(event.gamepad);
    }

    function keydownListener(event: KeyboardEvent) {
      if (event.key === "ArrowUp") {
        input.y = -1;
      }
      if (event.key === "ArrowDown") {
        input.y = 1;
      }
      if (event.key === "ArrowLeft") {
        input.x = -1;
      }
      if (event.key === "ArrowRight") {
        input.x = 1;
      }
    }

    function keyupListener(event: KeyboardEvent) {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        input.y = 0;
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        input.x = 0;
      }
    }

    window.addEventListener("gamepadconnected", listener);
    window.addEventListener("keydown", keydownListener);
    window.addEventListener("keyup", keyupListener);

    return () => {
      window.removeEventListener("gamepadconnected", listener);
      window.removeEventListener("keydown", keydownListener);
      window.removeEventListener("keyup", keyupListener);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    let previousTimestamp = 0;

    const tick: FrameRequestCallback = (timestamp) => {
      const deltaMs = timestamp - previousTimestamp;

      if (gamepad) {
        const leftStick = gamepad.axes.slice(0, 2);
        input.x = leftStick[0];
        input.y = leftStick[1];
      }

      speed.magnitude = input.y * maxSpeed;
      speed.angle += input.x * maxRotationRate * Math.PI / 180 * (deltaMs / 1000);

      setPosition((oldPosition) => {
        // Process wheel tracks
        setWheelBackLeft((oldWheelBackLeft) => {
          return Math.abs(speed.magnitude) > 0 ? [...oldWheelBackLeft.filter(point => point.timestamp + wheelTrackPeriod > timestamp), {
            x: oldPosition.x + imageWidth / 2,
            y: oldPosition.y + imageHeight / 2,
            timestamp: timestamp,
          }] : [
            ...oldWheelBackLeft.filter(point => point.timestamp + wheelTrackPeriod > timestamp),
          ];
        });

        // Process rotation
        setRotation(speed.angle);

        return processPosition(oldPosition, speed, deltaMs);
      });

      previousTimestamp = timestamp;
      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  }, [gamepad]);

  return (
    <>
      <svg style={{
        zIndex: 1000,
        fill: "blue",
        fillOpacity: 0.5,
        position: "absolute",
        top: position.y,
        left: position.x,
        rotate: `${rotation}rad`,
        width: imageWidth,
        height: imageHeight
      }}>
        <rect width={imageWidth} height={imageHeight} />
      </svg >
      <svg style={{
        position: "absolute",
        top: 0,
        left: 0,
        minWidth: "100vw",
        minHeight: "100vh",
        zIndex: 999,
        fill: "none",
        stroke: "red",
        strokeWidth: 5,
      }}>

        <path d={`M ${wheelBackLeft.map(point => `${point.x} ${point.y}`).join(" L ")}`}></path>
      </svg>
    </>
  );
}

export default EasterEgg;
