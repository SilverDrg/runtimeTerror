import { useEffect, useState }  from "react"

function TrafficSigns(props) {
    const [trafficSigns, setTrafficSigns] = useState([]);
      useEffect(function() {
          const getTrafficSigns = async function() {
              const res = await fetch('http://localhost:3001/camera');
              const data = await res.json();
              console.log("TrafficSigns from api: \n" + data);
              setTrafficSigns(data);
          };
          getTrafficSigns();
      }, []);
      console.log(trafficSigns);
  
      return trafficSigns;
}

export default TrafficSigns;