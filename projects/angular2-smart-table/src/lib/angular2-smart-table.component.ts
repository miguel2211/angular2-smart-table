import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChange} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DataSet} from './lib/data-set/data-set';
import {Row} from './lib/data-set/row';
import {DataSource} from './lib/data-source/data-source';
import {LocalDataSource} from './lib/data-source/local/local.data-source';
import {Grid} from './lib/grid';
import {deepExtend, getPageForRowIndex} from './lib/helpers';
import {IColumn, Settings} from './lib/settings';
import {
  CreateCancelEvent,
  CreateConfirmEvent,
  CreateEvent, CustomActionEvent,
  DeleteConfirmEvent,
  DeleteEvent,
  EditCancelEvent,
  EditConfirmEvent,
  EditEvent
} from './lib/events';

@Component({
  selector: 'angular2-smart-table',
  styleUrls: ['./angular2-smart-table.component.scss'],
  templateUrl: './angular2-smart-table.component.html',
})
export class Angular2SmartTableComponent implements OnChanges, OnDestroy {

  @Input() source: any;
  @Input() settings: Settings = {};


  @Output() rowSelect = new EventEmitter<any>();
  @Output() rowDeselect = new EventEmitter<any>();
  @Output() userRowSelect = new EventEmitter<any>();
  @Output() delete = new EventEmitter<DeleteEvent>();
  @Output() edit = new EventEmitter<EditEvent>();
  @Output() create = new EventEmitter<CreateEvent>();
  @Output() custom = new EventEmitter<CustomActionEvent>();
  @Output() deleteConfirm = new EventEmitter<DeleteConfirmEvent>();
  @Output() editConfirm = new EventEmitter<EditConfirmEvent>();
  @Output() editCancel = new EventEmitter<EditCancelEvent>();
  @Output() createConfirm = new EventEmitter<CreateConfirmEvent>();
  @Output() createCancel = new EventEmitter<CreateCancelEvent>();
  @Output() rowHover: EventEmitter<any> = new EventEmitter<any>();
  @Output() afterGridInit: EventEmitter<DataSet> = new EventEmitter<DataSet>();

  tableClass!: string;
  tableId!: string;
  perPageSelect: number[] = [];
  perPageSelectLabel: string = 'Per Page:';
  isHideHeader!: boolean;
  isHideSubHeader!: boolean;
  isPagerDisplay!: boolean;
  rowClassFunction!: Function;

  grid!: Grid;
  defaultSettings: Settings = {
    mode: 'inline', // inline|external
    selectMode: 'single', // single|multi
    /**
     * Points to an element in all data
     *
     * when < 0 all lines must be deselected
     */
    selectedRowIndex: 0,
    switchPageToSelectedRowPage: false,
    hideHeader: false,
    hideSubHeader: false,
    resizable: false,
    hideable: false,
    actions: {
      columnTitle: 'Actions',
      add: true,
      edit: true,
      delete: true,
      custom: [],
      position: 'left', // left|right
    },
    filter: {
      inputClass: '',
    },
    edit: {
      inputClass: '',
      editButtonContent: 'Edit',
      saveButtonContent: 'Update',
      cancelButtonContent: 'Cancel',
      confirmSave: false,
    },
    add: {
      inputClass: '',
      addButtonContent: 'Add New',
      createButtonContent: 'Create',
      cancelButtonContent: 'Cancel',
      confirmCreate: false,
    },
    delete: {
      deleteButtonContent: 'Delete',
      confirmDelete: false,
    },
    expand: {
      expandRowButtonContent: 'Expand'
    },
    attr: {
      id: '',
      class: '',
    },
    noDataMessage: 'No data found',
    columns: {},
    pager: {
      display: true,
      page: 1,
      perPage: 10,
    },
    rowClassFunction: () => '',
  };

  isAllSelected: boolean = false;

  private onSelectRowSubscription!: Subscription;
  private onDeselectRowSubscription!: Subscription;
  private destroyed$: Subject<void> = new Subject<void>();

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (this.grid) {
      if (changes['settings']) {
        this.grid.setSettings(this.prepareSettings());
      }
      if (changes['source']) {
        this.source = this.prepareSource();
        this.grid.setSource(this.source);
      }
    } else {
      this.initGrid();
    }
    this.tableId = this.grid.getSetting('attr.id');
    this.tableClass = this.grid.getSetting('attr.class');
    this.isHideHeader = this.grid.getSetting('hideHeader');
    this.isHideSubHeader = this.grid.getSetting('hideSubHeader');
    this.isPagerDisplay = this.grid.getSetting('pager.display');
    this.isPagerDisplay = this.grid.getSetting('pager.display');
    this.perPageSelect = this.grid.getSetting('pager.perPageSelect', this.perPageSelect);
    this.perPageSelectLabel = this.grid.getSetting('pager.perPageSelectLabel', this.perPageSelectLabel);
    this.rowClassFunction = this.grid.getSetting('rowClassFunction');
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  selectRow(index: number, switchPageToSelectedRowPage: boolean = this.grid.getSetting('switchPageToSelectedRowPage')): void {
    if (!this.grid) {
      return;
    }
    this.grid.settings.selectedRowIndex = index;
    if (this.isIndexOutOfRange(index)) {
      // we need to deselect all rows if we got an incorrect index
      this.deselectAllRows();
      return;
    }

    if (switchPageToSelectedRowPage) {
      const source: DataSource = this.source;
      const paging: { page: number, perPage: number } = source.getPaging();
      const page: number = getPageForRowIndex(index, paging.perPage);
      index = index % paging.perPage;
      this.grid.settings.selectedRowIndex = index;

      if (page !== paging.page) {
        source.setPage(page);
        return;
      }

    }

    const row: Row = this.grid.getRows()[index];
    if (row) {
      this.onSelectRow(row);
    } else {
      // we need to deselect all rows if we got an incorrect index
      this.deselectAllRows();
    }
  }

