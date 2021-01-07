import { Controller } from "stimulus";
import safeHTML from 'html-template-tag';
import countriesList from 'countries-list';

const axios = require("axios");

export default class extends Controller {
  static targets = [
    "webcams",
    "continentsSelect",
    "countriesSelect",
    "categorySelect",
    "loadMore",
    "submit"
  ];

  connect() {
    this._initContinentsSelect();
    this._initCountriesSelect();
    this._initCategoriesSelect(axios);
  }

  submit(event) {
    event.preventDefault();

    this.webcamsTarget.innerHTML = '';

    this._getWebcams(axios, 0);
  }

  loadMore(event) {
    event.preventDefault();

    let offset = parseInt(this.loadMoreTarget.getAttribute("data-offset")) + 10;

    this.loadMoreTarget.remove();

    this._getWebcams(axios, offset);
  }

  _getWebcams(axios, offset) {
    axios({
      method: 'get',
      url: `https://api.windy.com/api/webcams/v2/list/limit=10,${offset}${this._selectedCategoryQuery()}${this._selectedCountriesQuery()}`,
      params: {
        show: 'webcams:category,location,player,property,statistics;categories;properties;continents;countries'
      },
      headers: {'x-windy-key': 'kiyhsHoiuKtjPM8aEjkWJ0xGL8WIOR5d'}
    })
    .then(response => {
      const webcamsContainer = this.webcamsTarget;
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
          <button data-controller="favourite" data-action="favourite#addFavourite" data-favourite-webcam-id-value="${webcam.id}">Add to favourites</button>
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

      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  }

  _selectedCountriesQuery() {
    const selectedCountries = $('#countries_select').select2('data');
    const selectedCountriesString = selectedCountries.map(country => `${country.id}`).join(',');

    return selectedCountriesString ? `/country=${selectedCountriesString}` : '';
  }

  _selectedCategoryQuery() {
    const selectedCategory = $('#category_select').val();

    return selectedCategory ? `/category=${selectedCategory}` : '';
  }

  _initContinentsSelect() {
    const continentsSelect = this.continentsSelectTarget;
    const continents = Object.entries(countriesList.continents);

    for (const [continent_code, continent] of continents) {
      let html = safeHTML`<option value="${continent_code}">${continent}</option>`

      continentsSelect.innerHTML += html;
    }

    $('#continents_select').select2();
  }

  _initCountriesSelect() {
    const countriesSelect = this.countriesSelectTarget;
    const countries = Object.entries(countriesList.countries);

    for (const [country_code, country] of countries) {
      let html = safeHTML`<option value="${country_code}">${country.name}</option>`

      countriesSelect.innerHTML += html;
    }

    $('#countries_select').select2();
  }

  _initCategoriesSelect(axios) {
    const categorySelect = this.categorySelectTarget;

    axios({
      method: 'get',
      url: 'https://api.windy.com/api/webcams/v2/list',
      params: {
        show: 'categories'
      },
      headers: {'x-windy-key': 'kiyhsHoiuKtjPM8aEjkWJ0xGL8WIOR5d'}
    })
    .then(response => {
      const categories = response.data.result.categories.sort((a, b) => (a.name > b.name) ? 1 : -1);
      console.log(categories);

      categories.forEach(category => {
        let categoryID = category.id;
        let categoryName = category.name;

        let html = safeHTML`<option value="${categoryID}">${categoryName}</option>`

        categorySelect.innerHTML += html;
      })
      // console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  }
}
