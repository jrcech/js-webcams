import safeHTML from "html-template-tag";

export default class WebcamComponent {
  static construct(target) {
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
  }
}

