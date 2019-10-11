import { OnChanges, SimpleChanges, EventEmitter, TemplateRef } from '@angular/core';
export declare class TreeMapCellSeriesComponent implements OnChanges {
    data: any;
    dims: any;
    colors: any;
    valueFormatting: any;
    labelFormatting: any;
    gradient: boolean;
    tooltipDisabled: boolean;
    tooltipTemplate: TemplateRef<any>;
    animations: boolean;
    showLabel: boolean;
    activeEntries: any[];
    select: EventEmitter<{}>;
    activate: EventEmitter<{}>;
    deactivate: EventEmitter<{}>;
    dblclick: EventEmitter<{}>;
    cells: any[];
    ngOnChanges(changes: SimpleChanges): void;
    getCells(): any[];
    getTooltipText({ label, value }: {
        label: any;
        value: any;
    }): string;
    onClick(data: any): void;
    trackBy(index: any, item: any): string;
    isActive(entry: any): boolean;
}
