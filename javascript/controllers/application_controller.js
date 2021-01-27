import { Controller } from "stimulus";
import WindyApiHelper from "../helpers/windy_api_helper";

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
    WindyApiHelper.getCountries(this.countriesSelectTarget);
    WindyApiHelper.getCategories(this.categorySelectTarget);

    $('select').select2({
      theme: 'bootstrap4',
    });
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
}
