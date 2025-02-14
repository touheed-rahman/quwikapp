export async function fetchOSMData() {
    const query = `
    [out:json];
    area["name"="India"]->.india;
    (
      relation["admin_level"="4"](area.india); // States
      relation["admin_level"="6"](area.india); // Districts
      node["place"="city"](area.india); // Cities
      node["place"="town"](area.india); // Towns
    );
    out body;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.elements.map(item => ({
        name: item.tags.name,
        type: item.tags.place || 'area',
        state: item.tags['addr:state'] || 'Unknown',
        lat: item.lat,
        lon: item.lon
    }));
}
