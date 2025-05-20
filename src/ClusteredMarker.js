import React, { memo } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Marker } from "react-native-maps";
import { returnMarkerStyle } from "./helpers";

const getClusterColor = (points) => {
  if (points <= 4) return "#275D38";
  if (points <= 9) return "#3B7D4F";
  if (points <= 19) return "#4E944F";
  if (points <= 39) return "#827E3F";
  if (points <= 59) return "#A6733A";
  if (points <= 99) return "#BF5F34";
  if (points <= 199) return "#C44E4E";
  if (points <= 299) return "#A13131";
  if (points <= 499) return "#801E1E";
  return "#4B0B0B";
};
const ClusteredMarker = ({
  geometry,
  properties,
  onPress,
  clusterColor,
  clusterTextColor,
  clusterFontFamily,
  tracksViewChanges,
  useAndroidColorScale = false,
}) => {
  const points = properties.point_count;
  const { fontSize } = returnMarkerStyle(points);

  if (Platform.OS === "android" && useAndroidColorScale) {
    const color = getClusterColor(points);
    return (
      <Marker
        key={`${geometry.coordinates[0]}_${geometry.coordinates[1]}`}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
        onPress={onPress}
        anchor={{ x: 0.5, y: 0.5 }} // Centro exato da View
        tracksViewChanges={tracksViewChanges}
      >
        <View
          style={[
            styles.fixedContainer,
            {
              backgroundColor: color,
            },
          ]}
        >
          <Text style={[styles.fixedText]}>{points}</Text>
        </View>
      </Marker>
    );
  }

  // Modo padrão
  const { width, height, size } = returnMarkerStyle(points);
  return (
    <Marker
      key={`${geometry.coordinates[0]}_${geometry.coordinates[1]}`}
      coordinate={{
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
      }}
      style={{ zIndex: points + 1 }}
      onPress={onPress}
      tracksViewChanges={tracksViewChanges}
    >
      <TouchableOpacity
        activeOpacity={0.5}
        style={[styles.container, { width, height }]}
        collapsable={false}
        renderToHardwareTextureAndroid
        shouldRasterizeIOS
      >
        <View
          style={[
            styles.wrapper,
            {
              backgroundColor: clusterColor,
              width,
              height,
              borderRadius: width / 2,
            },
          ]}
        />
        <View
          style={[
            styles.cluster,
            {
              backgroundColor: clusterColor,
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text
            style={[
              styles.text,
              {
                color: clusterTextColor,
                fontSize,
                fontFamily: clusterFontFamily,
              },
            ]}
          >
            {points}
          </Text>
        </View>
      </TouchableOpacity>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    position: "absolute",
    opacity: 0.5,
    zIndex: 0,
  },
  cluster: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  text: {
    fontWeight: "bold",
  },
  fixedContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  fixedText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default memo(ClusteredMarker);
