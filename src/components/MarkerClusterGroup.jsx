import { createPathComponent } from '@react-leaflet/core'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

const createClusterGroup = (props, context) => {
  const clusterGroup = L.markerClusterGroup({
    chunkedLoading: true,
    maxClusterRadius: props.maxClusterRadius || 45,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    animate: true,
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount()
      return L.divIcon({
        html: `<div class="tourmate-cluster-inner"><span>${count}</span></div>`,
        className: 'custom-tourmate-cluster',
        iconSize: L.point(44, 44),
        iconAnchor: [22, 22],
      })
    },
    ...props,
  })

  return {
    instance: clusterGroup,
    context: { ...context, layerContainer: clusterGroup },
  }
}

const updateClusterGroup = (_instance, _props, _prevProps) => {}

const MarkerClusterGroup = createPathComponent(createClusterGroup, updateClusterGroup)

export default MarkerClusterGroup
