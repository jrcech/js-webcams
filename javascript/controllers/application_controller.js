import { Controller } from "stimulus";
import safeHTML from 'html-template-tag';
import countriesList from 'countries-list';
import WindyApiHelper from "../helpers/windy_api_helper";

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

    WindyApiHelper.getWebcams(this.webcamsTarget, 0);
  }

  loadMore(event) {
    event.preventDefault();

    let offset = parseInt(this.loadMoreTarget.getAttribute("data-offset")) + 10;

    this.loadMoreTarget.remove();

    WindyApiHelper.getWebcams(this.webcamsTarget, offset);
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
