import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Row} from '../../../lib/data-set/row';

import {Grid} from '../../../lib/grid';
import {CustomAction} from '../../../lib/settings';
import {CustomActionEvent} from '../../../lib/events';

@Component({
  selector: 'angular2-st-tbody-custom',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngFor="let action of customActions">
      <a href="#" class="angular2-smart-action angular2-smart-action-custom-custom"
         *ngIf="!action.renderComponent"
         [innerHTML]="action.title"
         (click)="onCustom(action, $event)"></a>
      <a href="#" class="angular2-smart-action angular2-smart-action-custom-custom"
         *ngIf="action.renderComponent"
         (click)="onCustom(action, $event)">
        <angular2-st-tbody-custom-item class="angular2-smart-action angular2-smart-action-custom-custom"
                                  [action]="action"
                                  [row]="row"></angular2-st-tbody-custom-item>
      </a>

    </ng-container>
  `,
})
export class TbodyCustomComponent {

  @Input() grid!: Grid;
  @Input() row!: Row;
  @Input() source: any;
  @Output() custom = new EventEmitter<CustomActionEvent>();

  get customActions(): CustomAction[] {
    return this.grid.getSetting('actions.custom') ?? [];
  }

  onCustom(action: CustomAction, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.custom.emit({
      action: action.name,
      row: this.row,
      data: this.row.getData(),
      source: this.source,
    });
  }

}
