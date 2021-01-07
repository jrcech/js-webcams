import { Controller } from "stimulus";
import safeHTML from 'html-template-tag';
import countriesList from 'countries-list';

const axios = require("axios");

export default class extends Controller {
  static targets = [
    "webcams",
    "continentsSelect",
    "countriesSelect",
    "categorySelect"
  ];

  connect() {
    console.log("connected");

    this._initContinentsSelect();
    this._initCountriesSelect();
    this._initCategoriesSelect(axios);

    const webcamsContainer = this.webcamsTarget;

    axios({
      method: 'get',
      url: 'https://api.windy.com/api/webcams/v2/list/category=beach/country=AU,',
      params: {
        show: 'webcams:image,location,player;categories'
      },
      headers: {'x-windy-key': 'kiyhsHoiuKtjPM8aEjkWJ0xGL8WIOR5d'}
    })
    .then(function(response) {
      const webcams = response['data']['result']['webcams'];

      webcams.forEach(webcam => {
        let title = webcam['title']
        let player = webcam['player']['day']['embed'];

        let html = safeHTML`<iframe src="${player}" title="${title}"></iframe>`

        webcamsContainer.innerHTML += html;
      })
    })
    .catch(function(error) {
      console.log(error);
    })
    .then(function() {
      // always executed
    });
  }

  _initContinentsSelect() {
    const continentsSelect = this.continentsSelectTarget;
    const continents = Object.entries(countriesList['continents']);

    for (const [continent_code, continent] of continents) {
      // console.log(`${continent} has iso code ${continent_code}`);

      let html = safeHTML`<option value="${continent_code}">${continent}</option>`

      continentsSelect.innerHTML += html;
    }

    $('#continents_select').select2();
  }

  _initCountriesSelect() {
    const countriesSelect = this.countriesSelectTarget;
    const countries = Object.entries(countriesList['countries']);

    for (const [country_code, country] of countries) {
      // console.log(`${country['name']} has iso code ${country_code}`);

      let html = safeHTML`<option value="${country_code}">${country['name']}</option>`

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
    .then(function(response) {
      console.log(response);
      const categories = response['data']['result']['categories'];

      categories.forEach(category => {
        let categoryID = category['id']
        let CategoryName = category['name'];

        let html = safeHTML`<option value="${categoryID}">${CategoryName}</option>`

        categorySelect.innerHTML += html;
      })
    })
    .catch(function(error) {
      console.log(error);
    })
    .then(function() {
      // always executed
    });
  }
}
