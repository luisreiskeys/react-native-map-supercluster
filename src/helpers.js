export const isMarker = child => {
  const isValid =
    child &&
    child.props &&
    child.props.coordinate &&
    typeof child.props.coordinate.latitude === 'number' &&
    typeof child.props.coordinate.longitude === 'number';
  return isValid;
};

export const calculateBBox = region => {
  let lngD =
    region.longitudeDelta < 0
      ? region.longitudeDelta + 360
      : region.longitudeDelta;

  return [
    region.longitude - lngD, // min lng
    region.latitude - region.latitudeDelta, // min lat
    region.longitude + lngD, // max lng
    region.latitude + region.latitudeDelta, // max lat
  ];
};

export const returnMapZoom = (region, _bBox, minZoom) => {
  const angle = region.longitudeDelta;
  const zoom = Math.round(Math.log2(360 / angle));
  return Math.max(zoom, minZoom);
};

export const markerToGeoJSONFeature = (child, index) => {
  const {coordinate, identifier} = child.props;

  if (
    !coordinate ||
    typeof coordinate.latitude !== 'number' ||
    typeof coordinate.longitude !== 'number'
  ) {
    return null;
  }

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [coordinate.longitude, coordinate.latitude],
    },
    properties: {
      point_count: 0,
      index,
      identifier: identifier || `marker-${index}`,
    },
  };
};

export const generateSpiral = (marker, clusterChildren, markers, index) => {
  const {properties, geometry} = marker;
  const count = properties.point_count;
  const centerLocation = geometry.coordinates;

  let res = [];
  let angle = 0;
  let start = 0;

  for (let i = 0; i < index; i++) {
    start += markers[i].properties.point_count || 0;
  }

  for (let i = 0; i < count; i++) {
    angle = 0.25 * (i * 0.5);
    let latitude = centerLocation[1] + 0.0002 * angle * Math.cos(angle);
    let longitude = centerLocation[0] + 0.0002 * angle * Math.sin(angle);

    if (clusterChildren[i + start]) {
      res.push({
        index: clusterChildren[i + start].properties.index,
        longitude,
        latitude,
        centerPoint: {
          latitude: centerLocation[1],
          longitude: centerLocation[0],
        },
      });
    }
  }

  return res;
};

export const returnMarkerStyle = points => {
  if (points >= 50) {
    return {width: 84, height: 84, size: 64, fontSize: 20};
  }
  if (points >= 25) {
    return {width: 78, height: 78, size: 58, fontSize: 19};
  }
  if (points >= 15) {
    return {width: 72, height: 72, size: 54, fontSize: 18};
  }
  if (points >= 10) {
    return {width: 66, height: 66, size: 50, fontSize: 17};
  }
  if (points >= 8) {
    return {width: 60, height: 60, size: 46, fontSize: 17};
  }
  if (points >= 4) {
    return {width: 54, height: 54, size: 40, fontSize: 16};
  }
  return {width: 48, height: 48, size: 36, fontSize: 15};
};
