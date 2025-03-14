
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(new Error('Current location is unavailable. Make sure that location services are enabled'));
        }
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};

export const searchLocation = async (query) => {

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const mockLocations = {
    "City Hospital": { latitude: 37.78825, longitude: -122.4324 },
    "Central Medical Center": { latitude: 37.77825, longitude: -122.4224 },
    "Emergency Care Unit": { latitude: 37.79825, longitude: -122.4424 },
    "General Hospital": { latitude: 37.76825, longitude: -122.4124 },
    "Trauma Center": { latitude: 37.80825, longitude: -122.4524 },
  }

  if (mockLocations[query]) {
    return mockLocations[query]
  } else {
    return {
      latitude: 37.78825 + (Math.random() - 0.5) * 0.02,
      longitude: -122.4324 + (Math.random() - 0.5) * 0.02,
    }
  }
}

export const calculateRoute = async (origin, destination, isEmergencyMode) => {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  

  const numPoints = 10
  const route = []

  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints

    const jitter = isEmergencyMode ? 0.0005 : 0.001 
    const randomLat = (Math.random() - 0.5) * jitter
    const randomLng = (Math.random() - 0.5) * jitter

    route.push({
      latitude: origin.latitude + (destination.latitude - origin.latitude) * fraction + randomLat,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * fraction + randomLng,
    })
  }

  return route
}

// In a real implementation, you would use the Google Directions API like this:
/*
export const calculateRoute = async (origin, destination, isEmergencyMode) => {
  try {
    const mode = isEmergencyMode ? 'DRIVING' : 'DRIVING';
    const avoidTolls = !isEmergencyMode;
    
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&avoid=${avoidTolls ? 'tolls' : ''}&key=${apiKey}`;
    
    const response = await fetch(url);
    const json = await response.json();
    
    if (json.status !== 'OK') {
      throw new Error('Directions request failed');
    }
    
    // Decode the polyline
    const points = json.routes[0].overview_polyline.points;
    const route = decodePolyline(points);
    
    return route;
  } catch (error) {
    console.error('Error calculating route:', error);
    throw error;
  }
};

// Helper function to decode Google's polyline format
function decodePolyline(encoded) {
  const poly = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    
    shift = 0;
    result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    
    const point = {
      latitude: lat / 1e5,
      longitude: lng / 1e5
    };
    
    poly.push(point);
  }
  
  return poly;
}
*/

