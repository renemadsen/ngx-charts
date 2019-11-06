import {
  Component, Input, ChangeDetectionStrategy, Output, EventEmitter,
  SimpleChanges, OnChanges, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import { formatLabel } from '../label.helper';
import { ColorHelper } from '../color.helper';

@Component({
  selector: 'ngx-charts-legend',
  template: `
    <div [style.width.px]="width">
      <header class="legend-title" *ngIf="title?.length > 0">
        <span class="legend-title-text">{{title}}</span>
      </header>
      <div class="legend-wrap">
        <ul class="legend-labels"
          [class.horizontal-legend]="horizontal"
          [style.max-height.px]="height - 45">
          <li
            *ngFor="let entry of legendEntries; trackBy: trackBy"
            class="legend-label">
            <ngx-charts-legend-entry
              [label]="entry.label"
              [formattedLabel]="entry.formattedLabel"
              [value]="entry.val"
              [color]="entry.color"
              [isActive]="isActive(entry)"
              (select)="labelClick.emit($event)"
              (activate)="activate($event)"
              (deactivate)="deactivate($event)">
            </ngx-charts-legend-entry>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./legend.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendComponent implements OnChanges {

  @Input() data;
  @Input() valuedata;
  @Input() title;
  @Input() colors: ColorHelper;
  @Input() height;
  @Input() width;
  @Input() activeEntries;
  @Input() horizontal = false;

  @Output() labelClick: EventEmitter<any> = new EventEmitter();
  @Output() labelActivate: EventEmitter<any> = new EventEmitter();
  @Output() labelDeactivate: EventEmitter<any> = new EventEmitter();

  legendEntries: any[] = [];

  constructor(private cd: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.cd.markForCheck();
    this.legendEntries = this.getLegendEntries();
  }

  getLegendEntries(): any[] {
    const items = [];
    let counter = 0;

    for (const label of this.data) {
      const formattedLabel = formatLabel(label);

      let val = null;

      if (this.valuedata) {
        val = this.valuedata[counter];
      }

      const idx = items.findIndex((i) => {
        return i.label === formattedLabel;
      });

      if (idx === -1) {
        items.push({
          label,
          formattedLabel,
          color: this.colors.getColor(label),
          val
        });
      }

      counter += 1;
    }

    return items;
  }

  isActive(entry): boolean {
    if (!this.activeEntries) return false;
    const item = this.activeEntries.find(d => {
      return entry.label === d.name;
    });
    return item !== undefined;
  }

  activate(item) {
    this.labelActivate.emit(item);
  }

  deactivate(item) {
    this.labelDeactivate.emit(item);
  }

  trackBy(index, item): string {
    return item.label;
  }

}
