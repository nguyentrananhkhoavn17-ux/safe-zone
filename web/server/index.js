const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Simple stub: returns a GeoJSON FeatureCollection with one sample polygon
app.get('/api/v1/hazards', (req, res) => {
  const sample = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'Vùng nguy hiểm mẫu - Ma Pi Lèng (demo)',
          risk_level: 'high'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [105.414,22.430],
              [105.425,22.430],
              [105.425,22.440],
              [105.414,22.440],
              [105.414,22.430]
            ]
          ]
        }
      }
    ]
  }
  res.json(sample)
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`API stub listening on http://localhost:${port}`))
