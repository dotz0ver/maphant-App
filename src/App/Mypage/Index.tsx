import { createStackNavigator } from "@react-navigation/stack";

import Routes from "../../Navigator/MypageRoute";

const Stack = createStackNavigator();

export default function MypageIndex() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Mypage"
        component={Routes[0].component}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PasswordCheck" component={Routes[1].component} />
      <Stack.Screen name="ProfileModify" component={Routes[2].component} />
      <Stack.Screen name="Mypost" component={Routes[3].component} />
      <Stack.Screen name="BoardDetail" component={Routes[4].component} />
      <Stack.Screen name="Bookmark" component={Routes[5].component} />
      <Stack.Screen name="Mycomment" component={Routes[6].component} />
      <Stack.Screen name="editPost" component={Routes[7].component} />
      {/* <Stack.Screen
        name="Profile"
        component={Routes[7].component}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen name="WriteBoard" component={Routes[8].component} />
      <Stack.Screen name="WriteContent" component={Routes[9].component} />
      <Stack.Screen name="LikeContent" component={Routes[10].component} /> */}
      {/* <Stack.Screen
        name="Chatroom"
        component={Routes[11].component}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen name="Mylike" component={Routes[13].component} />
    </Stack.Navigator>
  );
}
