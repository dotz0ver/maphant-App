import Alarm from "../App/Home/Alarm";
import Home from "../App/Home/Home";
import { RouteType } from "../types/Navigation";

const Routes: RouteType[] = [
  {
    name: "home",
    component: Home,
  },
  {
    name: "alarm",
    component: Alarm,
  },
];

export type NavigationProp = {
  home: undefined;
  alarm: number;
};

export default Routes;
