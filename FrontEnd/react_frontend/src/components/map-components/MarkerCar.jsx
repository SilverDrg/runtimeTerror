import { Popup, CircleMarker } from 'react-leaflet'

function MarkerCar(props) {
    var car = props.car;
    var fillColor;
    if(car.numberOfCars > 2) {
        fillColor = { fillColor: 'red', color: 'red' }
    } else if (car.numberOfCars < 3 && car.numberOfCars > 1){
        fillColor = { fillColor: 'orange', color: 'orange' }
    } else {
        fillColor = { fillColor: 'green', color: 'green' }
    }

    return(
        <CircleMarker center={[car.location.latitude, car.location.longditude]} pathOptions={fillColor} radius={20}>
            <Popup>
                <p>Number of cars seen: <br/> { car.numberOfCars }</p>
                <p>Average speed: <br/> { car.averageSpeed }</p>
            </Popup>
        </CircleMarker>
    )
}

export default MarkerCar;