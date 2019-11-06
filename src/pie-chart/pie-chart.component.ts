import {
  Component,
  Input,
  Output,
  ViewEncapsulation,
  EventEmitter,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
import { DataItem } from '../models/chart-data.model';
import { LegendPosition } from '../common/legend/legend-position.enum';
import { LegendOptions } from '../common/legend/legend-options';
import { ScaleType } from '../utils/scale-type.enum';

@Component({
  selector: 'ngx-charts-pie-chart',
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [legendAdvanced]="legendAdvanced"
      [advancedData]="data"
      [legendOptions]="legendOptions"
      [activeEntries]="activeEntries"
      [animations]="animations"
      (legendLabelActivate)="onActivate($event, true)"
      (legendLabelDeactivate)="onDeactivate($event, true)"
      (legendLabelClick)="onClick($event)"
    >
      <svg:g [attr.transform]="translation" class="pie-chart chart">
        <svg:g
          ngx-charts-pie-series
          [colors]="colors"
          [series]="data"
          [showLabels]="labels"
          [labelFormatting]="labelFormatting"
          [trimLabels]="trimLabels"
          [maxLabelLength]="maxLabelLength"
          [activeEntries]="activeEntries"
          [innerRadius]="innerRadius"
          [outerRadius]="outerRadius"
          [explodeSlices]="explodeSlices"
          [gradient]="gradient"
          [animations]="animations"
          [tooltipDisabled]="tooltipDisabled"
          [tooltipTemplate]="tooltipTemplate"
          [tooltipText]="tooltipText"
          [showSum]="doughnut && showDoughnutSum"
          (dblclick)="dblclick.emit($event)"
          (select)="onClick($event)"
          (activate)="onActivate($event)"
          (deactivate)="onDeactivate($event)"
        />
      </svg:g>
    </ngx-charts-chart>
    
    <div class="totalValue"  *ngIf="doughnut" [ngStyle]="setMyStyles()">
      <div 
        *ngIf="animations"
        class="item-value"
        ngx-charts-count-up
        [countTo]="totalNumber"
      ></div>
      <p>{{totalLabel}}</p>
    </div>

  `,
  styleUrls: ['../common/base-chart.component.scss', './pie-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartComponent extends BaseChartComponent {
  @Input() labels = false;
  @Input() legend = false;
  @Input() legendAdvanced: boolean = false;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition = LegendPosition.right;
  @Input() explodeSlices = false;
  @Input() doughnut = false;
  @Input() totalValue: string;
  @Input() totalLabel: string;
  @Input() showDoughnutSum = false;
  @Input() arcWidth = 0.25;
  @Input() gradient: boolean;
  @Input() activeEntries: any[] = [];
  @Input() tooltipDisabled: boolean = false;
  @Input() labelFormatting: any;
  @Input() trimLabels: boolean = true;
  @Input() maxLabelLength: number = 10;
  @Input() tooltipText: any;
  @Output() dblclick = new EventEmitter();
  // optional margins
  @Input() margins: number[];
  @Output() select = new EventEmitter();
  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate', { static: false }) tooltipTemplate: TemplateRef<any>;

  translation: string;
  labelTranslation: string;
  labelWidth: number;
  outerRadius: number;
  innerRadius: number;
  data: any;
  colors: ColorHelper;
  domain: any;
  dims: any;
  legendOptions: any;
  totalNumber: any = 0;
  xOffset: number;
  yOffset: number;
  labelTranslationX: any;

  update(): void {
    super.update();

    if (this.labels && this.hasNoOptionalMarginsSet()) {
      this.margins = [30, 80, 30, 80];
    } else if (!this.labels && this.hasNoOptionalMarginsSet()) {
      // default value for margins
      this.margins = [20, 20, 20, 20];
    }

    let showLegend = this.legend;

    if (this.legendAdvanced) {
      showLegend = true;
    }

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margins,
      showLegend,
      legendPosition: this.legendPosition
    });

    this.formatDates();
    this.getTotalLabel();

    const xOffset = this.margins[3] + this.dims.width / 2;
    const yOffset = this.margins[0] + this.dims.height / 2;
    this.translation = `translate(${xOffset}, ${yOffset})`;
    this.outerRadius = Math.min(this.dims.width, this.dims.height);
    if (this.labels) {
      // make room for labels
      this.outerRadius /= 3;
    } else {
      this.outerRadius /= 2;
    }
    this.innerRadius = 0;
    if (this.doughnut) {
      this.innerRadius = this.outerRadius * (1 - this.arcWidth);
    }

    this.domain = this.getDomain();

    // sort data according to domain
    this.data = this.results.sort((a, b) => {
      return this.domain.indexOf(a.name) - this.domain.indexOf(b.name);
    });
    
    this.setColors();
    this.legendOptions = this.getLegendOptions();
  }

  setMyStyles() {
    const xOffset = this.margins[3] + this.dims.width / 2;
    const yOffset = this.margins[0] + this.dims.height / 2;
    this.labelWidth = this.outerRadius * 0.8;

    const styles = {
      position: 'absolute',
      width: this.labelWidth + 'px',
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      'text-align': 'center',
      top: 0,
      left: 0,
      transform: 'translate(' + (xOffset - this.labelWidth / 2) + 'px, ' + (yOffset - 30) + 'px)'
    };
    return styles;
  }

  getTotalLabel() {
    if (this.totalValue) {
      this.totalNumber = this.totalValue;
    } else {
      this.totalNumber = 0;

      this.results.forEach(d => {
        this.totalNumber = this.totalNumber + d.value;
      });
    }
  }

  getDomain(): any[] {
    return this.results.map(d => d.label);
  }

  onClick(data: DataItem): void {
    this.select.emit(data);
  }

  setColors(): void {
    this.colors = new ColorHelper(this.scheme, ScaleType.ordinal, this.domain, this.customColors);
  }

  getLegendOptions(): LegendOptions {
    return {
      scaleType: ScaleType.ordinal,
      domain: this.domain,
      colors: this.colors,
      title: this.legendTitle,
      position: this.legendPosition
    };
  }

  onActivate(item, fromLegend = false) {
    item = this.results.find(d => {
      if (fromLegend) {
        return d.label === item.name;
      } else {
        return d.name === item.name;
      }
    });

    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value && d.series === item.series;
    });
    if (idx > -1) {
      return;
    }

    this.activeEntries = [item, ...this.activeEntries];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(item, fromLegend = false) {
    item = this.results.find(d => {
      if (fromLegend) {
        return d.label === item.name;
      } else {
        return d.name === item.name;
      }
    });

    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value && d.series === item.series;
    });

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }

  private hasNoOptionalMarginsSet(): boolean {
    return !this.margins || this.margins.length <= 0;
  }
}
