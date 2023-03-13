import axios from 'axios';
export { searchImages };

async function searchImages(searchQuery, page, perPage) {
  const apiKey = `34197852-03b7352fc2ee661f306011b94`;
  const BASE_URL = `https://pixabay.com/api/`;

  const response = await axios.get(`${BASE_URL}?key=${apiKey}`, {
    params: {
      q: searchQuery,
      perPage: 40,
      page: page,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
  if (response.status !== 200) {
    throw new Error(response.status);
  }
  const images = await response.data;
  return images;
}

// const response = await axios.get(`${BASE_URL}?key=${API_KEY}`, {
//     params: {
//       q: searchword,
//       per_page: 40,
//       page: page,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//     },
