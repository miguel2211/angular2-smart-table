import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output} from '@angular/core';

import {Grid} from '../../../lib/grid';
import {DataSource} from '../../../lib/data-source/data-source';
import {CreateEvent} from '../../../lib/events';
import {SecurityTrustType} from '../../../pipes/bypass-security-trust.pipe';

@Component({
  selector: '[angular2-st-add-button]',
  template: `
    <a *ngIf="isActionAdd" href="#" class="angular2-smart-action angular2-smart-action-add-add"
        [innerHTML]="addNewButtonContent | bypassSecurityTrust: bypassSecurityTrust" (click)="onAdd($event)"></a>
  `,
})
export class AddButtonComponent implements AfterViewInit, OnChanges {

  @Input() grid!: Grid;
  @Input() source!: DataSource;
  @Output() create = new EventEmitter<CreateEvent>();

  isActionAdd!: boolean;
  addNewButtonContent!: string;
  bypassSecurityTrust: SecurityTrustType = 'none';

  constructor(private ref: ElementRef) {
  }

  ngAfterViewInit() {
    this.ref.nativeElement.classList.add('angular2-smart-actions-title', 'angular2-smart-actions-title-add');
  }

  ngOnChanges() {
    this.isActionAdd = this.grid.getSetting('actions.add');
    this.addNewButtonContent = this.grid.getSetting('add.addButtonContent');
    this.bypassSecurityTrust = this.grid.settings.add?.sanitizer?.bypassHtml ? 'html' : 'none';
  }

  onAdd(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.grid.getSetting('mode') === 'external') {
      this.create.emit({
        source: this.source,
      });
    } else {
      this.grid.createFormShown = true;
    }
  }
}
