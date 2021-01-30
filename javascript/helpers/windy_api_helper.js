import safeHTML from "html-template-tag";
import store from 'store2';

const axios = require("axios");

axios.defaults.baseURL = 'https://api.windy.com/api/webcams/v2';
axios.defaults.headers['x-windy-key'] = 'kiyhsHoiuKtjPM8aEjkWJ0xGL8WIOR5d';

export default class WindyApiHelper {
  static getWebcams(target, offset) {
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
    });
  }

  static getFavouriteWebcams(target, offset) {
    history.pushState('', '', 'favourites');

    axios({
      method: 'get',
      url: `/list/webcam=${store.keys().join(',')}`,
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
  }

  static constructWebcamHTML(response, target, offset) {
    const webcamsContainer = target;
    const webcams = response.data.result.webcams;

    webcamsContainer.innerHTML += safeHTML`
        <span>Number of webcams found: ${response.data.result.total}</span>
      `

    webcams.forEach(webcam => {
      let title = webcam.title;
      let player = webcam.player.day.embed;
      let categories = webcam.category.map(category => `${category.name}`).join(', ');

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
              <button class="btn btn-outline-${store.has(webcam.id) ? 'danger' : 'success'} float-end" data-controller="favourite" data-action="favourite#toggleFavourite" data-favourite-saved="${store.has(webcam.id) ? 'true' : 'false'}" data-favourite-webcam-id-value="${webcam.id}" data-favourite-css-class="active">${store.has(webcam.id) ? 'Remove from favourites' : 'Add to favourites'}</button>
            </div>
          </div>
          
          <iframe src="${player}" title="${title}" height="450"></iframe>
        </div>
      `

      webcamsContainer.innerHTML += html;
    })

    webcamsContainer.innerHTML += safeHTML`
        <button data-action="application#loadMore" data-offset="${offset}" data-application-target="loadMore">Load more webcams</button>
      `
  }

  static getContinents(target) {
    $('#continents_select').select2();

    axios({
      method: 'get',
      url: `/list`,
      params: {
        show: 'continents'
      }
    })
    .then(response => {
      this.constructOptions(target, response.data.result.continents);

      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  }

  static getCountries(target) {
    $('#countries_select').select2();

    axios({
      method: 'get',
      url: `/list`,
      params: {
        show: 'countries'
      }
    })
    .then(response => {
      this.constructOptions(target, response.data.result.countries);

      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  }

  static getCategories(target) {
    axios({
      method: 'get',
      url: '/list',
      params: {
        show: 'categories'
      }
    })
    .then(response => {
      this.constructOptions(target, response.data.result.categories);

      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
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
