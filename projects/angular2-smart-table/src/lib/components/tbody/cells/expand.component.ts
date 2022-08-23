import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {Row} from "../../../lib/data-set/row";
import {Grid} from "../../../lib/grid";
import {SecurityTrustType} from '../../../pipes/bypass-security-trust.pipe';

@Component({
    selector: 'angular2-st-tbody-expand',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
      <a href="#" class="angular2-smart-action angular2-smart-action-expand-expand"
          [innerHTML]="expandRowButtonContent | bypassSecurityTrust: bypassSecurityTrust" (click)="onExpand($event)"></a>
    `,
  })
  export class TbodyExpandRowComponent implements OnChanges {

    @Input() grid!: Grid;
    @Input() row!: Row;

    @Output() onExpandRow = new EventEmitter<any>();

    expandRowButtonContent!: string;
    bypassSecurityTrust: SecurityTrustType = 'none';

    constructor(){
    }

    onExpand(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.onExpandRow.emit(this.row);
    }


    ngOnChanges(){
        this.expandRowButtonContent = this.grid.getSetting('expand.expandRowButtonContent');
        this.bypassSecurityTrust = this.grid.settings.expand?.sanitizer?.bypassHtml ? 'html' : 'none';
    }
  }
