import {ColumnFilterFunction, ColumnValuePrepareFunction, IColumn, IColumnType, ISortDirection} from '../settings';
import {DataSet} from './data-set';

export class Column implements IColumn {

  placeholder: string = '';
  title: string = '';
  hide: boolean = false;
  type?: IColumnType = IColumnType.Text;
  class?: string = '';
  width?: string = '';
  isSortable?: boolean = false;
  isEditable?: boolean = true;
  isAddable?: boolean = true;
  isFilterable?: boolean = false;
  sortDirection: ISortDirection = 'asc';
  defaultSortDirection?: ISortDirection = undefined;
  editor?: { type: string, config: any, component: any } = {type: '', config: {}, component: null};
  filter?: { type: string, config: any, component: any } = {type: '', config: {}, component: null};
  renderComponent?: any = null;
  compareFunction?: Function;
  valuePrepareFunction?: ColumnValuePrepareFunction;
  filterFunction?: ColumnFilterFunction;
  onComponentInitFunction?: Function;

  constructor(public id: string, protected settings: any, protected dataSet: DataSet) {
    this.process();
  }

  getOnComponentInitFunction(): Function | undefined {
    return this.onComponentInitFunction;
  }

  getCompareFunction(): Function | undefined {
    return this.compareFunction;
  }

  getValuePrepareFunction(): Function | undefined {
    return this.valuePrepareFunction;
  }

  getFilterFunction(): Function | undefined {
    return this.filterFunction;
  }

  getConfig(): any {
    return this.editor && this.editor.config;
  }

  getFilterType(): any {
    return this.filter && this.filter.type;
  }

  getFilterConfig(): any {
    return this.filter && this.filter.config;
  }

  protected process() {
    this.placeholder = this.settings['placeholder'];
    this.title = this.settings['title'];
    this.class = this.settings['class'];
    this.width = this.settings['width'];
    this.hide = !!this.settings['hide'];
    this.type = this.prepareType();
    this.editor = this.settings['editor'];
    this.filter = this.settings['filter'];
    this.renderComponent = this.settings['renderComponent'];

    this.isFilterable = typeof this.settings['filter'] === 'undefined' ? true : !!this.settings['filter'];
    this.isSortable = typeof this.settings['sort'] === 'undefined' ? true : !!this.settings['sort'];
    this.isEditable = typeof this.settings['isEditable'] === 'undefined' ? true : !!this.settings['isEditable'];
    this.isAddable = typeof this.settings['isAddable'] === 'undefined' ? true : !!this.settings['isAddable'];
    if (typeof this.settings['sortDirection'] !== 'undefined') {
      this.sortDirection = this.defaultSortDirection = this.settings['sortDirection'];
    }

    this.compareFunction = this.settings['compareFunction'];
    this.valuePrepareFunction = this.settings['valuePrepareFunction'];
    this.filterFunction = this.settings['filterFunction'];
    this.onComponentInitFunction = this.settings['onComponentInitFunction'];
  }

  prepareType(): IColumnType {
    return this.settings['type'] || this.determineType();
  }

  determineType(): IColumnType {
    // TODO: determine type by data
    return IColumnType.Text;
  }
}