  private deselectAllRows(): void {
    this.grid.dataSet.deselectAll();
    this.emitDeselectRow(null);
  }

  editRowSelect(row: Row) {
    if (this.grid.getSetting('selectMode') === 'multi') {
      this.onMultipleSelectRow(row);
    } else {
      this.onSelectRow(row);
    }
  }

  onUserSelectRow(row: Row) {
    if (this.grid.getSetting('selectMode') !== 'multi') {
      this.grid.selectRow(row);
      this.emitUserSelectRow(row);
      this.emitSelectRow(row);
    }
  }

  onRowHover(row: Row) {
    this.rowHover.emit(row);
  }

  multipleSelectRow(row: Row) {
    this.grid.multipleSelectRow(row);
    this.emitUserSelectRow(row);
    this.emitSelectRow(row);
  }

  async onSelectAllRows($event: any) {
    this.isAllSelected = !this.isAllSelected;
    await this.grid.selectAllRows(this.isAllSelected);

    this.emitUserSelectRow(null);
    this.emitSelectRow(null);
  }

  onSelectRow(row: Row) {
    this.grid.selectRow(row);
    this.emitSelectRow(row);
  }

  onExpandRow(row: Row) {
    this.grid.expandRow(row);
  }

  onMultipleSelectRow(row: Row) {
    this.emitSelectRow(row);
  }

  initGrid() {
    this.source = this.prepareSource();
    this.grid = new Grid(this.source, this.prepareSettings());

    this.subscribeToOnSelectRow();
    this.subscribeToOnDeselectRow();
    /** Delay a bit the grid init event trigger to prevent empty rows */
    setTimeout(() => {
      this.afterGridInit.emit(this.grid.dataSet);
    }, 10);

  }

  prepareSource(): DataSource {
    if (this.source instanceof DataSource) {
      return this.source;
    } else if (this.source instanceof Array) {
      return new LocalDataSource(this.source);
    }

    return new LocalDataSource();
  }

  prepareSettings(): Settings {
    return deepExtend({}, this.defaultSettings, this.settings);
  }

  changePage($event: any) {
    this.resetAllSelector();
  }

  sort($event: any) {
    this.resetAllSelector();
  }

  filter($event: any) {
    this.resetAllSelector();
  }

  getNotVisibleColumns(): Array<IColumn> {
    return (this.grid?.getColumns() ?? []).filter((column: IColumn) => column.hide);
  }

  toggleColumnVisibility(columnId: string) {
    (this.settings as any).columns[columnId].hide = false;
    //this.grid.setSettings(this.settings);
    this.grid.setSettings(this.prepareSettings());
  }

  onHideHeader(columnId: string) {
    (this.settings as any).columns[columnId].hide = true;
    this.grid.setSettings(this.prepareSettings());
  }

  private resetAllSelector() {
    // this.isAllSelected = false;
  }

  private emitUserSelectRow(row: Row | null) {
    const selectedRows = this.grid.getSelectedRows();
    const selectedItems = this.grid.getSelectedItems();

    this.userRowSelect.emit({
      data: row ? row.getData() : null,
      isSelected: row ? row.getIsSelected() : null,
      source: this.source,
      selected: selectedRows && selectedRows.length ? selectedRows.map((r: Row) => r.getData()) : [],
      selectedItems,
    });
  }

  private emitSelectRow(row: Row | null) {
    const data = {
      data: row ? row.getData() : null,
      isSelected: row ? row.getIsSelected() : null,
      isExpanded: row ? row.getIsExpanded() : null,
      source: this.source,
    };
    this.rowSelect.emit(data);
    if (!row?.isSelected) {
      this.rowDeselect.emit(data);
    }
    if (!row?.isExpanded) {
      this.rowDeselect.emit(data);
    }
  }

  private emitDeselectRow(row: Row | null): void {
    if (row)
      this.rowDeselect.emit({
        data: row ? row.getData() : null,
        isSelected: row ? row.getIsSelected() : null,
        source: this.source,
      });
  }

  private isIndexOutOfRange(index: number): boolean {
    const dataAmount: number = this.source?.count();
    return index < 0 || (typeof dataAmount === 'number' && index >= dataAmount);
  }

  private subscribeToOnSelectRow(): void {
    if (this.onSelectRowSubscription) {
      this.onSelectRowSubscription.unsubscribe();
    }
    this.onSelectRowSubscription = this.grid.onSelectRow()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((row) => {
        this.emitSelectRow(row);
      });
  }

  private subscribeToOnDeselectRow(): void {
    if (this.onDeselectRowSubscription) {
      this.onDeselectRowSubscription.unsubscribe();
    }
    this.onDeselectRowSubscription = this.grid.onDeselectRow()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((row) => {
        this.emitDeselectRow(row);
      });
  }

}
