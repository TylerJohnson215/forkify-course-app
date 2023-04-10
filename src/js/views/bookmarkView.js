import View from './view.js';
import icons from '../../img/icons.svg';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet.  Find a nice recipe and bookmark it';
  _messageSuccess = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  // Method that the render method will call to generate markup for the view
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
