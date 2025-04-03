import { useQuiz } from "../context/QuizContext";

const Settings = () => {
  const { timeLimit, setTimeLimit, isTimerActive, setTimerActive } = useQuiz();

  return (
    <div class="w-1/2 my-4 space-y-2 divide-y divide-stone-500/25">
      <h2 class="text-base opacity-25 py-1">Settings</h2>
      <div class="mt-2 text-sm">
        <label class="flex gap-2">
          Enable Timer:
          <input
            type="checkbox"
            class="max-w-16 text-center"
            checked={isTimerActive()}
            onInput={(e) => setTimerActive(e.currentTarget.checked)}
          />
        </label>
        <label class="flex gap-2">
          Time Limit (s):
          <input
            type="number"
            class="w-12 md:w-16 text-center border rounded-md"
            value={timeLimit()}
            onInput={(e) => setTimeLimit(parseInt(e.currentTarget.value))}
          />
        </label>
      </div>
    </div>
  );
};

export default Settings;
