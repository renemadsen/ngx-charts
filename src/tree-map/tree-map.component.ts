import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { treemap, stratify } from 'd3-hierarchy';

import { BaseChartComponent } from '../common/base-chart.component';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { DataItem } from '../models/chart-data.model';
import { ScaleType } from '../utils/scale-type.enum';
import {LegendPosition} from '../common/legend/legend-position.enum';

@Component({
  selector: 'ngx-charts-tree-map',
  template: `
    <ngx-charts-chart 
    [view]="[width, height]"
    [showLegend]="legend"
    [legendOptions]="legendOptions"
    [valuedata]="valuedata"
    [activeEntries]="activeEntries"
    [animations]="animations"
    (legendLabelActivate)="onActivate($event)"
    (legendLabelDeactivate)="onDeactivate($event)"
    (legendLabelClick)="onClick($event)"
    >
      <svg:g [attr.transform]="transform" class="tree-map chart">
        <svg:g
          ngx-charts-tree-map-cell-series
          [colors]="colors"
          [data]="data"
          [dims]="dims"
          [activeEntries]="activeEntries"
          [tooltipDisabled]="tooltipDisabled"
          [tooltipTemplate]="tooltipTemplate"
          [valueFormatting]="valueFormatting"
          [labelFormatting]="labelFormatting"
          [gradient]="gradient"
          [showLabel]="showLabel"
          [animations]="animations"
          (activate)="onActivate($event)"
          (deactivate)="onDeactivate($event)"
          (select)="onClick($event)"
        />
      </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: ['./tree-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeMapComponent extends BaseChartComponent {
  // @Input() results;
  @Input() activeEntries: any[] = [];
  @Input() legend = true;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition = LegendPosition.below;
  @Input() tooltipDisabled: boolean = false;
  @Input() valueFormatting: any;
  @Input() labelFormatting: any;
  @Input() gradient: boolean = false;
  @Input() showLabel: boolean = true;

  @Output() select = new EventEmitter();
  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate', { static: false }) tooltipTemplate: TemplateRef<any>;

  dims: any;
  domain: any;
  transform: any;
  colors: ColorHelper;
  treemap: any;
  data: any;
  valuedata = [];
  legendData: any;
  margin = [0, 0, 0, 0];
  legendOptions: any;

  update(): void {
    super.update();

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showLegend: this.legend,
      legendPosition: this.legendPosition
    });

    this.domain = this.getDomain();

    this.treemap = treemap<any>().size([this.dims.width, this.dims.height]);

    const rootNode = {
      name: 'root',
      value: 0,
      isRoot: true
    };

    const root = stratify<any>()
      .id(d => {
        let label = d.name;

        if (label.constructor.name === 'Date') {
          label = label.toLocaleDateString();
        } else {
          label = label.toLocaleString();
        }
        return label;
      })
      .parentId(d => (d.isRoot ? null : 'root'))([rootNode, ...this.results])
      .sum(d => d.value);

    this.data = this.treemap(root);

    this.setColors();
    this.getCells();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
  }

  getCells(): any[] {
    return this.data.children
      .filter(d => {
        return d.depth === 1;
      })
      .map((d, index) => {
        this.valuedata.push(d.value);
      });
  }

  getLegendOptions() {
    return {
      scaleType: 'ordinal',
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

  getDomain(): any[] {
    return this.results.map(d => d.name);
  }

  onClick(data: DataItem): void {
    this.select.emit(data);
  }

  setColors(): void {
    this.colors = new ColorHelper(this.scheme, ScaleType.ordinal, this.domain, this.customColors);
  }
}
