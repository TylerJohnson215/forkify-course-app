class SearchView {
  // Sets parentElement to 'search' in the DOM
  _parentElement = document.querySelector('.search');

  // Returns (query) whatever gets searched by user in the DOM
  // Clears the field and then return the query
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  // Function created to trigger handler function in listener command
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
