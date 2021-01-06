import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["stimulusTest", "jqueryTest", "turboTest"];

  connect() {
    this.stimulusTestTarget.textContent = "Stimulus loaded";

    if (typeof Turbo === "undefined") {
      this.turboTestTarget.textContent = "Turbo not loaded";
    } else {
      this.turboTestTarget.textContent = "Turbo loaded";
    }

    if (typeof jQuery === "undefined") {
      this.jqueryTestTarget.textContent = "jQuery not loaded";
    } else {
      this.jqueryTestTarget.textContent = "jQuery loaded";
    }

    $('[data-toggle="tooltip"]').tooltip();
  }
}
