export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET requests allowed" });
  }

  const city = (req.query.city || "").trim();

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
        city
      )}&country=India&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "SymptomCare-App (AB-Talks-Capstone-Project)",
        },
      }
    );

    if (!geoResponse.ok) {
      throw new Error("Geocoding service failed");
    }

    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      return res.status(200).json({ clinics: [] });
    }

    const lat = parseFloat(geoData[0].lat);
    const lon = parseFloat(geoData[0].lon);

    const overpassQuery = `
      [out:json][timeout:15];
      (
        node["amenity"="hospital"](around:5000,${lat},${lon});
        node["amenity"="clinic"](around:5000,${lat},${lon});
        node["amenity"="doctors"](around:5000,${lat},${lon});
      );
      out center 15;
    `;

    const overpassResponse = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: overpassQuery,
      }
    );

    if (!overpassResponse.ok) {
      throw new Error("Places service failed");
    }

    const overpassData = await overpassResponse.json();

    const clinics = (overpassData.elements || [])
      .filter((place) => place.tags && place.tags.name)
      .slice(0, 8)
      .map((place) => ({
        name: place.tags.name,
        type: place.tags.amenity,
        address:
          place.tags["addr:street"] ||
          place.tags["addr:full"] ||
          "Address not available",
        lat: place.lat,
        lon: place.lon,
        mapLink: https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=17/${place.lat}/${place.lon},
      }));

    return res.status(200).json({ clinics });
  } catch (err) {
    console.error("Nearby clinics error:", err);
    return res.status(500).json({
      error: "Something went wrong finding clinics. Please try again.",
      clinics: [],
    });
  }
}
