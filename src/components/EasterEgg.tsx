import { makeStyles } from "@fluentui/react-components";
import { useEffect, useState } from "react";

type XY = { x: number; y: number; };

type Point = {
  x: number;
  y: number;
  timestamp: number;
};

const useStyles = makeStyles({
  car: {
    color: "red",
  }
});

const imageWidth = 200; // Width of the image in pixels
const imageHeight = 200; // Height of the image in pixels
const deadZone = 0.07; // Deadzone for analog sticks (0-1)
const maxSpeed = 7; // Maximum speed (pixels per second)
const maxAcceleration = 10; // Maximum acceleration (pixels per second^2)
// const maxRotation = Math.PI / 4; // Maximum rotation (radians per second)
const rotationResponse = 0.15; // Rotation responsiveness. 0 = no response 1 = instant response

/**
 * Calculate the new speed based on the left stick.
 */
function processSpeed(
  oldSpeed: XY,
  xAxis: number,
  yAxis: number,
  deltaMs: number
) {
  const newSpeed: XY = {
    x: oldSpeed.x,
    y: oldSpeed.y,
  };

  const targetSpeed: XY = {
    x: xAxis * maxSpeed,
    y: yAxis * maxSpeed,
  };

  // Deadzone
  if (Math.abs(xAxis) < deadZone) targetSpeed.x = 0;
  if (Math.abs(yAxis) < deadZone) targetSpeed.y = 0;

  // Difference between current speed and desired speed
  const delta: XY = {
    x: oldSpeed.x - (targetSpeed.x * deltaMs) / 1000,
    y: oldSpeed.y - (targetSpeed.y * deltaMs) / 1000,
  };

  newSpeed.x = oldSpeed.x - ((maxAcceleration * deltaMs) / 1000) * delta.x;
  newSpeed.y = oldSpeed.y - ((maxAcceleration * deltaMs) / 1000) * delta.y;

  return newSpeed;
}

/**
 * Calculate the new position based on the speed.
 */
function processPosition(speed: XY, oldPosition: XY, rotation: number) {
  const newPosition: XY = { x: oldPosition.x, y: oldPosition.y };

  newPosition.x += speed.x;
  newPosition.y += speed.y;

  // Constrain position
  const min: XY = {
    x: 0 - ((1 - Math.cos(rotation)) * imageWidth) / 2,
    y: 0 - ((1 - Math.sin(rotation)) * imageWidth) / 2,
  };

  const max: XY = {
    x: window.innerWidth - ((1 - Math.cos(rotation)) * imageWidth) / 2,
    y: window.innerHeight - ((1 - Math.sin(rotation)) * imageWidth) / 2,
  };

  if (newPosition.x < min.x) newPosition.x = min.x;
  if (newPosition.y < min.y) newPosition.y = min.y;
  if (newPosition.x > max.x) newPosition.x = max.x;
  if (newPosition.y > max.y) newPosition.y = max.y;

  return newPosition;
}

/**
 * Calculate the new rotation based on the speed and the right stick.
 */
function processRotation(speed: XY, oldRotation: number, drift: number) {
  const targetRotation = Math.atan(speed.y / speed.x); // New target rotation

  let delta =
    oldRotation -
    targetRotation +
    (drift * Math.PI) / 4 + // Include rotation from the right stick (Tokyo Drift!)
    (speed.x >= 0 ? Math.PI : 0); // Invert rotation if moving right

  if (Math.abs(delta) > Math.PI) delta -= Math.sign(delta) * Math.PI * 2; // Prevent rotation over 180 degrees


  let newRotation = oldRotation - delta * rotationResponse;

  // Constrain rotation
  if (newRotation < 0) newRotation += Math.PI * 2;
  if (newRotation > Math.PI * 2) newRotation -= Math.PI * 2;

  return isNaN(newRotation)
    ? isNaN(oldRotation)
      ? 0
      : oldRotation
    : newRotation;
}

function EasterEgg() {
  const styles = useStyles();
  const [gamepad, setGamepad] = useState<Gamepad | null>(null);

  const input: XY = {
    x: 0,
    y: 0
  };

  const speed: XY = {
    x: 0,
    y: 0
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
        input.y = -maxSpeed;
      }
      if (event.key === "ArrowDown") {
        input.y = maxSpeed;
      }
      if (event.key === "ArrowLeft") {
        input.x = -maxSpeed;
      }
      if (event.key === "ArrowRight") {
        input.x = maxSpeed;
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

      const targetSpeed: XY = {
        x: input.x * maxSpeed,
        y: input.y * maxSpeed
      };

      setRotation((oldRotation) => {
        setPosition((oldPosition) => {

          setWheelBackLeft(oldPoints => [oldPoints
            .filter(point => point.timestamp + 10000 > timestamp), {
            x: (oldPosition.x + imageWidth / 2) + ((imageWidth / 2) * Math.cos(oldRotation)),
            y: (oldPosition.y + imageHeight / 2) + ((imageHeight / 2) * Math.sin(oldRotation)),
            timestamp
          }]
            .flat());
          return processPosition(speed, oldPosition, oldRotation);
        }
        );

        return processRotation(speed, oldRotation, 0);
      });

      const newSpeed = processSpeed(speed, targetSpeed.x, targetSpeed.y, deltaMs);
      speed.x = newSpeed.x;
      speed.y = newSpeed.y;

      previousTimestamp = timestamp;
      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  }, [gamepad]);

  return (
    <>
      <img
        src="https://www.svgrepo.com/download/393056/car-citroen-top-vehicle.svg"
        style={{
          position: "absolute",
          rotate: `${rotation}rad`,
          top: position.y,
          left: position.x,
          zIndex: 1000,
          width: `${imageWidth}px`,
          overflowX: "hidden",
          overflowY: "hidden",
        }}
        className={styles.car}
        alt="Vroom!"
      />
      <svg style={{
        position: "absolute",
        top: 0,
        left: 0,
        minWidth: "100vw",
        minHeight: "100vh",
        fill: "none",
        stroke: "black",
        strokeWidth: 4,
        zIndex: 999
      }}>
        <path d={`M ${wheelBackLeft.map(point => `${point.x} ${point.y}`).join(" L ")}`}></path>
      </svg>
    </>
  );
}

export default EasterEgg;
