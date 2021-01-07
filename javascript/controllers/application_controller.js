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
    const selectedCountries = $('#countries_select').select2('data');
    const selectedCountriesString = selectedCountries.map(country => `${country.id}`).join(',');
    const selectedCountriesQuery = selectedCountriesString ? `/country=${selectedCountriesString}` : ''

    const selectedCategory = $('#category_select').val();
    const selectedCategoryQuery = selectedCategory ? `/category=${selectedCategory}` : ''

    axios({
      method: 'get',
      url: `https://api.windy.com/api/webcams/v2/list/limit=10,${offset}${selectedCategoryQuery}${selectedCountriesQuery}`,
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
          <span>Category: ${categories}</span><br>
          <span>Views: ${webcam.statistics.views}</span><br>
          <span>City: ${webcam.location.city}</span><br>
          <span>Country: ${webcam.location.country}</span><br>
          <span>Continent: ${webcam.location.continent}</span><br>
          <span>Region: ${webcam.location.region}</span><br>
          <span>Wikipedia: <a href="${webcam.location.wikipedia}" target="_blank">${webcam.location.wikipedia}</a></span><br>
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
