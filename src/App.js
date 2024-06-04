import logo from './logo.svg';
import './App.css';
import Autocomplete from './components/Autocomplete';
import { useState, useEffect } from 'react';

const queryString = (lat, lng) => {
  return `[out:json];
  (
    way["amenity"="bicycle_parking"](around:322,${lat},${lng});
    relation["amenity"="bicycle_parking"](around:322,${lat},${lng});
    node["amenity"="bicycle_parking"](around:322,${lat},${lng});
  );
  out body;`
}



function App() {

  const [hasRacks, setHasRacks] = useState("");
  
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  async function getRacks(lat, lng) {
    var result = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: 'data=' + queryString(lat, lng),
    });
  
  
    var data = await result.json();
    console.log(data);
    if (data.elements.length > 0) {
      setHasRacks("true");
    } else {
      setHasRacks("false");
    }
  }

  function setLocation(lat, lng) {
    setLat(lat);
    setLng(lng);
  }

  useEffect(() => {
    if (lat === 0 && lng === 0) {
      return;
    }
    console.log(lat, lng);
    setLocation(lat, lng);
    getRacks(lat, lng);
  }, [lat, lng]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          <Autocomplete callbackFn={setLocation} />
          <div>
            {
              hasRacks === "true" ? "There are bike racks nearby!" : hasRacks === "false" ? "There are no bike racks nearby!" : ""
            }
          </div>
      </header>
    </div>
  );
}

export default App;
