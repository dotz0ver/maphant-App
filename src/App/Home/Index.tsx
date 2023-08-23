import { createStackNavigator } from "@react-navigation/stack";

import Routes from "../../Navigator/HomeRoute";
//

const Stack = createStackNavigator();

export default function HomeIndex() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Routes[0].component} options={{ headerShown: false }} />
      <Stack.Screen name="alarm" component={Routes[1].component} />
    </Stack.Navigator>
  );
}
