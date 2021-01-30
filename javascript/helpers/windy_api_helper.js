import safeHTML from 'html-template-tag';
import store from 'store2';

const axios = require('axios');

axios.defaults.baseURL = 'https://api.windy.com/api/webcams/v2';
axios.defaults.headers['x-windy-key'] = process.env.WINDY_API_KEY;

export default class WindyApiHelper {
  static getWebcams(target, offset, submit) {
    const submitButton = submit;

    window.history.pushState('', '', './');

    axios({
      method: 'get',
      url: `/list/limit=10,${offset}${this.checkedLiveQuery()}${this.selectedCategoryQuery()}${this.selectedCountriesQuery()}${this.selectedContinentQuery()}`,
      params: {
        show:
          'webcams:category,location,player,property,statistics;categories;properties;continents;countries',
      },
    })
      .then((response) => {
        this.constructWebcamHTML(response, target, offset);

        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        submitButton.disabled = false;
      });
  }

  static getFavouriteWebcams(target, offset) {
    const webcamsTarget = target;
    const favourites = JSON.parse(store.get('favourites'));

    window.history.pushState('', '', 'favourites');

    if (favourites.length > 0) {
      axios({
        method: 'get',
        url: `/list/limit=25/webcam=${JSON.parse(store.get('favourites')).join(
          ','
        )}`,
        params: {
          show:
            'webcams:category,location,player,property,statistics;categories;properties;continents;countries',
        },
      })
        .then((response) => {
          this.constructWebcamHTML(response, target, offset);

          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      webcamsTarget.textContent = 'No favourite webcams saved.';
    }
  }

  static constructWebcamHTML(response, target, offset) {
    const webcamsContainer = target;
    const { webcams } = response.data.result;
    const totalWebcams = response.data.result.total;

    webcams.forEach((webcam) => {
      const { title } = webcam;

      const player = webcam.player.day.embed;

      const categories = webcam.category
        .map((category) => `${category.name}`)
        .join(', ');

      const favourites = JSON.parse(store.get('favourites'));

      const html = safeHTML`
        <div class="card mb-4">
          <div class="card-body row">
            <h2 class="card-title">${title}</h2>
            
            <br>
            
            <div class="col">
              <span class="card-text">
                <strong>City:</strong> ${webcam.location.city}
              </span>
              
              <br>
              
              <span class="card-text">
                <strong>Region:</strong> ${webcam.location.region}
              </span>
              
              <br>
              
              <span class="card-text">
                <strong>Country:</strong> ${webcam.location.country}
              </span>
              
              <br>
              
              <span class="card-text">
                <strong>Continent:</strong> ${webcam.location.continent}
              </span>
              
              <br>
              
            </div>
            
            <div class="col">
              <span class="card-text">
                <strong>Category:</strong> ${categories}
              </span>
              
              <br>
              
              <span class="card-text">
                <strong>Views:</strong> ${webcam.statistics.views}
              </span>
              
              <br>
              
              <span class="card-text">
                <a
                  href="${webcam.location.wikipedia}"
                  target="_blank"
                >
                  Wikipedia
                </a>
              </span>
              
              <br>
              
            </div>
            
            <div class="col">
              <button
                class="btn float-end btn-outline-${
                  favourites.includes(webcam.id) ? 'danger' : 'success'
                }"
                data-controller="favourite"
                data-action="favourite#toggleFavourite"
                data-favourite-saved="${!!favourites.includes(webcam.id)}"
                data-favourite-webcam-id-value="${webcam.id}"
              >
                ${
                  favourites.includes(webcam.id) ? 'Remove from' : 'Add to'
                } favourites
              </button>
            </div>
          </div>
          
          <iframe src="${player}" title="${title}" height="450"></iframe>
        </div>
      `;

      webcamsContainer.innerHTML += html;
    });

    if (totalWebcams - offset > 10 && response.data.result.limit !== 25) {
      webcamsContainer.innerHTML += safeHTML`
        <button data-action="application#loadMore" data-offset="${offset}" data-application-target="loadMore" class="btn btn-outline-secondary mb-5">Load more webcams</button>
      `;
    }
  }

  static getContinents(target) {
    const select = target;

    select.disabled = true;

    const storedContinents = JSON.parse(store.get('continents'));

    if (storedContinents) {
      this.constructOptions(target, storedContinents);

      select.disabled = false;
    } else {
      axios({
        method: 'get',
        url: `/list`,
        params: {
          show: 'continents',
        },
      })
        .then((response) => {
          this.constructOptions(target, response.data.result.continents);
          store('continents', JSON.stringify(response.data.result.continents));

          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .then(() => {
          select.disabled = false;
        });
    }
  }

  static getCountries(target) {
    const select = target;

    select.disabled = true;

    const storedCountries = JSON.parse(store.get('countries'));

    if (storedCountries) {
      this.constructOptions(target, storedCountries);

      select.disabled = false;
    } else {
      axios({
        method: 'get',
        url: `/list`,
        params: {
          show: 'countries',
        },
      })
        .then((response) => {
          this.constructOptions(target, response.data.result.countries);
          store('countries', JSON.stringify(response.data.result.countries));

          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .then(() => {
          select.disabled = false;
        });
    }
  }

  static getCategories(target) {
    const select = target;

    select.disabled = true;

    const storedCategories = JSON.parse(store.get('categories'));

    if (storedCategories) {
      this.constructOptions(target, storedCategories);

      select.disabled = false;
    } else {
      axios({
        method: 'get',
        url: '/list',
        params: {
          show: 'categories',
        },
      })
        .then((response) => {
          this.constructOptions(target, response.data.result.categories);
          store('categories', JSON.stringify(response.data.result.categories));

          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .then(() => {
          select.disabled = false;
        });
    }
  }

  static constructOptions(target, object) {
    const select = target;
    const options = object.sort((a, b) => (a.name > b.name ? 1 : -1));

    options.forEach((option) => {
      const html = safeHTML`<option value="${option.id}">${option.name}</option>`;

      select.innerHTML += html;
    });
  }

  static selectedContinentQuery() {
    const selectedContinent = $('#continent_select').val();

    return selectedContinent ? `/continent=${selectedContinent}` : '';
  }

  static selectedCountriesQuery() {
    const selectedCountries = $('#countries_select').select2('data')[0];

    return selectedCountries ? `/country=${selectedCountries.id}` : '';
  }

  static selectedCategoryQuery() {
    const selectedCategory = $('#category_select').val();

    return selectedCategory ? `/category=${selectedCategory}` : '';
  }

  static checkedLiveQuery() {
    return $('#liveCheck').is(':checked') ? `/property=live` : '';
  }
}
