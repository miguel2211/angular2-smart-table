import { Component, Output, EventEmitter, Input } from '@angular/core';

import { Cell } from '../../../lib/data-set/cell';

@Component({
  template: ''
})
export class EditCellDefault {

  @Input() cell!: Cell;
  @Input() inputClass: string = '';

  @Output() edited = new EventEmitter<void>();

  onEdited(): boolean {
    this.edited.emit();
    return false;
  }

  onStopEditing(): boolean {
    this.cell.getRow().isInEditing = false;
    return false;
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
