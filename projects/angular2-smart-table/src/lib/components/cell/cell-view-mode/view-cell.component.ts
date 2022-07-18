import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {Cell} from '../../../lib/data-set/cell';

@Component({
  selector: 'table-cell-view-mode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngSwitch]="cell.getColumn().type">
        <custom-view-component *ngSwitchCase="'custom'" [cell]="cell"></custom-view-component>
        <div *ngSwitchCase="'html'" [innerHTML]="cell.getValue()" [ngClass]="cssClass"></div>
        <div *ngSwitchDefault [ngClass]="cssClass">{{ cell.getValue() }}</div>
    </div>
    `,
})
export class ViewCellComponent {

  @Input() cell!: Cell;

  get cssClass(): string {
    return this.cell.getColumn().classContent ?? ''
  }
}
