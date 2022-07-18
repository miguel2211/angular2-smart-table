import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { Grid } from '../../../lib/grid';
import { Row } from '../../../lib/data-set/row';
import { Cell } from '../../../lib/data-set/cell';

@Component({
  selector: '[angular2-st-thead-form-row]',
  template: `
      <td *ngIf="isMultiSelectVisible"></td>
      <td  *ngIf="showActionColumnLeft"  class="angular2-smart-actions">
        <angular2-st-actions [grid]="grid" (create)="onCreate($event)"></angular2-st-actions>
      </td>
      <td *ngFor="let cell of getVisibleCells(grid.getNewRow().getCells())">
        <angular2-smart-table-cell [cell]="cell"
                              [grid]="grid"
                              [isNew]="true"
                              [createConfirm]="createConfirm"
                              [inputClass]="addInputClass"
                              [isInEditing]="grid.getNewRow().isInEditing"
                              (edited)="onCreate($event)">
        </angular2-smart-table-cell>
      </td>
      <td  *ngIf="showActionColumnRight"  class="angular2-smart-actions">
        <angular2-st-actions [grid]="grid" (create)="onCreate($event)"></angular2-st-actions>
      </td>
  `,
})
export class TheadFormRowComponent implements OnChanges {

  @Input() grid!: Grid;
  @Input() row!: Row;
  @Input() createConfirm!: EventEmitter<any>;

  @Output() create = new EventEmitter<any>();

  isMultiSelectVisible!: boolean;
  showActionColumnLeft!: boolean;
  showActionColumnRight!: boolean;
  addInputClass!: string;

  onCreate(event: any) {
    event.stopPropagation();

    this.grid.create(this.grid.getNewRow(), this.createConfirm);
  }

  ngOnChanges() {
    this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
    this.showActionColumnLeft = this.grid.showActionColumn('left');
    this.showActionColumnRight = this.grid.showActionColumn('right');
    this.addInputClass = this.grid.getSetting('add.inputClass');
  }

  getVisibleCells(cells: Array<Cell>): Array<Cell> {
    return (cells || []).filter((cell: Cell) => !cell.getColumn().hide);
  }
}
