import safeHTML from "html-template-tag";

const axios = require("axios");

export default class WindyApiHelper {
  static getWebcams(target, offset) {
    axios({
      method: 'get',
      url: `https://api.windy.com/api/webcams/v2/list/limit=10,${offset}${this.selectedCategoryQuery()}${this.selectedCountriesQuery()}${this.selectedContinentsQuery()}`,
      params: {
        show: 'webcams:category,location,player,property,statistics;categories;properties;continents;countries'
      },
      headers: {'x-windy-key': 'kiyhsHoiuKtjPM8aEjkWJ0xGL8WIOR5d'}
    })
    .then(response => {
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
