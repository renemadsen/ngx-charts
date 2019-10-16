var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { XAxisTicksComponent } from './x-axis-ticks.component';
var XAxisComponent = /** @class */ (function () {
    function XAxisComponent() {
        this.rotateTicks = true;
        this.showGridLines = false;
        this.xOrient = 'bottom';
        this.xAxisOffset = 0;
        this.showXAxisLineTop = false;
        this.showXAxisLineBottom = false;
        this.dimensionsChanged = new EventEmitter();
        this.xAxisClassName = 'x axis';
        this.labelOffset = 0;
        this.fill = 'none';
        this.stroke = 'stroke';
        this.tickStroke = '#ccc';
        this.strokeWidth = 'none';
        this.padding = 5;
    }
    XAxisComponent.prototype.ngOnChanges = function (changes) {
        this.update();
    };
    XAxisComponent.prototype.update = function () {
        this.transform = "translate(0," + (this.xAxisOffset + this.padding + this.dims.height) + ")";
        if (typeof this.xAxisTickCount !== 'undefined') {
            this.tickArguments = [this.xAxisTickCount];
        }
    };
    XAxisComponent.prototype.gridLineTransform = function () {
        return "translate(0, " + this.padding * -1 + ")";
    };
    XAxisComponent.prototype.emitTicksHeight = function (_a) {
        var _this = this;
        var height = _a.height;
        var newLabelOffset = height + 25 + 5;
        if (newLabelOffset !== this.labelOffset) {
            this.labelOffset = newLabelOffset;
            setTimeout(function () {
                _this.dimensionsChanged.emit({ height: height });
            }, 0);
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], XAxisComponent.prototype, "xScale", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], XAxisComponent.prototype, "dims", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], XAxisComponent.prototype, "trimTicks", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], XAxisComponent.prototype, "rotateTicks", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], XAxisComponent.prototype, "maxTickLength", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], XAxisComponent.prototype, "tickFormatting", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], XAxisComponent.prototype, "showGridLines", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], XAxisComponent.prototype, "showLabel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], XAxisComponent.prototype, "labelText", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], XAxisComponent.prototype, "ticks", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], XAxisComponent.prototype, "xAxisTickInterval", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], XAxisComponent.prototype, "xAxisTickCount", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], XAxisComponent.prototype, "xOrient", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], XAxisComponent.prototype, "xAxisOffset", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], XAxisComponent.prototype, "showXAxisLineTop", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], XAxisComponent.prototype, "showXAxisLineBottom", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], XAxisComponent.prototype, "dimensionsChanged", void 0);
    __decorate([
        ViewChild(XAxisTicksComponent, { static: false }),
        __metadata("design:type", XAxisTicksComponent)
    ], XAxisComponent.prototype, "ticksComponent", void 0);
    XAxisComponent = __decorate([
        Component({
            selector: 'g[ngx-charts-x-axis]',
            template: "\n    <svg:g [attr.class]=\"xAxisClassName\" [attr.transform]=\"transform\">\n      <svg:g\n        ngx-charts-x-axis-ticks\n        *ngIf=\"xScale\"\n        [trimTicks]=\"trimTicks\"\n        [rotateTicks]=\"rotateTicks\"\n        [maxTickLength]=\"maxTickLength\"\n        [tickFormatting]=\"tickFormatting\"\n        [tickArguments]=\"tickArguments\"\n        [tickStroke]=\"tickStroke\"\n        [scale]=\"xScale\"\n        [orient]=\"xOrient\"\n        [showGridLines]=\"showGridLines\"\n        [gridLineHeight]=\"dims.height\"\n        [width]=\"dims.width\"\n        [tickValues]=\"ticks\"\n        (dimensionsChanged)=\"emitTicksHeight($event)\"\n      />\n      <svg:g *ngIf=\"showXAxisLineTop\" [attr.transform]=\"gridLineTransform()\">\n        <svg:line \n          class=\"gridline-path gridline-path-vertical\"\n          [attr.x1]=\"0\"\n          [attr.x2]=\"dims.width\"\n          [attr.y1]=\"-dims.height\"\n          [attr.y2]=\"-dims.height\"\n        />\n      </svg:g>\n      <svg:g *ngIf=\"showXAxisLineBottom\" [attr.transform]=\"gridLineTransform()\">\n        <svg:line class=\"gridline-path gridline-path-vertical\"  [attr.x1]=\"0\" [attr.x2]=\"dims.width\" />\n      </svg:g>\n      <svg:g\n        ngx-charts-axis-label\n        [attr.class]=\"'axis-label'\"\n        *ngIf=\"showLabel\"\n        [label]=\"labelText\"\n        [offset]=\"labelOffset\"\n        [orient]=\"'bottom'\"\n        [height]=\"dims.height\"\n        [width]=\"dims.width\"\n      ></svg:g>\n    </svg:g>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush
        })
    ], XAxisComponent);
    return XAxisComponent;
}());
export { XAxisComponent };
//# sourceMappingURL=x-axis.component.js.map