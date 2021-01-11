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
    WindyApiHelper.getContinents(this.continentsSelectTarget);
    WindyApiHelper.getCategories(this.categorySelectTarget);
    this._initCountriesSelect();
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

  loadFavourites(event) {
    event.preventDefault();

    this.webcamsTarget.innerHTML = '';

    WindyApiHelper.getFavouriteWebcams(this.webcamsTarget, 0);
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
}
