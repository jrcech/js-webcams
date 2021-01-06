import { Controller } from "stimulus";
import safeHTML from 'html-template-tag';

const axios = require("axios");

export default class extends Controller {
  static targets = ["webcams"];

  connect() {
    console.log("connected")

    const webcamsContainer = this.webcamsTarget

    axios({
      method: 'get',
      url: 'https://api.windy.com/api/webcams/v2/list',
      params: {
        show: 'webcams:image,location,player;categories'
      },
      headers: {'x-windy-key': 'kiyhsHoiuKtjPM8aEjkWJ0xGL8WIOR5d'}
    })
    .then(function(response) {
      const webcams = response['data']['result']['webcams'];

      console.log(response);
      console.log(webcams);

      webcams.forEach(webcam => {
        let title = webcam['title']
        let player = webcam['player']['day']['embed'];

        let html = safeHTML`<iframe src="${player}" title="${title}"></iframe>`
        console.log(html);

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
