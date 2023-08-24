import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const styleMap: Map<Theme, object> = new Map();

const Styles: any = (theme: Theme) => {
  if (styleMap.has(theme)) return styleMap.get(theme);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderTopWidth: 1,
      borderTopColor: "#D8E1EC",
    },
    body: {
      borderBottomColor: "#D0D0D0",
      borderBottomWidth: 1,
      paddingVertical: 10,
      backgroundColor: theme.colors.card,
    },
    showbody: {
      borderBottomColor: "#D0D0D0",
      borderBottomWidth: 1,
      paddingVertical: 10,
    },
    head: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    body2: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    content: {
      flex: 1,
      justifyContent: "flex-start",
    },
    title: {
      color: theme.colors.text,
      fontSize: 16,
      justifyContent: "flex-start",
      fontWeight: "bold",
    },
  });

  styleMap.set(theme, styles);
  return styleMap.get(theme);
};
export default Styles;
