import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import {
  BottomTabNavigationEventMap,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { EventArg, EventListenerCallback } from "@react-navigation/native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Board from "./Board/index";
import Home from "./Home/Index";
import Mail from "./Mail/Index";
import Mypage from "./Mypage/Index";

const tabs: {
  name: string;
  icon: React.ReactNode;
  component: React.FC;
  showHeader?: boolean;
  useSafeArea?: boolean;
}[] = [
  {
    name: "홈",
    icon: <AntDesign name="home" size={24} color="#000" />,
    component: Home,
    useSafeArea: false,
  },
  {
    name: "게시판",
    icon: <FontAwesome5 name="book" size={24} color="#000" />,
    component: Board,
    useSafeArea: false,
  },
  {
    name: "메일",
    icon: <Ionicons name="mail" size={24} color="#000" />,
    component: Mail,
    useSafeArea: false,
  },
  {
    name: "내 정보",
    icon: <AntDesign name="user" size={24} color="#000" />,
    component: Mypage,
    useSafeArea: false,
  },
];

const Tab = createBottomTabNavigator();

// eslint-disable-next-line
const SafeAreaViewWrapper: React.FC<{ isSafeArea: boolean; children: any }> = ({
  isSafeArea = false,
  children,
}) => {
  if (isSafeArea) return <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>;
  return <>{children}</>;
};

const MainScreen: () => JSX.Element = () => {
  const [useSafeArea, setUseSafeArea] = React.useState(false);
  const setUseSafeAreaByRoute: EventListenerCallback<
    BottomTabNavigationEventMap,
    // @ts-ignore
    "state"
  > = (e: EventArg<"state", false, unknown>) => {
    // @ts-ignore
    const index = e?.data?.state.index ?? -1;
    if (index === -1) return true;

    return setUseSafeArea(tabs[index].useSafeArea ?? true);
  };

  return (
    <SafeAreaViewWrapper isSafeArea={useSafeArea}>
      <Tab.Navigator screenListeners={{ state: setUseSafeAreaByRoute }}>
        {tabs.map(tab => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{
              headerShown: tab.showHeader ?? false,
              tabBarIcon: () => tab.icon,
            }}
          />
        ))}
      </Tab.Navigator>
    </SafeAreaViewWrapper>
  );
};

export default MainScreen;
