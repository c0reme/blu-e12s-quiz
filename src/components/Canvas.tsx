import { onMount } from "solid-js";
import { useQuiz, type Coords } from "../context/QuizContext";
import * as fabric from "fabric";

const Canvas = () => {
  const {
    clicks,
    debuff,
    setClicks,
    checkAccuracy,
    selectRandomDebuff,
    isDone,
    setDoneStatus,
    isTimerActive,
    startTimer,
    resetTimer,
  } = useQuiz();

  let canvasRef!: HTMLCanvasElement;
  let canvas!: fabric.Canvas;

  const drawArena = () => {
    canvas.clear();
    for (let i = 0; i < 16; i++) {
      canvas.add(new fabric.Line([i * 25, 0, i * 25, 400], { stroke: "gray", selectable: false }));
      canvas.add(new fabric.Line([0, i * 25, 400, i * 25], { stroke: "gray", selectable: false }));
    }

    // draws the traffic lights
    for (let i = 0; i < 8; i++) {
      if (i === 4) continue;
      const angle = (i * (2 * Math.PI)) / 8 - Math.PI / 2;
      canvas.add(
        new fabric.Circle({
          left: 200 + 185 * Math.cos(angle) - 16 / 1.5,
          top: 200 + 185 * Math.sin(angle) - 16 / 1.5,
          radius: 16 / 1.5,
          fill: i !== 0 ? "red" : "yellow",
          selectable: false,
        })
      );
    }

    // draws the waypoints
    for (let i = 0; i < 8; i++) {
      const angle = (i * (2 * Math.PI)) / 8 - Math.PI / 2;
      canvas.add(
        new fabric.Circle({
          left: 200 + 95 * Math.cos(angle) - 16 / 1.5,
          top: 200 + 95 * Math.sin(angle) - 16 / 1.5,
          radius: 16 / 1.5,
          fill: "gray",
          opacity: 0.5,
          selectable: false,
        })
      );
    }
  };

  const drawArrowToIcon = (from: Coords, to: Coords) => {
    const fLength = 0.8;
    const dx = to.x - from.x,
      dy = to.y - from.y;
    const nX = from.x + dx * fLength,
      nY = from.y + dy * fLength;

    canvas.add(
      new fabric.Line([from.x, from.y, nX, nY], {
        stroke: "white",
        strokeWidth: 3,
        selectable: false,
      })
    );
    canvas.add(
      new fabric.Triangle({
        left: nX,
        top: nY,
        width: 10,
        height: 12,
        angle: Math.atan2(dy, dx) * (180 / Math.PI) + 90,
        fill: "white",
        originX: "center",
        originY: "center",
        selectable: false,
      })
    );
  };

  const placePlayerIcon = (point: Coords, label = "") => {
    fabric.FabricImage.fromURL("imgs/Player.png").then((img) => {
      img.set({
        left: point.x - 16,
        top: point.y - 16,
        scaleX: 0.5,
        scaleY: 0.5,
        selectable: false,
      });
      canvas.add(img);
      canvas.add(
        new fabric.FabricText(label, {
          left: point.x - 5,
          top: point.y + 20,
          fontSize: 16,
          fill: "white",
          fontFamily: "monospace",
          fontWeight: "bold",
          selectable: false,
        })
      );
    });
  };

  const handleQuizButton = () => {
    if (isDone()) checkAccuracy();

    setDoneStatus(false);
    setClicks([]);
    drawArena();
    selectRandomDebuff();

    if (isTimerActive()) {
      resetTimer();
      startTimer();
    }
  };

  onMount(() => {
    canvas = new fabric.Canvas(canvasRef, {
      width: 400,
      height: 400,
      selection: false,
      hoverCursor: "pointer",
    });
    drawArena();
    selectRandomDebuff();

    if (isTimerActive()) startTimer();

    canvas.on("mouse:down", ({ e }) => {
      const pointer = canvas.getViewportPoint(e);
      const pos = { x: pointer.x, y: pointer.y };

      if (!isDone()) setDoneStatus(true);

      setClicks((prev) => {
        const clicks = [...prev, pos];
        placePlayerIcon(pos);

        if (clicks.length > 1) {
          drawArrowToIcon(clicks[clicks.length - 2], pos);
        }

        return clicks;
      });
    });
  });

  return (
    <>
      <div class="inline-flex gap-2 items-center">
        <button
          class="m-auto text-sm h-8 w-20 max-w-fit border border-stone-400 bg-stone-100 hover:bg-stone-200 dark:border-stone-500 dark:bg-stone-900 dark:hover:bg-stone-800 px-6 rounded-2xl cursor-pointer transition-all"
          on:click={() => handleQuizButton()}
        >
          {isDone() ? "Done" : "Skip"}
        </button>
        <span class="inline-flex gap-2 items-center">
          Debuff:
          {debuff() && (
            <>
              <img src={debuff()?.icon} alt={debuff()?.key} width={32} height={32} />
              {debuff()?.timer && <span class="text-base">({debuff()?.timer}s)</span>}
            </>
          )}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        class="border-4 border-stone-600 rounded-full shadow-lg my-2"
      ></canvas>
    </>
  );
};

export default Canvas;
