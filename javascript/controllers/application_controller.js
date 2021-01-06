import { Controller } from "stimulus";

const axios = require("axios");

export default class extends Controller {
  static targets = ["webcams"];

  connect() {
    console.log("connected")

    const webcamsContainer = this.webcamsTarget

    axios({
      method: 'get',
      url: 'https://api.windy.com/api/webcams/v2/list?show=webcams:image,location;categories',
      data: {
        lang: 'DE'
      },
      headers: {'x-windy-key': 'kiyhsHoiuKtjPM8aEjkWJ0xGL8WIOR5d'}
    })
    .then(function(response) {
      const webcams = response['data']['result']['webcams'];

      console.log(webcams);

      webcams.forEach(webcam => {
        let thumbnail = webcam['image']['current']['thumbnail'];

        console.log(thumbnail);
        let html = '<img src=' + thumbnail + ' alt="test">'
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
