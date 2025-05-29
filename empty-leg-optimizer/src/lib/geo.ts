export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // earth radius in km

  //convert degrees to radians for trig calculations
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  //calculate differences in coordinates
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  //calculate haversine formula components
  //a = sin²(Δφ/2) + cos(φ1)·cos(φ2)·sin²(Δλ/2)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  //calculate great circle distance
  //c = 2·atan2(√a, √(1−a))
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //return distance in kilometers
  return R * c;
}
