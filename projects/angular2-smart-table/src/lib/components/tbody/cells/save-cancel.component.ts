import {Component, EventEmitter, Input, OnChanges} from '@angular/core';

import {Grid} from '../../../lib/grid';
import {Row} from '../../../lib/data-set/row';

@Component({
  // TODO: @breaking-change rename the selector to angular2-st-tbody-save-cancel in the next major version
  selector: 'angular2-st-tbody-create-cancel',
  template: `
    <a href="#" class="angular2-smart-action angular2-smart-action-edit-save"
        [innerHTML]="saveButtonContent" (click)="onSave($event)"></a>
    <a href="#" class="angular2-smart-action angular2-smart-action-edit-cancel"
        [innerHTML]="cancelButtonContent" (click)="onCancelEdit($event)"></a>
  `,
})
export class TbodySaveCancelComponent implements OnChanges {

  @Input() grid!: Grid;
  @Input() row!: Row;
  @Input() editConfirm!: EventEmitter<any>;
  @Input() editCancel!: EventEmitter<any>;

  cancelButtonContent!: string;
  saveButtonContent!: string;

  onSave(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.grid.save(this.row, this.editConfirm);
  }

  onCancelEdit(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.row.isInEditing = false;
    this.editCancel.emit({
      data: this.row.getData(),
      discardedData: this.row.getNewData(),
      source: this.grid.source,
    });
  }

  ngOnChanges() {
    this.saveButtonContent = this.grid.getSetting('edit.saveButtonContent');
    this.cancelButtonContent = this.grid.getSetting('edit.cancelButtonContent')
  }
}
