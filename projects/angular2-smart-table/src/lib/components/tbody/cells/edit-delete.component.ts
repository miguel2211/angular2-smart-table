import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

import {Grid} from '../../../lib/grid';
import {Row} from '../../../lib/data-set/row';
import {DataSource} from '../../../lib/data-source/data-source';
import {DeleteConfirmEvent, DeleteEvent, EditEvent} from '../../../lib/events';

@Component({
  selector: 'angular2-st-tbody-edit-delete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a href="#" *ngIf="isActionEdit" class="angular2-smart-action angular2-smart-action-edit-edit"
        [innerHTML]="editRowButtonContent" (click)="onEdit($event)"></a>
    <a href="#" *ngIf="isActionDelete" class="angular2-smart-action angular2-smart-action-delete-delete"
        [innerHTML]="deleteRowButtonContent" (click)="onDelete($event)"></a>
  `,
})
export class TbodyEditDeleteComponent implements OnChanges {

  @Input() grid!: Grid;
  @Input() row!: Row;
  @Input() source!: DataSource;
  @Input() deleteConfirm!: EventEmitter<DeleteConfirmEvent>;

  @Output() edit = new EventEmitter<EditEvent>();
  @Output() delete = new EventEmitter<DeleteEvent>();
  @Output() editRowSelect = new EventEmitter<any>();

  isActionEdit!: boolean;
  isActionDelete!: boolean;
  editRowButtonContent!: string;
  deleteRowButtonContent!: string;

  onEdit(event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.editRowSelect.emit(this.row);

    if (this.grid.getSetting('mode') === 'external') {
      this.edit.emit({
        row: this.row,
        data: this.row.getData(),
        source: this.source,
      });
    } else {
      this.grid.edit(this.row);
    }
  }

  onDelete(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (this.grid.getSetting('mode') === 'external') {
      this.delete.emit({
        row: this.row,
        data: this.row.getData(),
        source: this.source,
      });
    } else {
      this.grid.delete(this.row, this.deleteConfirm);
    }
  }

  ngOnChanges(){
    this.isActionEdit = this.grid.getSetting('actions.edit');
    this.isActionDelete = this.grid.getSetting('actions.delete');
    this.editRowButtonContent = this.grid.getSetting('edit.editButtonContent');
    this.deleteRowButtonContent = this.grid.getSetting('delete.deleteButtonContent');
  }
}
