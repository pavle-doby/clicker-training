import { NumberDisplay } from "@/shared/components/NumberDisplay/NumberDisplay.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { LEVEL_LIST } from "@/shared/enums/Level.enum";

import { useEffect, useRef, useState } from "react";
import {
  finalize,
  fromEvent,
  interval,
  scan,
  Subscription,
  takeUntil,
  tap,
  timer,
} from "rxjs";
import "./Game.style.scss";
import { Trophy } from "@/shared/models/Trophy.model";

enum Color {
  SUCCESS = "#27a844",
  PRIMARY = "#007aff",
  INFO = "#16a2b7",
  WARNING = "#fec107",
  DANGER = "#dc3546",
  DARK = "#353a40",
}

const COLOR_LIST = [
  Color.SUCCESS,
  Color.PRIMARY,
  Color.INFO,
  Color.WARNING,
  Color.DANGER,
  Color.DARK,
];

/**
 * Config
 */
const config = {
  initCount: 0,
  // Clicks
  countMsLimit: 1000,
  countClickMax: 3,
  // Idle
  idleSecondsLimit: 10,
  // Overdrive
  overdriveChance: 5, // in %
  overdriveDuration: 10, // in seconds
  overdriveAddition: 2,
  // Trophy
  countForTrophy: 10,
  onDecrementRemoveTrophy: false,
};

