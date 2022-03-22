import { NumberDisplay } from "@/shared/components/NumberDisplay/NumberDisplay.component";
import { useState } from "react";
import "./Game.style.scss";

export function Game({}) {
  function rnd(): number {
    return Math.round(Math.random() * 1000);
  }
  const [number, setNum] = useState<string>("007");

  function handleClick() {
    setNum(rnd().toString());
  }

  // useEffect(() => {
  //   setInterval(() => handleClick(), 1000);
  // }, []);

  return (
    <div className="flex-column flex-center">
      <h1 className="heading-hero mb-48">Clicker</h1>
      <div className="game__body">
        <div className="game__score width-100">
          <NumberDisplay value={number} maxLength={3}></NumberDisplay>
        </div>
        <button className="game__click-me mt-48" onClick={handleClick}>
          Click Me!
        </button>
      </div>
    </div>
  );
}
