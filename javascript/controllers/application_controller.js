import { Controller } from "stimulus";

const axios = require("axios");

export default class extends Controller {
  static targets = ["webcams"];

  connect() {
    console.log("connected")
    this.webcamsTarget.textContent = "Stimulus loaded";

    axios({
      method: 'get',
      url: 'https://api.windy.com/api/webcams/v2/list?show=webcams:image,location;categories',
      data: {
        lang: 'DE'
      },
      headers: {'x-windy-key': 'kiyhsHoiuKtjPM8aEjkWJ0xGL8WIOR5d'}
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }
}
