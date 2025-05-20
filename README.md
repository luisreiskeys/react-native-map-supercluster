# react-native-map-supercluster

A lightweight, dependency-minimized library for clustering markers on **react-native-maps**. Built as a modern alternative and continuation of the now unmaintained `react-native-map-clustering`.

<p align="center" >
  <img src="./assets/IOSDemo.gif" height="400" style="margin-right: 10px;" />
  <img src="./assets/AndroidDemo.gif" height="400" />
</p>

[![npm version](https://img.shields.io/npm/v/react-native-map-supercluster.svg)](https://www.npmjs.com/package/react-native-map-supercluster)
[![MIT License](https://img.shields.io/npm/l/react-native-map-supercluster.svg)](LICENSE)
[![Downloads](https://img.shields.io/npm/dm/react-native-map-supercluster.svg)](https://www.npmjs.com/package/react-native-map-supercluster)

---

## Features

- Smooth marker clustering and rendering
- Minimal setup, no native linking required
- Fully compatible with `react-native-maps`
- Support for color ranges and customization
- Native performance via `supercluster` with no external geo dependencies

---

## Installation

```bash
npm install react-native-map-supercluster
```

or with yarn:

```bash
yarn add react-native-map-supercluster
```

You also need `react-native-maps` installed and configured in your project.

---

## Usage

```tsx
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";
import ClusteredMapView from "react-native-map-supercluster";

const markers = [
  <Marker key="1" coordinate={{ latitude: -19.92, longitude: -43.94 }} />,
  <Marker key="2" coordinate={{ latitude: -19.93, longitude: -43.95 }} />,
  <Marker key="3" coordinate={{ latitude: -19.91, longitude: -43.96 }} />,
];

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <ClusteredMapView
        initialRegion={{
          latitude: -19.92,
          longitude: -43.94,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        style={StyleSheet.absoluteFillObject}
      >
        {markers}
      </ClusteredMapView>
    </View>
  );
}
```

---

## Props

| Prop                           | Type                           | Default                                        | Description                                                                                                                                                                                                                  |
| ------------------------------ | ------------------------------ | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clusteringEnabled`            | `boolean`                      | `true`                                         | Enable or disable clustering.                                                                                                                                                                                                |
| `spiralEnabled`                | `boolean`                      | `true`                                         | Enable spiderfy behavior when overlapping markers.                                                                                                                                                                           |
| `animationEnabled`             | `boolean`                      | `true`                                         | Enable layout animation when clusters update.                                                                                                                                                                                |
| `preserveClusterPressBehavior` | `boolean`                      | `false`                                        | If true, clusters will not zoom in on press unless explicitly handled.                                                                                                                                                       |
| `layoutAnimationConf`          | `LayoutAnimationConfig`        | —                                              | Custom layout animation config.                                                                                                                                                                                              |
| `tracksViewChanges`            | `boolean`                      | `false`                                        | Set on `Marker` components for performance.                                                                                                                                                                                  |
| `useAndroidColorScale`         | `boolean`                      | `false`                                        | ⚠️ **Important for Android**: If your custom cluster components (e.g. SVG, View) are being clipped or cut off, set this to `true`. This disables custom cluster rendering and instead uses the default static image cluster. |
| `radius`                       | `number`                       | `50`                                           | Cluster radius.                                                                                                                                                                                                              |
| `maxZoom`                      | `number`                       | `20`                                           | Maximum zoom level to cluster.                                                                                                                                                                                               |
| `minZoom`                      | `number`                       | `1`                                            | Minimum zoom level to cluster.                                                                                                                                                                                               |
| `minPoints`                    | `number`                       | `2`                                            | Minimum number of points to form a cluster.                                                                                                                                                                                  |
| `extent`                       | `number`                       | `512`                                          | Tile extent (usually remains at 512).                                                                                                                                                                                        |
| `nodeSize`                     | `number`                       | `64`                                           | Node size for supercluster.                                                                                                                                                                                                  |
| `edgePadding`                  | `object`                       | `{ top: 50, left: 50, right: 50, bottom: 50 }` | Padding used when fitting to cluster bounds.                                                                                                                                                                                 |
| `clusterColor`                 | `string`                       | `#00B386`                                      | Default background color of clusters.                                                                                                                                                                                        |
| `clusterTextColor`             | `string`                       | `#FFFFFF`                                      | Default text color inside cluster.                                                                                                                                                                                           |
| `clusterFontFamily`            | `string`                       | —                                              | Font family to apply to cluster text.                                                                                                                                                                                        |
| `spiderLineColor`              | `string`                       | `#FF0000`                                      | Color of spiderfy lines when a cluster is expanded.                                                                                                                                                                          |
| `selectedClusterId`            | `string`                       | —                                              | Highlight a specific cluster.                                                                                                                                                                                                |
| `selectedClusterColor`         | `string`                       | —                                              | Color to use for the selected cluster.                                                                                                                                                                                       |
| `superClusterRef`              | `React.MutableRefObject`       | `{ current: null }`                            | Get direct access to the SuperCluster instance.                                                                                                                                                                              |
| `mapRef`                       | `React.Ref<Map>`               | —                                              | Expose `MapView` reference.                                                                                                                                                                                                  |
| `onClusterPress`               | `(cluster, markers) => void`   | `() => {}`                                     | Called when a cluster is pressed.                                                                                                                                                                                            |
| `onRegionChangeComplete`       | `(region) => void`             | `() => {}`                                     | Triggered when map region changes.                                                                                                                                                                                           |
| `onMarkersChange`              | `(markers) => void`            | `() => {}`                                     | Triggered when visible markers change.                                                                                                                                                                                       |
| `getClusterEngine`             | `(engine) => void`             | —                                              | Returns the raw supercluster engine.                                                                                                                                                                                         |
| `renderCluster`                | `(cluster) => React.ReactNode` | —                                              | Provide a custom cluster renderer.                                                                                                                                                                                           |

---

## Expo Support

🚨 **Warning:** Due to current architectural limitations in Expo Go, dynamic cluster rendering may result in crashes or unresponsiveness. We recommend using **React Native CLI** for production apps. A future update may introduce Expo compatibility.

## Credits

This package is inspired by [`react-native-map-clustering`](https://github.com/tomekvenits/react-native-map-clustering) by @tomekvenits. As that library is no longer maintained, we built this from scratch to continue its legacy and simplify clustering logic.

---

## License

MIT © 2025 [Luís-Reis]
