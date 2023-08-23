import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { Image, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useSelector } from "react-redux";

import MainScreen from "./src/App/Index";
import Login from "./src/App/Login/Index";
import { ThemeContext } from "./src/App/Style/ThemeContext";
import reduxStore from "./src/storage/reduxStore";
import UserStorage from "./src/storage/UserStorage";
import UserAPI from "./src/Api/memberAPI";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
}

const App = () => {
  const isLogged = useSelector(UserStorage.isUserLoggedInSelector);
  const isUserDataLoading = useSelector(UserStorage.isUserDataLoadingSelector);
  const profile = useSelector(UserStorage.userProfileSelector);

  const [showImage, setShowImage] = useState(true);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    UserStorage.loadUserDataOnStartUp();

    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      alert(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      // @ts-ignore
      Notifications.removeNotificationSubscription(notificationListener.current);
      // @ts-ignore
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [isUserDataLoading]);

  useEffect(() => {
    if (isUserDataLoading) setShowImage(true);
    else
      setTimeout(() => {
        setShowImage(false);
      }, 1000);
  }, [isUserDataLoading]);

  if (showImage)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <Image
          source={require("./assets/maphant_logo_eng.jpeg")}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
        />
      </View>
    );
  return <>{isLogged && !isUserDataLoading && profile?.state === 1 ? <MainScreen /> : <Login />}</>;
};

const AppWrapper = () => {
  const isDarkModeContext = React.useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <RootSiblingParent>
          <SafeAreaProvider>
            <Provider store={reduxStore}>
              <NavigationContainer theme={isDarkModeContext[0] ? DarkTheme : DefaultTheme}>
                <ThemeContext.Provider value={isDarkModeContext}>
                  <App />
                </ThemeContext.Provider>
              </NavigationContainer>
            </Provider>
          </SafeAreaProvider>
        </RootSiblingParent>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default AppWrapper;
