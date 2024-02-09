import { makeStyles, shorthands } from "@fluentui/react-components";
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

const debug = true; // TODO Put in environment variable

const imageWidth = 200; // Width of the image in pixels
const imageHeight = 100; // Height of the image in pixels

const deadZone = 0.1; // Dead zone for the gamepad sticks
const steeringWheelResponse = 0.03; // Rate of response for the steering wheel (0 no response, 1 immediate response)
const throttleResponse = 0.002; // Rate of response for the throttle (0 no response, 1 immediate response)

const maxSpeed = 300; // Maximum speed in pixels per second
const maxRotationRate = 120; // Maximum rotation rate in degrees per second

const wheelTrackPeriod = 2000; // Time in milliseconds that the wheel tracks are visible

const useStyles = makeStyles({
  wheelTracks: {
    position: "fixed",
    top: 0,
    left: 0,
    minWidth: "100vw",
    minHeight: "100vh",
    zIndex: 998,
    fill: "none",
    stroke: "red",
    pointerEvents: "none",
  },
  car: {
    position: "fixed",
    zIndex: 999,
    pointerEvents: "none",
    fill: "blue",
    fillOpacity: 0.5,
    transformOrigin: `${(1 - axleDistance / imageWidth) * 100}% 50%`, // Rotate around the front wheels (TODO breaks the wheel tracks)
  },
  debug: {
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    rowGap: "1rem",
    top: 0,
    left: 0,
    zIndex: 1000,
    backgroundColor: "#000000DF",
    ...shorthands.padding("1rem")
  },
  pressed: {
    fontWeight: "bolder",
    color: "green",
  }
});

/**
 * Smoothly transitions from the current value to the target value
 * @param current - The current value
 * @param target - The target value
 * @param rate - The rate of transition
 * @returns - The new value
 */
function smooth(current: number, target: number, rate: number = 0.1): number {
  return current + (target - current) * rate;
}

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
  const styles = useStyles();
  const [gamepad, setGamepad] = useState<Gamepad | null>(null);

  const input: XY = {
    x: 0,
    y: 0
  };

  let steeringWheel = 0;
  let throttle = 0;

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
  const [wheelTracks, setWheelTracks] = useState<Point[][]>([[], [], [], []]);

  // Add gamepad event listener
  useEffect(() => {
    function listener(event: GamepadEvent) {
      setGamepad(event.gamepad);
    }

    function keydownListener(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowUp":
          input.y = -1;
          break;
        case "ArrowDown":
          input.y = 1;
          break;
        case "ArrowLeft":
          input.x = -1;
          break;
        case "ArrowRight":
          input.x = 1;
          break;
      }
    }

    function keyupListener(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowUp":
          if (input.y === -1) input.y = 0;
          break;
        case "ArrowDown":
          if (input.y === 1) input.y = 0;
          break;
        case "ArrowLeft":
          if (input.x === -1) input.x = 0;
          break;
        case "ArrowRight":
          if (input.x === 1) input.x = 0;
          break;
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
        steeringWheel = smooth(steeringWheel, gamepad.axes[0], steeringWheelResponse);
        throttle = smooth(throttle, gamepad.axes[4] - gamepad.axes[3], throttleResponse);

        input.x = Math.abs(steeringWheel) > deadZone ? steeringWheel : 0;
        input.y = Math.abs(throttle) > deadZone ? throttle : 0;
      }

      speed.angle += input.x * maxRotationRate * Math.PI / 180 * (deltaMs / 1000);
      speed.magnitude = input.y * maxSpeed;

      setPosition((oldPosition) => {
        // Process wheel tracks
        setWheelTracks((oldWheelTracks) => Math.abs(speed.magnitude) > 0 ? [[
          // Front right wheel
          ...oldWheelTracks[0].filter(point => point.timestamp + wheelTrackPeriod > timestamp), {
            x: (oldPosition.x + imageWidth / 2) - 80 * Math.cos(speed.angle) + 40 * Math.sin(speed.angle),
            y: (oldPosition.y + imageHeight / 2) - 40 * Math.cos(speed.angle) - 80 * Math.sin(speed.angle),
            timestamp: timestamp,
          }
        ], [
          // Front left wheel
          ...oldWheelTracks[1].filter(point => point.timestamp + wheelTrackPeriod > timestamp), {
            x: (oldPosition.x + imageWidth / 2) - 80 * Math.cos(speed.angle) - 40 * Math.sin(speed.angle),
            y: (oldPosition.y + imageHeight / 2) + 40 * Math.cos(speed.angle) - 80 * Math.sin(speed.angle),
            timestamp: timestamp,
          }
        ], [
          // Rear right wheel
          ...oldWheelTracks[2].filter(point => point.timestamp + wheelTrackPeriod > timestamp), {
            x: (oldPosition.x + imageWidth / 2) + 80 * Math.cos(speed.angle) + 40 * Math.sin(speed.angle),
            y: (oldPosition.y + imageHeight / 2) - 40 * Math.cos(speed.angle) + 80 * Math.sin(speed.angle),
            timestamp: timestamp,
          }
        ], [
          // Rear left wheel
          ...oldWheelTracks[3].filter(point => point.timestamp + wheelTrackPeriod > timestamp), {
            x: (oldPosition.x + imageWidth / 2) + 80 * Math.cos(speed.angle) - 40 * Math.sin(speed.angle),
            y: (oldPosition.y + imageHeight / 2) + 40 * Math.cos(speed.angle) + 80 * Math.sin(speed.angle),
            timestamp: timestamp,
          }
        ]
        ] : [
          ...oldWheelTracks.map(track => track.filter(point => point.timestamp + wheelTrackPeriod > timestamp))
        ]);

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
      <svg className={styles.car} style={{
        top: position.y,
        left: position.x,
        rotate: `${rotation}rad`,
        width: imageWidth,
        height: imageHeight,
      }}>
        <rect width={imageWidth} height={imageHeight} />
      </svg >
      <svg className={styles.wheelTracks}>
        {wheelTracks.map((track, i) => <path key={i} d={`M ${track.map(point => `${point.x} ${point.y}`).join(" L ")}`} />)}
      </svg>
      {debug && <div className={styles.debug}>
        <div>
          {gamepad && gamepad.axes.map((axis, i) =>
            <div key={i}>Axis {i}: {axis.toFixed(3)}</div>
          )}
        </div>
        <div>
          {gamepad && gamepad.buttons.map((button, i) =>
            <div
              key={i}
              className={button.pressed ? styles.pressed : undefined}
            >Button {i}: {button.value}</div>
          )}
        </div>
      </div>}
    </>
  );
}

export default EasterEgg;
