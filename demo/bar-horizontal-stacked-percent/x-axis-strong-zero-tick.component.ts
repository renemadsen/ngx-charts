import {
  Component,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  OnChanges,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';

import { XAxisTicksStrongZeroTickComponent } from './x-axis-ticks-strong-zero-tick.component';

@Component({
  selector: 'g[ngx-charts-x-axis-strong-zero-tick]',
  template: `
    <svg:g
      [attr.class]="xAxisClassName"
      [attr.transform]="transform">
      <svg:g ngx-charts-x-axis-ticks-strong-zero-tick
        *ngIf="xScale"
        [trimTicks]="trimTicks"
        [maxTickLength]="maxTickLength"
        [tickFormatting]="tickFormatting"
        [tickArguments]="tickArguments"
        [tickStroke]="tickStroke"
        [scale]="xScale"
        [orient]="xOrient"
        [showGridLines]="showGridLines"
        [gridLineHeight]="dims.height"
        [width]="dims.width"
        [tickValues]="ticks"
        (dimensionsChanged)="emitTicksHeight($event)"
      />
      <svg:g ngx-charts-axis-label
        *ngIf="showLabel"
        [label]="labelText"
        [offset]="labelOffset"
        [orient]="'bottom'"
        [height]="dims.height"
        [width]="dims.width">
      </svg:g>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XAxisStrongZeroTickComponent implements OnChanges {

  @Input() xScale;
  @Input() dims;
  @Input() trimTicks: boolean;
  @Input() maxTickLength: number;
  @Input() tickFormatting;
  @Input() showGridLines = false;
  @Input() showLabel;
  @Input() labelText;
  @Input() ticks: any[];
  @Input() xAxisTickInterval;
  @Input() xAxisTickCount: any;
  @Input() xOrient: string = 'bottom';
  @Input() xAxisOffset: number = 0;

  @Output() dimensionsChanged = new EventEmitter();

  xAxisClassName: string = 'x axis';

  tickArguments: any;
  transform: any;
  labelOffset: number = 0;
  fill: string = 'none';
  stroke: string = 'stroke';
  tickStroke: string = '#ccc';
  strokeWidth: string = 'none';
  padding: number = 5;

  @ViewChild(XAxisTicksStrongZeroTickComponent) ticksComponent: XAxisStrongZeroTickComponent;

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.transform = `translate(0,${this.xAxisOffset + this.padding + this.dims.height})`;

    if (typeof this.xAxisTickCount !== 'undefined') {
      this.tickArguments = [this.xAxisTickCount];
    }
  }

  emitTicksHeight({ height }): void {
    const newLabelOffset = height + 25 + 5;
    if (newLabelOffset !== this.labelOffset) {
      this.labelOffset = newLabelOffset;
      setTimeout(() => {        
        this.dimensionsChanged.emit({height});
      }, 0);
    }
  }

}
