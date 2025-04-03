import { createContext, createSignal, useContext } from "solid-js";
import type { ParentComponent } from "solid-js";

const debuffs = [
  { key: "Dark_Water_III", icon: "/imgs/Dark_Water_III.png" },
  { key: "Shadoweye", icon: "/imgs/Shadoweye.png" },
  { key: "16_Dark_Blizzard_III", icon: "/imgs/Dark_Blizzard_III.png", timer: 16 },
  { key: "29_Dark_Blizzard_III", icon: "/imgs/Dark_Blizzard_III.png", timer: 29 },
  { key: "16_Dark_Fire_III", icon: "/imgs/Dark_Fire_III.png", timer: 16 },
  { key: "29_Dark_Fire_III", icon: "/imgs/Dark_Fire_III.png", timer: 29 },
];

const positions = {
  Dark_Water_III: [
    [
      { x: 135, y: 120 },
      { x: 265, y: 120 },
    ],
    [
      { x: 200, y: 200 },
      { x: 200, y: 200 },
    ],
  ],
  Shadoweye: [
    [
      { x: 200, y: 85 },
      { x: 200, y: 85 },
    ],
    [
      { x: 50, y: 295 },
      { x: 350, y: 295 },
    ],
  ],
  "16_Dark_Blizzard_III": [
    [
      { x: 28, y: 255 },
      { x: 372, y: 255 },
    ],
    [
      { x: 200, y: 100 },
      { x: 200, y: 100 },
    ],
    [
      { x: 200, y: 200 },
      { x: 200, y: 200 },
    ],
  ],
  "29_Dark_Blizzard_III": [
    [
      { x: 28, y: 255 },
      { x: 372, y: 255 },
    ],
    [
      { x: 200, y: 100 },
      { x: 200, y: 100 },
    ],
    [
      { x: 200, y: 200 },
      { x: 200, y: 200 },
    ],
  ],
  "16_Dark_Fire_III": [
    [
      { x: 150, y: 300 },
      { x: 250, y: 300 },
    ],
    [
      { x: 200, y: 100 },
      { x: 200, y: 100 },
    ],
    [
      { x: 200, y: 200 },
      { x: 200, y: 200 },
    ],
  ],
  "29_Dark_Fire_III": [
    [
      { x: 200, y: 100 },
      { x: 200, y: 100 },
    ],
    [
      { x: 100, y: 200 },
      { x: 300, y: 200 },
    ],
  ],
};

export type Coords = { x: number; y: number };
export interface Debuff {
  key: string;
  icon: string;
  timer?: number;
}

interface QuizContextType {
  clicks: () => Coords[];
  setClicks: (value: Coords[] | ((prev: Coords[]) => Coords[])) => void;
  streak: () => number;
  setStreak: (value: number | ((prev: number) => number)) => void;
  debuff: () => Debuff | null;
  setDebuff: (value: Debuff | null) => void;
  timeLimit: () => number;
  setTimeLimit: (value: number) => void;
  isTimerActive: () => boolean;
  setTimerActive: (value: boolean) => void;
  checkAccuracy: () => void;
  selectRandomDebuff: () => void;
  isDone: () => boolean;
  setDoneStatus: (value: boolean) => boolean;
  timeLeft: () => number;
  startTimer: () => void;
  resetTimer: () => void;
}

const QuizContext = createContext<QuizContextType>();

export const QuizProvider: ParentComponent = (props) => {
  const [clicks, setClicks] = createSignal<Coords[]>([]);
  const [streak, setStreak] = createSignal(0);
  const [debuff, setDebuff] = createSignal<Debuff | null>(null);
  const [isDone, setDoneStatus] = createSignal(false);
  const [timeLimit, setTimeLimit] = createSignal(10);
  const [isTimerActive, setTimerActive] = createSignal(false);
  const [timeLeft, setTimeLeft] = createSignal(timeLimit());
  let timerInterval: number | null = null;

  const startTimer = () => {
    setTimeLeft(timeLimit());
    setTimerActive(true);

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          alert("You died!");
          clearInterval(timerInterval!);
          setTimerActive(false);
          setStreak(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    setTimeLeft(30);
    setTimerActive(false);
  };

  const selectRandomDebuff = () => {
    const i = Math.floor(Math.random() * debuffs.length);
    if (debuffs[i] === debuff()) selectRandomDebuff();

    setDebuff(debuffs[i]);
  };

  const checkAccuracy = (range = 20) => {
    if (!debuff()) return;

    // @ts-ignore - it just works lol
    const correctPositions: Coords[][] = positions[debuff()?.key!] || [];
    let score = 0;

    console.log(correctPositions);

    clicks().forEach((c, idx) => {
      let closeDist = Infinity,
        closePos!: Coords;

      correctPositions[idx]?.forEach((pos) => {
        const dist = Math.hypot(pos.x - c.x, pos.y - c.y);
        if (dist < closeDist) {
          closeDist = dist;
          closePos = pos;
        }
      });

      if (closePos) {
        if (Math.abs(closePos.x - c.x) < range && Math.abs(closePos.y - c.y) < range) score++;
      }
    });

    if (score > 0) setStreak(streak() + 1);
    else setStreak(0);
  };

  return (
    <QuizContext.Provider
      value={{
        clicks,
        setClicks,
        streak,
        setStreak,
        debuff,
        setDebuff,
        checkAccuracy,
        timeLimit,
        setTimeLimit,
        timeLeft,
        isTimerActive,
        setTimerActive,
        selectRandomDebuff,
        isDone,
        setDoneStatus,
        startTimer,
        resetTimer,
      }}
    >
      {props.children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error("useQuiz must be used within a QuizProvider");
  return context;
};
