import * as MapBox from 'mapbox-gl'
import { along, booleanEqual } from '@turf/turf'
import { point } from '@turf/helpers'
import { getCoord } from '@turf/invariant'

import './style.css'

const map = new MapBox.Map({
  accessToken:
    'pk.eyJ1IjoiZGFpZ28zIiwiYSI6ImNrOHRpbnE5azAwb3czZW8za3d2aXkwYTcifQ.mgnG69sg5mZrpok19dLiWg',
  style: 'mapbox://styles/mapbox/light-v10',
  container: 'map',
  center: [139.6238001, 35.4670337],
  zoom: 19,
  pitch: 120,
  bearing: 90,
  antialias: true,
})

const featureCollection: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [139.62401568889618, 35.46705338178199],
          [139.62408542633057, 35.4670795960569],
          [139.62411761283875, 35.467166976911514],
          [139.62504029273984, 35.46659899965942],
          [139.62577521800995, 35.46668201196964],
          [139.62631165981293, 35.466349962214736],
          [139.627046585083, 35.46710581032323],
          [139.6271699666977, 35.46704901273534],
          [139.62776005268097, 35.467180084031526],
          [139.62835550308228, 35.467136393623186],
          [139.62832868099213, 35.46724561959949],
          [139.6283769607544, 35.46726309574195],
          [139.62841987609863, 35.467180084031526],
          [139.62836623191833, 35.467175714991754],
          [139.62835550308228, 35.46730678608144],
          [139.62843596935272, 35.46740727377218],
          [139.62869882583618, 35.46752960644362],
          [139.63274359703064, 35.468752922923414],
          [139.63289245963097, 35.468663359312494],
          [139.63299036026, 35.468735447104734],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [139.63301181793213, 35.468740908298464],
            [139.63289514183998, 35.46864916019427],
            [139.63293671607968, 35.4686251309116],
            [139.63304668664932, 35.468720155760245],
            [139.63301181793213, 35.468740908298464],
          ],
        ],
      },
    },
  ],
}

const draw = () => {
  map.addSource('feature-collection', {
    type: 'geojson',
    data: featureCollection,
  })

  map.addLayer({
    id: 'polygon',
    type: 'fill',
    source: 'feature-collection',
    filter: ['==', '$type', 'Polygon'],
    paint: {
      'fill-color': '#e55e5e',
      'fill-opacity': 0.8,
    },
  })

  map.addLayer({
    id: 'lines',
    type: 'line',
    source: 'feature-collection',
    filter: ['==', '$type', 'LineString'],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#555',
      'line-width': 3,
      'line-dasharray': [1, 2],
    },
  })

  // @ts-ignore
  const start = along(featureCollection.features[0], 0, {
    units: 'meters',
  })

  // @ts-ignore
  map.addSource('footPrint', { type: 'geojson', data: start })
  map.addLayer({
    id: 'footPrint',
    type: 'circle',
    source: 'footPrint',
    paint: {
      'circle-color': '#e55e5e',
      'circle-radius': 10,
    },
  })

  let tick = 0
  // @ts-ignore
  let lastCoords = getCoord(start)

  const step = () => {
    // @ts-ignore
    const next = along(featureCollection.features[0], tick + 1.5, {
      units: 'meters',
    })
    // @ts-ignore
    map.getSource('footPrint').setData(next)
    const coords = getCoord(next)
    // @ts-ignore
    map.panTo(coords)

    // @ts-ignore
    if (booleanEqual(point(lastCoords), point(coords))) {
      return
    }

    tick += 1
    // @ts-ignore
    lastCoords = coords
    window.requestAnimationFrame(step)
  }

  window.requestAnimationFrame(step)
}

map.on('load', draw)
