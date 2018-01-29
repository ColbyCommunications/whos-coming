import debounce from 'debounce';

import { upArrow } from './upArrow';
import { downArrow } from './downArrow';

class RowSorter {
  addColumnClickListener = this.addColumnClickListener.bind(this);
  columnUSort = this.columnUSort.bind(this);
  search = debounce(this.search.bind(this), 100);

  /**
   * Gathers data attributes from inside a row.
   *
   * @param {HTMLElement} element An HTML element.
   * @return {object} An object containing the data attribute values as keys
   *                  and innerHTML as values.
   */
  static getRowData = element =>
    [...element.querySelectorAll('[data-whos-coming-data]')].reduce(
      (data, span) =>
        Object.assign({}, data, {
          [span.getAttribute('data-whos-coming-data')]: span.innerHTML.trim(),
        }),
      {}
    );

  /**
   * Assembles an array of objects with data for all the rows.
   *
   * @return {array} The objects containing the elements and the data.
   */
  static makeRows = () =>
    [
      ...document.querySelectorAll(
        '.whos-coming__row:not(.whos-coming__row--key)'
      ),
    ].map(element => ({
      element,
      data: RowSorter.getRowData(element),
    }));

  /**
   * Initiate and swallow errors.
   *
   * @param {HTMLElement} container The root.
   */
  constructor(container) {
    this.container = container;
    this.setUp();
    this.rows = RowSorter.makeRows();
    this.originalRows = this.rows.map(item => Object.assign({}, item));
  }

  setUp() {
    try {
      this.keyRow = this.container.querySelector('.whos-coming__row--key');
      this.columns = [
        ...this.keyRow.querySelectorAll('[data-whos-coming-column]'),
      ];
      this.sortDirection = 'desc'; // Will be flipped on the initialization run.
      this.sortColumn = this.columns[0].getAttribute('data-whos-coming-column');
    } catch (e) {
      // Do nothing.
    }
  }

  /**
   * Whether to continue after the constructor.
   */
  shouldStart = () => this.keyRow && this.rows && this.columns;

  start() {
    this.columns.forEach(this.addColumnClickListener);
    this.sortByColumn(this.columns[0]);

    this.searchInput = document.querySelector('[data-whos-coming-search]');
    if (this.searchInput) {
      this.startSearch();
    }
  }

  startSearch() {
    this.searchField = this.searchInput.getAttribute('data-whos-coming-search');
    this.searchInput.addEventListener('keyup', this.search);
    this.searchInput.addEventListener('search', event => {
      if (!event.target.value.trim()) {
        this.resetSearch();
        return;
      }
    });
  }

  matchesSearch(searchWords, textWords) {
    for (var i = 0; i < searchWords.length; i += 1) {
      for (var j = 0; j < textWords.length; j += 1) {
        if (searchWords[i].indexOf(textWords[j]) !== -1) {
          return true;
        }

        if (textWords[j].indexOf(searchWords[i]) !== -1) {
          return true;
        }
      }
    }

    return false;
  }

  resetSearch(event) {
    this.setUp();
    this.sortByColumn(this.columns[0]);
  }

  search(event) {
    if (!event.target.value.trim()) {
      this.resetSearch();
      return;
    }

    const words = event.target.value.toLowerCase().split(' ');

    this.rerender(
      this.rows.filter(row => {
        return this.matchesSearch(
          words,
          row.data[this.searchField].toLowerCase().split(' ')
        );
      })
    );
  }

  addColumnClickListener(column) {
    column.addEventListener('click', () => this.sortByColumn(column));
  }

  rerender(rows) {
    this.container.innerHTML = '';
    this.container.append(
      ...[this.keyRow].concat(rows.map(row => row.element))
    );
  }

  clearDirectionalArrows() {
    this.columns.forEach(column => {
      const arrow = column.querySelector('.whos-coming__arrow');
      if (arrow) {
        column.removeChild(arrow);
      }
    });
  }

  addDirectionalArrow(column) {
    const arrowContainer = document.createElement('SPAN');
    arrowContainer.classList.add('whos-coming__arrow');
    arrowContainer.innerHTML =
      this.sortDirection === 'asc' ? downArrow : upArrow;
    column.appendChild(arrowContainer);
  }

  sortByColumn(column) {
    this.setUpSortByColumn(column);
    this.clearDirectionalArrows();
    this.rows = this.getSortedRows();
    this.rerender(this.rows);
    this.addDirectionalArrow(column);
  }

  setUpSortByColumn(column) {
    const sortColumn = column.getAttribute('data-whos-coming-column');

    if (this.sortColumn === sortColumn) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDirection = 'asc';
    }

    this.sortColumn = sortColumn;
  }

  columnUSort(a, b) {
    if (a.data[this.sortColumn] === b.data[this.sortByColumn]) {
      return 0;
    }

    if (this.sortDirection === 'asc') {
      return a.data[this.sortColumn] < b.data[this.sortColumn] ? -1 : 1;
    }

    return a.data[this.sortColumn] > b.data[this.sortColumn] ? -1 : 1;
  }

  getSortedRows() {
    const sortedRows = this.rows.map(item => item);
    sortedRows.sort(this.columnUSort);

    return sortedRows;
  }
}

export default RowSorter;
