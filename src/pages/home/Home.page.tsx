import { updateHomeState } from "@/store/home/home.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import "./Home.style.scss";

export function Home({}) {
  const dispatch = useAppDispatch();
  const userName = useAppSelector((state) => state.home.userName);
  const title = useAppSelector((state) => state.home.title);

  function updateUserName(userName: string): void {
    dispatch(updateHomeState({ userName }));
  }

  return (
    <div className="home flex-jc-center">
      <div>
        <p>Our guest: {userName}</p>
        <h1 className="heading-1">{title}</h1>
        <input
          type="text"
          onChange={(event) => updateUserName(event.target.value)}
        />
      </div>
    </div>
  );
}
