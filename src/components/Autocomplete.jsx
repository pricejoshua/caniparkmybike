import React, { useRef, useEffect, useState } from 'react';

const Autocomplete = ({ callbackFn }) => {
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const loadScript = (url, callback) => {
      let script = document.createElement('script');
      script.type = 'text/javascript';

      if (script.readyState) {
        script.onreadystatechange = () => {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {
        script.onload = () => {
          callback();
        };
      }

      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    };

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`, () => {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['geometry']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        callbackFn(place.geometry.location.lat(), place.geometry.location.lng());
        setAddress(place.geometry.viewport.toString());
      });

      autocompleteRef.current = autocomplete;
    });
  }, []);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter an address"
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
    </div>
  );
};

export default Autocomplete;
