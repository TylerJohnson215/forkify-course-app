import View from './view.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Makes buttons for pagination click live so you can flip among pages in search results
  // goToPage = create page number which is needed to change search results page
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const button = e.target.closest('.btn--inline');

      if (!button) return;
      // goToPage sets the page which each button points to
      const goToPage = +button.dataset.goto;
      console.log(goToPage);
      // When the handler gets called the page is turned to where the button was pointed towards
      handler(goToPage);
    });
  }

  // Method that the render method will call to generate markup for the view
  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1)
      return `<button data-goto="${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
    <span>Page ${currentPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;

    // Last page
    if (currentPage === numPages && numPages > 1)
      return `<button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${currentPage - 1}</span>
  </button>`;

    // Other page
    if (currentPage < numPages)
      return `<button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${currentPage - 1}</span>
  </button>
  <button data-goto="${
    currentPage + 1
  }" class="btn--inline pagination__btn--next">
  <span>Page ${currentPage + 1}</span>
  <svg class="search__icon">
    <use href="${icons}#icon-arrow-right"></use>
  </svg>
</button>`;

    // Page 1, and there are NO other pages
    return '';
  }
}

export default new PaginationView();
