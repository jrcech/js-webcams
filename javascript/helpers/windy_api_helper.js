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
          <h2>${title}</h2>
          <button data-controller="favourite" data-action="favourite#toggleFavourite" data-favourite-webcam-id-value="${webcam.id}" data-favourite-css-class="active">${store.has(webcam.id) ? 'Remove from favourites' : 'Add to favourites'}</button>
          <span><strong>Category:</strong> ${categories}</span><br>
          <span><strong>Views:</strong> ${webcam.statistics.views}</span><br>
          <span><strong>City:</strong> ${webcam.location.city}</span><br>
          <span><strong>Country:</strong> ${webcam.location.country}</span><br>
          <span><strong>Continent:</strong> ${webcam.location.continent}</span><br>
          <span><strong>Region:</strong> ${webcam.location.region}</span><br>
          <span><a href="${webcam.location.wikipedia}" target="_blank">Wikipedia</a></span><br>
          <iframe src="${player}" title="${title}"></iframe>
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
      const continents = response.data.result.continents.sort((a, b) => (a.name > b.name) ? 1 : -1);

      continents.forEach(continent => {
        let html = safeHTML`
          <option value="${continent.id}">${continent.name}</option>
        `

        target.innerHTML += html;
      })

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
      const countries = response.data.result.countries.sort((a, b) => (a.name > b.name) ? 1 : -1);

      countries.forEach(country => {
        let html = safeHTML`
          <option value="${country.id}">${country.name}</option>
        `

        target.innerHTML += html;
      })

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
      const categories = response.data.result.categories.sort((a, b) => (a.name > b.name) ? 1 : -1);

      categories.forEach(category => {
        let html = safeHTML`<option value="${category.id}">${category.name}</option>`

        target.innerHTML += html;
      })
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
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
