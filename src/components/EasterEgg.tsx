import { useEffect, useState } from "react";

type XY = { x: number; y: number };

const imageWidth = 200; // Width of the image in pixels
const deadZone = 0.07; // Deadzone for analog sticks (0-1)
const maxSpeed = 300; // Maximum speed (pixels per second)
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
function processRotation(speed: XY, oldRotation: number, rAxis: number) {
  const targetRotation = Math.atan(speed.y / speed.x); // New target rotation

  let delta =
    oldRotation -
    targetRotation +
    (rAxis * Math.PI) / 4 + // Include rotation from the right stick (Tokyo Drift!)
    (speed.x >= 0 ? Math.PI : 0); // Invert rotation if moving right

  if (Math.abs(delta) > Math.PI) delta -= Math.sign(delta) * Math.PI * 2; // Prevent rotation over 180 degrees

  const newRotation = oldRotation - delta * rotationResponse;

  return isNaN(newRotation)
    ? isNaN(oldRotation)
      ? 0
      : oldRotation
    : newRotation;
}

function EasterEgg() {
  const [gamepad, setGamepad] = useState<Gamepad | null>(null);
  const [, setSpeed] = useState<XY>({
    x: 0,
    y: 0,
  });
  const [position, setPosition] = useState<XY>({
    x: window.innerWidth / 2 - imageWidth / 2,
    y: window.innerHeight / 2 - imageWidth / 2,
  });
  const [rotation, setRotation] = useState<number>(0);

  // Add gamepad event listener
  useEffect(() => {
    function listener(event: GamepadEvent) {
      setGamepad(event.gamepad);
    }

    window.addEventListener("gamepadconnected", listener);

    return () => window.removeEventListener("gamepadconnected", listener);
  }, []);

  // Animation loop
  useEffect(() => {
    let previousTimestamp = 0;

    const tick: FrameRequestCallback = (timestamp) => {
      if (!gamepad) return;

      const deltaMs = timestamp - previousTimestamp;
      const leftStick = gamepad.axes.slice(0, 2);
      const rightStick = gamepad.axes.slice(2, 4);

      setSpeed((oldSpeed) => {
        setRotation((oldRotation) => {
          setPosition((oldPosition) =>
            processPosition(oldSpeed, oldPosition, oldRotation)
          );

          return processRotation(oldSpeed, oldRotation, rightStick[0]);
        });

        return processSpeed(oldSpeed, leftStick[0], leftStick[1], deltaMs);
      });

      previousTimestamp = timestamp;
      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  }, [gamepad]);

  return (
    gamepad && (
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
          }}
          alt="Vroom!"
        />
        <svg>
          <path d=""></path>
        </svg>
      </>
    )
  );
}

export default EasterEgg;
