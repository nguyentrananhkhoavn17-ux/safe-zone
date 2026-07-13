import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import { fetchHazards } from '../services/api'

export default function MapView() {
  const mapRef = useRef(null)

  useEffect(() => {
    mapRef.current = L.map('map').setView([16.0, 106.0], 6)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current)

    let geojsonLayer = null

    fetchHazards().then(data => {
      if (!data) return
      geojsonLayer = L.geoJSON(data, {
        style: feature => {
          const level = feature.properties && feature.properties.risk_level
          const color = level === 'high' ? '#e74c3c' : level === 'medium' ? '#f39c12' : '#f1c40f'
          return { color, weight: 2, fillOpacity: 0.3 }
        },
        onEachFeature: (feature, layer) => {
          const name = feature.properties && feature.properties.name
          const level = feature.properties && feature.properties.risk_level
          layer.bindPopup(`<b>${name || 'Vùng nguy hiểm'}</b><br/>Mức rủi ro: ${level}`)
        }
      }).addTo(mapRef.current)
      if (geojsonLayer && geojsonLayer.getBounds && !geojsonLayer.getBounds().isValid()) return
      if (geojsonLayer) mapRef.current.fitBounds(geojsonLayer.getBounds(), { maxZoom: 13 })
    })

    return () => {
      if (mapRef.current) mapRef.current.remove()
    }
  }, [])

  return <div id="map" style={{ flex: 1 }} />
}
