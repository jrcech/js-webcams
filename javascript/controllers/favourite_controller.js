import { Controller } from "stimulus";
import store from 'store2';

export default class extends Controller {
  static targets = [
    "addFavourite"
  ];
  static values = { webcamId: String }

  addFavourite(event) {
    event.preventDefault();

    let webcamId = this.webcamIdValue;

    store(webcamId, webcamId);

    console.log(store());
  }
}
