import { useQuiz } from "../context/QuizContext";

const Display = () => {
  const { streak, isTimerActive, timeLeft } = useQuiz();

  return (
    <div class="grid text-xl items-center space-y-2 divide-y divide-stone-500/25">
      <h2 class="text-[16px] pb-4">Streak: {streak()}</h2>
      {isTimerActive() && <h2 class="text-[16px] text-red-500">Time Left: {timeLeft()}s</h2>}
    </div>
  );
};

export default Display;
