import { Popup, CircleMarker } from 'react-leaflet'

function MarkerCar(props) {
    var car = props.car;
    var fillColor;
    if(car.numberOfCars < 3) {
        fillColor = { fillColor: 'green', color: 'green' }
    } else {
        fillColor = { fillColor: 'red', color: 'red' }
    }

    return(
        <CircleMarker center={[car.location.latitude, car.location.longditude]} pathOptions={fillColor} radius={20}>
            <Popup><p>Number of cars seen: <br/> { car.numberOfCars }</p></Popup>
        </CircleMarker>
    )
}

export default MarkerCar;