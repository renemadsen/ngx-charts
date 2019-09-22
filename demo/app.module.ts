import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF, Location } from '@angular/common';
import { AppComponent } from './app.component';
import { SparklineComponent } from './sparkline/sparkline.component';
import { TimelineFilterBarChartComponent } from './timeline-filter-bar-chart/timeline-filter-bar-chart.component';
import { NgxChartsModule } from '../src';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { ComboChartComponent, ComboSeriesVerticalComponent } from './combo-chart';
import { LineChartWithIconsComponent } from './line-chart-with-icons/line-chart-with-icons.component';
import { BarHorizontalStackedPercentComponent } from './bar-horizontal-stacked-percent/bar-horizontal-stacked-percent.component';
import { SeriesHorizontalPercent } from './bar-horizontal-stacked-percent/series-horizontal-percent.component';
import { XAxisStrongZeroTickComponent } from './bar-horizontal-stacked-percent/x-axis-strong-zero-tick.component';
import { XAxisTicksStrongZeroTickComponent } from './bar-horizontal-stacked-percent/x-axis-ticks-strong-zero-tick.component';

@NgModule({
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: getBaseLocation
    }
  ],
  imports: [
    NgxChartsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxUIModule
  ],
  declarations: [
    AppComponent,
    SparklineComponent,
    TimelineFilterBarChartComponent,
    ComboChartComponent,
    ComboSeriesVerticalComponent,
    LineChartWithIconsComponent,
    BarHorizontalStackedPercentComponent,
    SeriesHorizontalPercent,
    XAxisStrongZeroTickComponent,
    XAxisTicksStrongZeroTickComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getBaseLocation() {
    const paths: string[] = location.pathname.split('/').splice(1, 1);
    const basePath: string = (paths && paths[0]) || '';
    return '/' + basePath;
}
