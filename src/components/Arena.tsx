import { QuizProvider } from "../context/QuizContext";
import Canvas from "./Canvas";
import Display from "./Display";
import Settings from "./Settings";

const Arena = () => {
  return (
    <QuizProvider>
      <div class="flex flex-col items-center font-mono">
        <Display />
        <Canvas />
        <Settings />
      </div>
    </QuizProvider>
  );
};

export default Arena;
