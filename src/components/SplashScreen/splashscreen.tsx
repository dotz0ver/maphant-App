import { ActivityIndicator, Image, StyleSheet,View } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.splashContainer}>
      <Image source={require("../../../assets/maphant_logo.jpeg")} style={styles.splashImage} />
      <ActivityIndicator size="large" color="#5299EB" />
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  splashImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
});

export default SplashScreen;
