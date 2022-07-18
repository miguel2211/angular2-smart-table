import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

import {Grid} from '../../../lib/grid';

@Component({
  // TODO: @breaking-change rename the selector to angular2-st-thead-create-cancel in the next major version
  selector: 'angular2-st-actions',
  template: `
    <a href="#" class="angular2-smart-action angular2-smart-action-add-create"
        [innerHTML]="createButtonContent" (click)="onCreate($event)"></a>
    <a href="#" class="angular2-smart-action angular2-smart-action-add-cancel"
        [innerHTML]="cancelButtonContent" (click)="onCancelCreate($event)"></a>
  `,
})
export class TheadCreateCancelComponent implements OnChanges {

  @Input() grid!: Grid;
  @Input() createConfirm!: EventEmitter<any>;
  @Input() createCancel!: EventEmitter<any>;
  @Output() create = new EventEmitter<any>();

  createButtonContent!: string;
  cancelButtonContent!: string;

  onCreate(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.grid.create(this.grid.getNewRow(), this.createConfirm);
  }

  onCancelCreate(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.grid.createFormShown = false;
    this.createCancel.emit({
      discardedData: this.grid.getNewRow().getNewData(),
      source: this.grid.source,
    });
  }

  ngOnChanges() {
    this.createButtonContent = this.grid.getSetting('add.createButtonContent');
    this.cancelButtonContent = this.grid.getSetting('add.cancelButtonContent');
  }
}
