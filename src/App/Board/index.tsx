import { createStackNavigator } from "@react-navigation/stack";

import Routes from "../../Navigator/BoardRoute";

const Stack = createStackNavigator();
export default function BoardIndex(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Board" component={Routes[0].component} />
      <Stack.Screen name="QnABoard" component={Routes[1].component} />
      <Stack.Screen name="DetailList" component={Routes[2].component} />
      <Stack.Screen name="QnAdetail" component={Routes[3].component} />
      <Stack.Screen name="BoardDetail" component={Routes[4].component} />
      <Stack.Screen name="Post" component={Routes[5].component} />
      <Stack.Screen name="editPost" component={Routes[6].component} />
      <Stack.Screen name="QA_answer" component={Routes[7].component} />
      <Stack.Screen name="HotBoard" component={Routes[8].component} />
      <Stack.Screen name="HotDetailList" component={Routes[9].component} />
      <Stack.Screen name="VoteBoard" component={Routes[10].component} />
      <Stack.Screen name="VoteDetailList" component={Routes[11].component} />
      <Stack.Screen
        name="Profile"
        component={Routes[12].component}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
