import { Link } from 'react-router-dom';

function Image(props) {
    console.log('image id: ' + props.image._id);
    var image = props.image;
    return (
        <div className="container col-sm-10 mx-auto my-3 bg-light border border-light rounded">
            <h5 className="card-title">{image.src}</h5>
        </div>
    );
}

export default Image;