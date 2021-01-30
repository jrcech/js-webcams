import { Controller } from 'stimulus';
import store from 'store2';

export default class extends Controller {
  static targets = ['addFavourite'];

  static values = { webcamId: String };

  toggleFavourite(event) {
    event.preventDefault();

    const webcamId = this.webcamIdValue;
    const favourites = JSON.parse(store.get('favourites'));

    if (this.element.getAttribute('data-favourite-saved') === 'true') {
      this.element.setAttribute('data-favourite-saved', false);
      this.element.textContent = 'Add to favourites';
      this.element.classList.remove('btn-outline-danger');
      this.element.classList.add('btn-outline-success');

      favourites.splice(favourites.indexOf(webcamId), 1);
    } else {
      this.element.setAttribute('data-favourite-saved', true);
      this.element.textContent = 'Remove from favourites';
      this.element.classList.remove('btn-outline-success');
      this.element.classList.add('btn-outline-danger');

      favourites.push(webcamId);
    }

    store('favourites', JSON.stringify(favourites));
  }
}
