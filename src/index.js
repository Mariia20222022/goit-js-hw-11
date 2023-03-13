import './css/styles.css';
import { searchImages } from './search-images';
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
const searchForm = document.querySelector(`.search-form`);
const loadMoreButton = document.querySelector(`.load-more `);
const gallery = document.querySelector(`.gallery`);
searchForm.addEventListener(`submit`, onSearch);
loadMoreButton.addEventListener(`click`, onLoadMore);
loadMoreButton.style.display = `none`;
let searchQuery = ``;

let page = 1;
const lightbox = new SimpleLightbox('.gallery a');
const perPage = 40;
function onSearch(event) {
  event.preventDefault();
  cleanGallery();
  searchQuery = event.currentTarget.elements.searchQuery.value.trim();

  if (searchQuery !== ``) {
    searchImages(searchQuery, page, perPage)
      .then(data => {
        if (data.totalHits === 0) {
          Notiflix.Notify.failure(
            `Sorry, there are no images matching your search query. Please try again.`
          );
        } else {
          renderPhoto(data.hits);
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

          lightbox.refresh();
          loadMoreButton.style.display = `block`;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
}

function onLoadMore() {
  page += 1;

  searchImages(searchQuery, page, perPage).then(data => {
    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    } else {
      renderPhoto(data.hits);

      const totalPages = Math.ceil(data.totalHits / perPage);
      if (page > totalPages) {
        Notiflix.Notify.warning(
          `We're sorry, but you've reached the end of search results.`
        );
        loadMoreButton.style.display = 'block';
      }
    }
  });
}

function renderPhoto(images) {
  const markup = images
    .map(img => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = img;
      return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item" id="${id}">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function cleanGallery() {
  gallery.innerHTML = '';
  page = 1;
  loadMoreButton.style.display = 'none';
}
