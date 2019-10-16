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

import { XAxisTicksComponent } from './x-axis-ticks.component';

@Component({
  selector: 'g[ngx-charts-x-axis]',
  template: `
    <svg:g [attr.class]="xAxisClassName" [attr.transform]="transform">
      <svg:g
        ngx-charts-x-axis-ticks
        *ngIf="xScale"
        [trimTicks]="trimTicks"
        [rotateTicks]="rotateTicks"
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
      <svg:g *ngIf="showXAxisLineTop" [attr.transform]="gridLineTransform()">
        <svg:line 
          class="gridline-path gridline-path-vertical"
          [attr.x1]="0"
          [attr.x2]="dims.width"
          [attr.y1]="-dims.height"
          [attr.y2]="-dims.height"
        />
      </svg:g>
      <svg:g *ngIf="showXAxisLineBottom" [attr.transform]="gridLineTransform()">
        <svg:line class="gridline-path gridline-path-vertical"  [attr.x1]="0" [attr.x2]="dims.width" />
      </svg:g>
      <svg:g
        ngx-charts-axis-label
        [attr.class]="'axis-label'"
        *ngIf="showLabel"
        [label]="labelText"
        [offset]="labelOffset"
        [orient]="'bottom'"
        [height]="dims.height"
        [width]="dims.width"
      ></svg:g>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XAxisComponent implements OnChanges {
  @Input() xScale;
  @Input() dims;
  @Input() trimTicks: boolean;
  @Input() rotateTicks: boolean = true;
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
  @Input() showXAxisLineTop: boolean = false;
  @Input() showXAxisLineBottom: boolean = false;

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

  @ViewChild(XAxisTicksComponent, { static: false }) ticksComponent: XAxisTicksComponent;

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.transform = `translate(0,${this.xAxisOffset + this.padding + this.dims.height})`;

    if (typeof this.xAxisTickCount !== 'undefined') {
      this.tickArguments = [this.xAxisTickCount];
    }
  }

  gridLineTransform(): string {
    return `translate(0, ${this.padding * -1})`;
  }

  emitTicksHeight({ height }): void {
    const newLabelOffset = height + 25 + 5;
    if (newLabelOffset !== this.labelOffset) {
      this.labelOffset = newLabelOffset;
      setTimeout(() => {
        this.dimensionsChanged.emit({ height });
      }, 0);
    }
  }
}
