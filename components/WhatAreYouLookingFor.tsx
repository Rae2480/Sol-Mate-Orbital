import React from "react";
import { Image, StyleSheet, ImageSourcePropType } from "react-native";

const WhatAreYouLookingFor: React.FC = () => {
  return (
    <Image
      style={styles.whatAreYouLookingFor}
      resizeMode="cover"
      source={require("../assets/what-are-you-looking-for.png") as ImageSourcePropType}
    />
  );
};

const styles = StyleSheet.create({
  whatAreYouLookingFor: {
    width: 430,
    height: 932,
    overflow: "hidden",
  },
});

export default WhatAreYouLookingFor;