export function Game({}) {
  /**
   * Ref Elements
   */
  const buttonEle = useRef(null);

  /**
   * State
   */
  let newNumber: number = config.initCount;
  const [number, setNumber] = useState<string>(newNumber.toString());
  const [numberOverdrive, setNumberOverdrive] = useState<number>(
    config.overdriveDuration
  );
  const [isInOverdrive, setIsInOverdrive] = useState<boolean>(false);
  const [buttonColor, setButtonColor] = useState<string>(COLOR_LIST[0]);
  const [listTrophy, setListTrophy] = useState<Trophy[]>([]);

  let trophyCount = 0;
  let trophyList: Trophy[] = [];

  function updateNumber(num: number): void {
    newNumber = num;
    setNumber(newNumber.toString());
  }

  let countMs = 100;
  function initCountMs() {
    countMs += 100;
  }
  function resetCountMs() {
    countMs = 100;
  }

  let countClick = 0;
  function incrCountClick() {
    countClick += 1;
  }
  function resetCountClick() {
    countClick = 0;
  }

  // Idle User
  let hasClicked = false;
  let countIdleSeconds = 1;
  let colorIndex = 0;

  /**
   * The bigger is colorIndex the bigger the danger
   */
  function incrColorIndex() {
    colorIndex += colorIndex === COLOR_LIST.length - 1 ? 0 : 1;
    setButtonColor(COLOR_LIST[colorIndex]);
  }

  /**
   * The lower is colorIndex the lower the danger
   */
  function decrColorIndex() {
    colorIndex -= colorIndex === 0 ? 0 : 1;
    setButtonColor(COLOR_LIST[colorIndex]);
  }

  let isOverdriveOn = false;
  function toTurnOnOverdrive() {
    return Math.random() < config.overdriveChance / 100;
  }

  useEffect(() => {
    let intervalSub$: Subscription;
    let intervalObs$ = interval(100).pipe(
      tap(() => {
        if (countMs === config.countMsLimit) {
          resetCountClick();
          resetCountMs();
        } else {
          initCountMs();
        }
      })
    );

    let tempNewNum;
    let decremetSub$: Subscription;
    let decremetObs$ = interval(1000).pipe(
      tap(() => {
        if (countIdleSeconds >= config.idleSecondsLimit && !hasClicked) {
          tempNewNum = newNumber - 1;
          const toRemoveTrophy =
            tempNewNum % config.countForTrophy === config.countForTrophy - 1;

          if (config.onDecrementRemoveTrophy && toRemoveTrophy) {
            trophyList.shift();
            setListTrophy(trophyList);
            trophyCount--;
          }

          updateNumber(tempNewNum);

          if (countIdleSeconds % config.idleSecondsLimit === 0) {
            incrColorIndex();
          }
        }

        countIdleSeconds += 1;
        hasClicked = false;
      })
    );

    let overdriveSub$: Subscription;
    let overdriveObs$ = interval(1000).pipe(
      scan((count) => count + 1, 0),
      tap((count) => {
        setNumberOverdrive(config.overdriveDuration - count);
      }),
      takeUntil(timer(config.overdriveDuration * 1000 + 1)),
      finalize(() => {
        isOverdriveOn = false;
        setIsInOverdrive(false);
        setNumberOverdrive(config.overdriveDuration);
      })
    );

    let isFirstClick: boolean = false;
    const clicksObs$ = fromEvent(buttonEle.current, "click");
    const clicksSub$ = clicksObs$
      .pipe(
        scan((count) => count + 1, 0),
        tap((count) => {
          incrCountClick();
          isFirstClick = false;

          if (!isOverdriveOn && toTurnOnOverdrive()) {
            isOverdriveOn = true;
            setIsInOverdrive(true);
            overdriveSub$ = overdriveObs$.subscribe();
          }

          if (count === 1) {
            isFirstClick = true;
            intervalSub$ = intervalObs$.subscribe();
            decremetSub$ = decremetObs$.subscribe();
          }
        })
      )
      .subscribe(() => {
        hasClicked = true;
        countIdleSeconds = 1;
        decrColorIndex();

        if (
          countClick > config.countClickMax &&
          countMs < config.countMsLimit
        ) {
          // Do nothing because user has clicked max number of times for limited time
          return;
        }

        tempNewNum = newNumber + (isOverdriveOn ? config.overdriveAddition : 1);
        const passDiff = tempNewNum % config.countForTrophy;
        const isGettingTrophy = passDiff <= config.overdriveAddition - 1;
        const trophyScore = tempNewNum - passDiff;
        const hasAlreadyTrophy = trophyList.some(
          (trophy) => trophy.score === trophyScore
        );

        if (isGettingTrophy && !hasAlreadyTrophy && !isFirstClick) {
          trophyList.unshift(
            new Trophy({
              name: LEVEL_LIST[trophyCount],
              score: trophyScore,
              index: trophyCount,
            })
          );

          setListTrophy(trophyList);

          trophyCount++;
          trophyCount =
            trophyCount === LEVEL_LIST.length ? trophyCount - 1 : trophyCount;
        }
        updateNumber(tempNewNum);
      });

    return () => {
      clicksSub$?.unsubscribe();
      intervalSub$?.unsubscribe();
      decremetSub$?.unsubscribe();
      overdriveSub$?.unsubscribe();
    };
  }, []);

  return (
    <div className="game flex-row width-100">
      <div className="flex-column flex-center width-100">
        <h1 className="heading-h2 mb-48">Trophies</h1>

        <div className="game__trophy-list">
          {listTrophy.map((trophy, index) => (
            <div key={index} className="flex-column flex-center">
              <div className="game__trophy-icon">
                <FontAwesomeIcon icon={faTrophy} />
              </div>
              <div>{trophy.score}</div>
              <h3 className="heading-3">{trophy.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-column flex-center width-100">
        <h1 className="heading-hero mb-48">Clicker</h1>

        <div className="flex-column flex-center mb-48">
          <h3 className={`heading-3`}>
            {isInOverdrive ? "🔥 Overdrive Mode 🔥" : "Overdrive Mode"}
          </h3>
          <div
            className={`game__overdrive-number ${
              isInOverdrive && "c-white bg-success"
            }`}
          >
            <b>{numberOverdrive}</b>
          </div>
        </div>

        <div className="game__body">
          <div className="game__score width-100">
            <NumberDisplay value={number} maxLength={3}></NumberDisplay>
          </div>
          <button
            ref={buttonEle}
            className="game__click-me mt-48"
            style={{
              backgroundColor: buttonColor,
            }}
          >
            Click Me!
            <i className="fa fa-camera-retro"></i>
          </button>
        </div>
      </div>

      <div className="width-100">{/* Placeholder */}</div>
    </div>
  );
}
