import { Controller } from "stimulus";
import safeHTML from 'html-template-tag';
import countriesList from 'countries-list';

const axios = require("axios");

export default class extends Controller {
  static targets = ["webcams", "countriesSelect"];

  connect() {
    console.log("connected");

    const webcamsContainer = this.webcamsTarget;
    const countriesSelect = this.countriesSelectTarget;

    const countries = Object.entries(countriesList['countries']);

    for (const [country_code, country] of countries) {
      // console.log(`${country['name']} has iso code ${country_code}`);

      let html = safeHTML`<option value="${country_code}">${country['name']}</option>`

      countriesSelect.innerHTML += html;
    }

    $('#countries_select').select2();

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
}
