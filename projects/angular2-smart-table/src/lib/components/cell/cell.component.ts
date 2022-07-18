import {Component, EventEmitter, Input} from '@angular/core';

import {Grid} from '../../lib/grid';
import {Cell} from '../../lib/data-set/cell';
import {Row} from '../../lib/data-set/row';

@Component({
  selector: 'angular2-smart-table-cell',
  template: `
    <table-cell-view-mode *ngIf="!isInEditing" [cell]="cell"></table-cell-view-mode>
    <table-cell-edit-mode *ngIf="isInEditing" [cell]="cell"
                          [inputClass]="inputClass"
                          (edited)="onEdited()"
                          (stopEditing)="onStopEditing()"
    ></table-cell-edit-mode>
  `,
})
export class CellComponent {

  @Input() grid!: Grid;
  @Input() row!: Row;
  @Input() cell!: Cell;
  @Input() inputClass: string = '';
  @Input() mode: string = 'inline';
  @Input() isInEditing: boolean = false;
  @Input() isNew!: boolean;
  // if isNew === false
  @Input() editConfirm!: EventEmitter<any>;
  @Input() editCancel!: EventEmitter<any>;
  // if isNew === true
  @Input() createConfirm!: EventEmitter<any>;
  @Input() createCancel!: EventEmitter<any>;

  onEdited() {
    if (this.isNew) {
      this.grid.create(this.grid.getNewRow(), this.createConfirm);
    } else {
      this.grid.save(this.row, this.editConfirm);
    }
  }

  onStopEditing() {
    if (this.isNew) {
      this.grid.createFormShown = false;
      this.createCancel.emit({
        discardedData: this.grid.getNewRow().getNewData(),
        source: this.grid.source,
      });
    } else {
      this.row.isInEditing = false;
      this.editCancel.emit({
        data: this.row.getData(),
        discardedData: this.row.getNewData(),
        source: this.grid.source,
      });
    }
  }
}
