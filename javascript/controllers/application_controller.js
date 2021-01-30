import { Controller } from "stimulus";
import WindyApiHelper from "../helpers/windy_api_helper";

export default class extends Controller {
  static targets = [
    "webcams",
    "continentsSelect",
    "countriesSelect",
    "categorySelect",
    "loadMore",
    "submit",
    "favouritesLink",
    "searchLink",
    "searchForm",
    "heading"
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

    this.submitTarget.disabled = true;

    WindyApiHelper.getWebcams(this.webcamsTarget, 0, this.submitTarget);
  }

  loadMore(event) {
    event.preventDefault();

    this.submitTarget.disabled = true;

    let offset = parseInt(this.loadMoreTarget.getAttribute("data-offset")) + 10;

    this.loadMoreTarget.remove();

    WindyApiHelper.getWebcams(this.webcamsTarget, offset, this.submitTarget);
  }

  loadFavourites(event) {
    event.preventDefault();

    this.webcamsTarget.innerHTML = '';
    this.searchFormTarget.innerHTML = '';

    this.searchLinkTarget.classList.remove('active');
    this.favouritesLinkTarget.classList.add('active');
    this.headingTarget.textContent = 'Favourite webcams';

    WindyApiHelper.getFavouriteWebcams(this.webcamsTarget, 0);
  }
}
