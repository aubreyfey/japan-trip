// Destination-specific images. Keep this mapping explicit to prevent accidental gallery reuse.
const destinationImages = {
  'Shibuya':'photo-1542051841857-5f90071e7989',
  'Meiji Jingu':'photo-1478436127897-769e1b3f0f36',
  'Harajuku':'photo-1503899036084-c55cdd92da26',
  'Shinjuku':'photo-1519501025264-65ba15a82390',
  'Senso-ji Temple':'photo-1528360983277-13d401cdc186',
  'Akihabara':'photo-1526481280695-3c687fd643ed',
  'Tokyo Station':'photo-1536098561742-ca998e48cbcc',
  'Odaiba':'photo-1493976040374-85c8e12f0f36',
  'Fushimi Inari Taisha':'photo-1493976040374-85c8e12f0c0e',
  'Gion':'photo-1545569341-9eb8b30979d9',
  'Yasaka Shrine':'photo-1528164344705-47542687000d',
  'Kiyomizu-dera':'photo-1505066218002-7e28c6f3e2ed',
  'Ninenzaka & Sannenzaka':'photo-1529539795054-3c162aab037a',
  'Arashiyama Bamboo Grove':'photo-1524413840807-0c3cb6fa808d'
};
places.forEach(place => {
  const image = destinationImages[place.name];
  if (image) place.image = `https://images.unsplash.com/${image}?auto=format&fit=crop&w=900&q=78`;
});
renderDay();
renderPlaces();
