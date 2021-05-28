import React from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, Polyline, Polygon, Rectangle } from 'react-leaflet'
import stopsign from '../../resources/stop_sign.png'
import sign90 from '../../resources/90_sign.png'

const center = [46.5575, 15.645556]
const sign90location = [46.5654, 15.623756]

const fillBlueOptions = { fillColor: 'blue' }

class Map extends React.Component {
  render() {
    return (
      <div>
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css'></link>
        <MapContainer style={{ height: "720px" }}  center={center} zoom={15} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CircleMarker center={center} pathOptions={fillBlueOptions} radius={10}>
            <Popup><img src={stopsign} alt="Stop sign" style={{height: "48px", width: "48px"}}></img></Popup>
          </CircleMarker>
          <CircleMarker center={sign90location} pathOptions={fillBlueOptions} radius={10}>
            <Popup><img src={sign90} alt="Stop sign" style={{height: "48px", width: "48px"}}></img></Popup>
          </CircleMarker>
        </MapContainer>
      </div>
    ) 
  }
}

export default Map;