import { useTheme } from "@react-navigation/native";
import { Text } from "react-native";

const H2 = (style: object) => {
  const theme = useTheme();

  return <Text style={{ color: theme.colors.text, ...style }}></Text>;
};
export default H2;
