import { useEffect, useState } from "react";
import "./Digit.style.scss";

export function Digit({ number }: { number: string }) {
  const numDispayMap: Record<string, number[]> = {
    "-": [6],
    " ": [],
    "": [],
    "0": [0, 1, 2, 3, 4, 5],
    "1": [1, 2],
    "2": [0, 1, 6, 4, 3],
    "3": [0, 1, 6, 2, 3],
    "4": [5, 6, 1, 2],
    "5": [0, 5, 6, 2, 3],
    "6": [0, 5, 6, 2, 3, 4],
    "7": [0, 1, 2],
    "8": [0, 1, 2, 3, 4, 5, 6],
    "9": [0, 1, 2, 3, 5, 6],
  };

  const [activeList, setActiveList] = useState<number[]>([]);

  useEffect(() => {
    setActiveList(numDispayMap[number]);
  }, [number]);

  function isActive(num: number): boolean {
    return activeList.includes(num);
  }

  function activeClass(num: number): string {
    return isActive(num) ? "active" : "";
  }

  return (
    <div className="digit-wrapper">
      <div className="digit">
        {/* O */}
        <div className={`digit__bit ${activeClass(0)}`} data-index={0}>
          <div className="digit__bit-left"></div>
          <div className="digit__bit-right"></div>
        </div>

        {/* 5 */}
        <div
          className={`digit__bit ${activeClass(5)}`}
          data-index={5}
          style={{
            transform: "rotate(90deg) translateY(60px) translateX(20px)",
          }}
        >
          <div className="digit__bit-left"></div>
          <div className="digit__bit-right"></div>
        </div>

        {/* 1 */}
        <div
          className={`digit__bit ${activeClass(1)}`}
          data-index={1}
          style={{
            transform: "rotate(90deg) translateY(-60px) translateX(-20px)",
          }}
        >
          <div className="digit__bit-left"></div>
          <div className="digit__bit-right"></div>
        </div>

        {/* 6 */}
        <div className={`digit__bit ${activeClass(6)}`} data-index={6}>
          <div className="digit__bit-left"></div>
          <div className="digit__bit-right"></div>
        </div>

        {/* 4 */}
        <div
          className={`digit__bit ${activeClass(4)}`}
          data-index="4"
          style={{
            transform: "rotate(90deg) translateY(60px) translateX(20px)",
          }}
        >
          <div className="digit__bit-left"></div>
          <div className="digit__bit-right"></div>
        </div>

        {/* 2 */}
        <div
          className={`digit__bit ${activeClass(2)}`}
          data-index={2}
          style={{
            transform: "rotate(90deg) translateY(-60px) translateX(-20px)",
          }}
        >
          <div className="digit__bit-left"></div>
          <div className="digit__bit-right"></div>
        </div>

        {/* 3 */}
        <div className={`digit__bit ${activeClass(3)}`} data-index={3}>
          <div className="digit__bit-left"></div>
          <div className="digit__bit-right"></div>
        </div>
      </div>
    </div>
  );
}
