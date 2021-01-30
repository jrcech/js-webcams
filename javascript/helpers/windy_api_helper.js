import safeHTML from "html-template-tag";
import store from 'store2';

const axios = require("axios");

axios.defaults.baseURL = 'https://api.windy.com/api/webcams/v2';
axios.defaults.headers['x-windy-key'] = 'kiyhsHoiuKtjPM8aEjkWJ0xGL8WIOR5d';

export default class WindyApiHelper {
  static getWebcams(target, offset, submit) {
    history.pushState('', '', './');

    axios({
      method: 'get',
      url: `/list/limit=10,${offset}${this.selectedCategoryQuery()}${this.selectedCountriesQuery()}${this.selectedContinentsQuery()}`,
      params: {
        show: 'webcams:category,location,player,property,statistics;categories;properties;continents;countries'
      }
    })
    .then(response => {
      this.constructWebcamHTML(response, target, offset);

      console.log(response);
    })
    .catch(error => {
      console.log(error);
    })
    .then(() => {
      submit.disabled = false;
    });
  }

  static getFavouriteWebcams(target, offset) {
    history.pushState('', '', 'favourites');

    const favourites = JSON.parse(store.get("favourites"));

    if (favourites.length > 0) {
      axios({
        method: 'get',
        url: `/list/webcam=${JSON.parse(store.get("favourites")).join(',')}`,
        params: {
          show: 'webcams:category,location,player,property,statistics;categories;properties;continents;countries'
        }
      })
      .then(response => {
        this.constructWebcamHTML(response, target, offset);

        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    } else {
      target.textContent = 'No favourite webcams saved.'
    }
  }

  static constructWebcamHTML(response, target, offset) {
    const webcamsContainer = target;
    const webcams = response.data.result.webcams;
    const totalWebcams = response.data.result.total;

    if (offset === 0) {
      webcamsContainer.innerHTML += safeHTML`
        <span>Number of webcams found: ${totalWebcams}</span>
      `
    }

    webcams.forEach(webcam => {
      let title = webcam.title;
      let player = webcam.player.day.embed;
      let categories = webcam.category.map(category => `${category.name}`).join(', ');

      let favourites = JSON.parse(store.get("favourites"));

      let html = safeHTML`
        <div class="card mb-4">
          <div class="card-body row">
            <h2 class="card-title">${title}</h2>
            <br>
            
            <div class="col">
              <span class="card-text"><strong>City:</strong> ${webcam.location.city}</span><br>
              <span class="card-text"><strong>Region:</strong> ${webcam.location.region}</span><br>
              <span class="card-text"><strong>Country:</strong> ${webcam.location.country}</span><br>
              <span class="card-text"><strong>Continent:</strong> ${webcam.location.continent}</span><br>
            </div>
            
            <div class="col">
              <span class="card-text"><strong>Category:</strong> ${categories}</span><br>
              <span class="card-text"><strong>Views:</strong> ${webcam.statistics.views}</span><br>
              <span class="card-text"><a href="${webcam.location.wikipedia}" target="_blank">Wikipedia</a></span><br>
            </div>
            
            <div class="col">
              <button class="btn btn-outline-${favourites.includes(webcam.id) ? 'danger' : 'success'} float-end" data-controller="favourite" data-action="favourite#toggleFavourite" data-favourite-saved="${favourites.includes(webcam.id) ? 'true' : 'false'}" data-favourite-webcam-id-value="${webcam.id}" data-favourite-css-class="active">${favourites.includes(webcam.id) ? 'Remove from favourites' : 'Add to favourites'}</button>
            </div>
          </div>
          
          <iframe src="${player}" title="${title}" height="450"></iframe>
        </div>
      `

      webcamsContainer.innerHTML += html;
    })

    if (totalWebcams - offset > 10) {
      webcamsContainer.innerHTML += safeHTML`
        <button data-action="application#loadMore" data-offset="${offset}" data-application-target="loadMore" class="btn btn-outline-secondary mb-5">Load more webcams</button>
      `
    }
  }

  static getContinents(target) {
    target.disabled = true;

    const storedContinents = JSON.parse(store.get("continents"));

    if (storedContinents) {
      this.constructOptions(target, storedContinents);

      target.disabled = false;
    } else {
      axios({
        method: 'get',
        url: `/list`,
        params: {
          show: 'continents'
        }
      })
      .then(response => {
        this.constructOptions(target, response.data.result.continents);
        store("continents", JSON.stringify(response.data.result.continents));

        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        target.disabled = false;
      });
    }
  }

  static getCountries(target) {
    target.disabled = true;

    const storedCountries = JSON.parse(store.get("countries"));

    if (storedCountries) {
      this.constructOptions(target, storedCountries);

      target.disabled = false;
    } else {
      axios({
        method: 'get',
        url: `/list`,
        params: {
          show: 'countries'
        }
      })
      .then(response => {
        this.constructOptions(target, response.data.result.countries);
        store("countries", JSON.stringify(response.data.result.countries));

        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        target.disabled = false;
      });
    }
  }

  static getCategories(target) {
    target.disabled = true;

    const storedCategories = JSON.parse(store.get("categories"));

    if (storedCategories) {
      this.constructOptions(target, storedCategories);

      target.disabled = false;
    } else {
      axios({
        method: 'get',
        url: '/list',
        params: {
          show: 'categories'
        }
      })
      .then(response => {
        this.constructOptions(target, response.data.result.categories);
        store("categories", JSON.stringify(response.data.result.categories));

        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        target.disabled = false;
      });
    }
  }

  static constructOptions(target, object) {
    const options = object.sort((a, b) => (a.name > b.name) ? 1 : -1);

    options.forEach(option => {
      let html = safeHTML`<option value="${option.id}">${option.name}</option>`

      target.innerHTML += html;
    })
  }

  static selectedContinentsQuery() {
    const selectedContinents = $('#continents_select').select2('data');
    const selectedContinentsString = selectedContinents.map(continent => `${continent.id}`).join(',');

    return selectedContinentsString ? `/continent=${selectedContinentsString}` : '';
  }

  static selectedCountriesQuery() {
    const selectedCountries = $('#countries_select').select2('data');
    const selectedCountriesString = selectedCountries.map(country => `${country.id}`).join(',');

    return selectedCountriesString ? `/country=${selectedCountriesString}` : '';
  }

  static selectedCategoryQuery() {
    const selectedCategory = $('#category_select').val();

    return selectedCategory ? `/category=${selectedCategory}` : '';
  }
}
