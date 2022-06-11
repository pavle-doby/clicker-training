import { useEffect, useState } from "react";
import { Digit } from "../Digit/Digit.component";
import "./NumberDisplay.style.scss";

export function NumberDisplay({
  value,
  maxLength,
}: {
  value: string;
  maxLength?: number;
}) {
  const [valueArr, setValueArr] = useState<string[]>([]);

  useEffect(() => {
    // TODO: Handle nullish value
    const lenVal = value.toString().length;
    const lenMax = maxLength || lenVal;
    const diff = lenMax - lenVal;
    const tempValArr = value.toString().split("");
    const arr = new Array<string>(lenMax)
      .fill("")
      .map((_, i) => (i >= diff ? tempValArr.shift() : ""));

    setValueArr(arr as string[]);
  }, [value, maxLength]);

  return (
    <>
      {valueArr.map((num, index) => (
        <Digit key={index} number={num}></Digit>
      ))}
    </>
  );
}
