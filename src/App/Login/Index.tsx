import { createStackNavigator } from "@react-navigation/stack";

import SigninRoutes from "../../Navigator/SigninRoutes";

const Stack = createStackNavigator();

// eslint-disable-next-line react/display-name
export default () => (
  <Stack.Navigator initialRouteName="Login">
    {SigninRoutes.map(route => (
      <Stack.Screen
        name={route.name}
        component={route.component}
        options={route.options}
        key={route.name}
      />
    ))}
    <Stack.Screen name="Uncertified" component={SigninRoutes[6].component} />
  </Stack.Navigator>
);
