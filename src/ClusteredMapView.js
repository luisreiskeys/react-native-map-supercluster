/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  memo,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useMemo,
} from "react";
import MapView, { Polyline } from "react-native-maps";
import SuperCluster from "supercluster";
import ClusterMarker from "./ClusteredMarker";
import {
  isMarker,
  markerToGeoJSONFeature,
  calculateBBox,
  returnMapZoom,
} from "./helpers";

const ClusteredMapView = forwardRef(
  (
    {
      children,
      clusteringEnabled = true,
      spiralEnabled = true,
      animationEnabled = true,
      preserveClusterPressBehavior = false,
      layoutAnimationConf,
      tracksViewChanges = false,
      useAndroidColorScale = false,
      radius = 50,
      maxZoom = 20,
      minZoom = 1,
      minPoints = 2,
      extent = 512,
      nodeSize = 64,
      edgePadding = { top: 50, left: 50, right: 50, bottom: 50 },
      clusterColor = "#00B386",
      clusterTextColor = "#FFFFFF",
      clusterFontFamily,
      spiderLineColor = "#FF0000",
      onRegionChangeComplete = () => {},
      onClusterPress = () => {},
      onMarkersChange = () => {},
      superClusterRef = { current: null },
      mapRef: mapRefCallback,
      ...restProps
    },
    ref
  ) => {
    const [markers, setMarkers] = useState([]);
    const [spiderMarkers, setSpiderMarkers] = useState([]);
    const [otherChildren, setOtherChildren] = useState([]);
    const [superCluster, setSuperCluster] = useState(null);
    const [currentRegion, setCurrentRegion] = useState(
      restProps.region || restProps.initialRegion
    );

    const mapRef = useRef();
    const propsChildren = useMemo(
      () => React.Children.toArray(children),
      [children]
    );

    useEffect(() => {
      if (!clusteringEnabled) {
        setSpiderMarkers([]);
        setMarkers([]);
        setOtherChildren(propsChildren);
        setSuperCluster(null);
        return;
      }

      const rawData = [];
      const rest = [];

      propsChildren.forEach((child, index) => {
        if (isMarker(child)) {
          const feature = markerToGeoJSONFeature(child, index);
          if (
            feature &&
            Array.isArray(feature.geometry.coordinates) &&
            feature.geometry.coordinates.length === 2
          ) {
            rawData.push(feature);
          }
        } else {
          rest.push(child);
        }
      });

      const bBox = calculateBBox(currentRegion);
      const zoom = returnMapZoom(currentRegion, bBox, minZoom);
      const engine = new SuperCluster({
        radius,
        maxZoom,
        minZoom,
        minPoints,
        extent,
        nodeSize,
      });

      engine.load(rawData);
      const clusters = engine.getClusters(bBox, zoom);

      setMarkers(clusters);
      setOtherChildren(rest);
      setSuperCluster(engine);
      superClusterRef.current = engine;

      if (superCluster && currentRegion) {
        const bBox = calculateBBox(currentRegion);
        const zoom = returnMapZoom(currentRegion, bBox, minZoom);
        const clusters = superCluster.getClusters(bBox, zoom);
        setMarkers(clusters);
        onMarkersChange(clusters);
        onRegionChangeComplete(currentRegion, clusters);
      }
    }, [propsChildren, clusteringEnabled]);

    const handleRegionChange = (region) => {
      if (superCluster && region) {
        const bBox = calculateBBox(region);
        const zoom = returnMapZoom(region, bBox, minZoom);
        const clusters = superCluster.getClusters(bBox, zoom);
        setMarkers(clusters);
        onMarkersChange(clusters);
        onRegionChangeComplete(region, clusters);
        setCurrentRegion(region);
      } else {
        onRegionChangeComplete(region);
      }
    };
    const handleClusterPress = (cluster) => () => {
      if (!cluster?.properties?.cluster_id || !superCluster) {
        return;
      }

      const children = superCluster.getLeaves(
        cluster.properties.cluster_id,
        Infinity
      );

      if (preserveClusterPressBehavior) {
        onClusterPress(cluster, children);
        return;
      }

      const coordinates = children.map(({ geometry }) => ({
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
      }));

      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: restProps.edgePadding,
      });

      onClusterPress(cluster, children);
    };

    return (
      <MapView
        {...restProps}
        ref={(map) => {
          mapRef.current = map;
          if (ref) {
            ref.current = map;
          }
          mapRefCallback?.(map);
        }}
        googleRenderer="LEGACY"
        collapsable={false} // Essencial no Android
        onRegionChangeComplete={handleRegionChange}
      >
        {markers.map((marker) => {
          // ✔ Verificação segura na fonte
          if (
            !marker?.properties?.point_count ||
            marker.properties.point_count === 0
          ) {
            return propsChildren[marker?.properties?.index] ?? null;
          }

          return (
            <ClusterMarker
              key={`cluster-${marker.id}`}
              {...marker}
              onPress={handleClusterPress(marker)}
              clusterColor={clusterColor}
              clusterTextColor={clusterTextColor}
              clusterFontFamily={clusterFontFamily}
              tracksViewChanges={tracksViewChanges}
              useAndroidColorScale={useAndroidColorScale}
            />
          );
        })}

        {otherChildren}
        {spiderMarkers.map((marker, index) => (
          <Polyline
            key={index}
            coordinates={[marker.centerPoint, marker]}
            strokeColor={spiderLineColor}
            strokeWidth={1}
          />
        ))}
      </MapView>
    );
  }
);

export default memo(ClusteredMapView);
