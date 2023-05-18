/* eslint-disable no-case-declarations */
// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DateRange, MatCalendar } from '@angular/material/datepicker';
import { FilterService, InsightsFilters } from '@app/shared/services/filter.service';
import { DATE_RANGE_DEFAULT, getCurrentPreviousPeriodDateRanges } from '@app/shared/utils/cubejs-helpers';
import { faTimes, IconDefinition, faChevronRight, faChevronLeft } from '@fortawesome/pro-light-svg-icons';
import { DateRangesEnum } from 'lfx-insights';
import _ from 'lodash';
import { DateTime } from 'luxon';
import * as moment from 'moment';

@Component({
  selector: 'lfx-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss']
})
export class DateRangeFilterComponent implements OnInit {
  @Input() public filterDateSelected = DateRangesEnum.lastYear;
  @Input() public filterDatesOptions = [
    DateRangesEnum.today,
    DateRangesEnum.last7,
    DateRangesEnum.last30,
    DateRangesEnum.lastQuarter,
    DateRangesEnum.lastYear,
    DateRangesEnum.last2Years,
    DateRangesEnum.allTime,
    DateRangesEnum.custom
  ];

  @Output() public readonly filterDateSelectedChange = new EventEmitter<string>();
  @Output() public readonly filterHideBotsChange = new EventEmitter<boolean>();

  @ViewChild('fromCal') private fromCalendar: MatCalendar<Date>;
  @ViewChild('toCal') private toCalendar!: MatCalendar<Date>;

  public isDisplayed = false;
  public hideBots = true;
  public icons: { [key: string]: IconDefinition } = {
    times: faTimes,
    chevronRight: faChevronRight,
    chevronLeft: faChevronLeft
  };
  public selectedDateRange: DateRange<Date> | Date = new Date();

  public fromViewDate: Date = moment().subtract(1, 'month').toDate();
  public toViewDate: Date = moment().toDate();
  public compare = 'PP';
  public selectedDateDisplay: DateRangesEnum | string = this.filterDateSelected;
  public defaultMaxDate = moment().endOf('day').toDate();
  public defaultMinDate = new Date('1/1/2000');
  private selectedFilter: InsightsFilters = {};
  public constructor(private filterService: FilterService) {}

  public ngOnInit(): void {
    this.fillDateFilterFromService();
  }

  public get duration(): number {
    if (this.selectedDateRange instanceof DateRange<Date>) {
      if (this.selectedDateRange.start && this.selectedDateRange.end) {
        return DateTime.fromJSDate(this.selectedDateRange.end).diff(DateTime.fromJSDate(this.selectedDateRange.start), 'days').days;
      }
    }

    return 1;
  }

  public onChangeHideBots() {
    this.filterHideBotsChange.emit(this.hideBots);
    this.applyFilterPartially({
      hideBots: this.hideBots
    });
  }

  public onChangeCompare() {
    this.applyFilterPartially({
      compare: this.compare
    });
  }

  public getCompareFilterslabel() {
    return this.compare;
  }

  public onSelectDateFilter(filterDateOption: DateRangesEnum) {
    this.filterDateSelected = filterDateOption;
    const currentDate = new Date();
    const startDate = new Date();

    this.selectedDateDisplay = filterDateOption;
    switch (filterDateOption) {
      case DateRangesEnum.today:
        this.selectedDateRange = currentDate;
        this.moveCalendarView(startDate, currentDate);
        break;
      case DateRangesEnum.yesterday:
        currentDate.setDate(currentDate.getDate() - 1);
        this.selectedDateRange = currentDate;
        break;
      case DateRangesEnum.last7:
        startDate.setDate(currentDate.getDate() - 7);
        this.selectedDateRange = new DateRange(startDate, currentDate);
        this.moveCalendarView(startDate, currentDate);
        break;
      case DateRangesEnum.last15:
        startDate.setDate(currentDate.getDate() - 15);
        this.selectedDateRange = new DateRange(startDate, currentDate);
        this.moveCalendarView(startDate, currentDate);
        break;
      case DateRangesEnum.last30:
        startDate.setDate(currentDate.getDate() - 30);
        this.selectedDateRange = new DateRange(startDate, currentDate);
        this.moveCalendarView(startDate, currentDate);
        break;
      case DateRangesEnum.lastQuarter:
        const lastQuarter = moment(currentDate.getTime()).subtract(1, 'quarter');
        this.selectedDateRange = new DateRange(lastQuarter.startOf('quarter').toDate(), lastQuarter.endOf('quarter').toDate());
        this.moveCalendarView(lastQuarter.startOf('quarter').toDate(), lastQuarter.endOf('quarter').toDate());
        break;
      case DateRangesEnum.last2Quarters:
        const startOfLast2Quarter = moment(currentDate.getTime()).subtract(2, 'quarter').startOf('quarter');
        const endOfLastQuarter = moment(currentDate.getTime()).subtract(1, 'quarter').endOf('quarter');
        this.selectedDateRange = new DateRange(startOfLast2Quarter.toDate(), endOfLastQuarter.toDate());
        this.moveCalendarView(startOfLast2Quarter.toDate(), endOfLastQuarter.toDate());
        break;
      case DateRangesEnum.lastYear:
        const lastYear = moment(currentDate.getTime()).subtract(1, 'year');
        this.selectedDateRange = new DateRange(lastYear.startOf('year').toDate(), lastYear.endOf('year').toDate());
        this.moveCalendarView(lastYear.startOf('year').toDate(), lastYear.endOf('year').toDate());
        break;
      case DateRangesEnum.last2Years:
        const last2Year = moment(currentDate.getTime()).subtract(2, 'year');
        this.selectedDateRange = new DateRange(last2Year.toDate(), currentDate);
        this.moveCalendarView(last2Year.toDate(), currentDate);
        break;
      case DateRangesEnum.last5Years:
        const last5Year = moment(currentDate.getTime()).subtract(5, 'year');
        this.selectedDateRange = new DateRange(last5Year.toDate(), currentDate);
        this.moveCalendarView(last5Year.toDate(), currentDate);
        break;
      case DateRangesEnum.allTime:
        const alltime = moment(currentDate.getTime()).subtract(10, 'year');
        this.selectedDateRange = new DateRange(alltime.toDate(), currentDate);
        this.moveCalendarView(alltime.toDate(), currentDate);
        break;
      default:
        this.selectedDateRange = new DateRange(currentDate, currentDate);
    }

    this.filterDateSelectedChange.emit(filterDateOption);
    this.applyFilterPartially({
      dateFilters: filterDateOption
    });
  }

  public onOutsideClick(target?: HTMLElement) {
    if (target && target.className?.includes && target.className?.includes('mat-calendar')) {
      return;
    }
    this.isDisplayed = false;
    this.fillDateFilterFromService();
  }

  public openOptions() {
    this.isDisplayed = !this.isDisplayed;
  }

  public onSelectedChange(date: Date): void {
    if (this.selectedDateRange instanceof DateRange<Date>) {
      this.filterDateSelected = DateRangesEnum.custom;
      if (this.selectedDateRange && this.selectedDateRange.start && date > this.selectedDateRange.start && !this.selectedDateRange.end) {
        this.selectedDateRange = new DateRange(this.selectedDateRange.start, date);
      } else {
        this.selectedDateRange = new DateRange(date, null);
      }
    } else {
      this.selectedDateRange = date;
      const currentDate = new Date();
      if (date.getMonth() === currentDate.getMonth() && date.getDate() === currentDate.getDate() && date.getFullYear() === currentDate.getFullYear()) {
        this.filterDateSelected = DateRangesEnum.today;
      } else {
        this.filterDateSelected = DateRangesEnum.custom;
        // switching to date range selection
        this.selectedDateRange = new DateRange(date, null);
      }
    }
  }

  public onCalendarNavigate(incDec: number) {
    const tmpNewToDate = new Date(this.toViewDate.getFullYear(), this.toViewDate.getMonth() + incDec);
    const currentDate = new Date();

    if (tmpNewToDate.getTime() > currentDate.getTime()) {
      return;
    }

    this.fromViewDate = new Date(tmpNewToDate.getFullYear(), tmpNewToDate.getMonth() - 1);
    this.toViewDate = tmpNewToDate;

    this.fromCalendar.startAt = new Date(2024, 1);
    // eslint-disable-next-line no-underscore-dangle
    this.fromCalendar._goToDateInView(this.fromViewDate, 'month');

    // eslint-disable-next-line no-underscore-dangle
    this.toCalendar._goToDateInView(this.toViewDate, 'month');
  }

  public apply(): void {
    if (this.filterDateSelected === DateRangesEnum.custom) {
      this.formatSelectedDate();
    }
    const periods = getCurrentPreviousPeriodDateRanges(this.selectedFilter.dateFilters || DATE_RANGE_DEFAULT, this.selectedFilter.compare || 'PP');
    this.selectedFilter.periods = periods;
    this.filterService.applyFilterPartially({
      ...this.selectedFilter
    });
    this.isDisplayed = false;
  }

  public clear(): void {
    this.onSelectDateFilter(DateRangesEnum.lastYear);
  }

  private fillDateFilterFromService() {
    this.selectedFilter = this.filterService.currentFilter;
    if (Array.isArray(this.selectedFilter.dateFilters)) {
      if (this.selectedFilter.dateFilters[0] === this.selectedFilter.dateFilters[1]) {
        this.selectedDateRange = new Date(this.selectedFilter.dateFilters[0]);
      } else {
        this.selectedDateRange = new DateRange(new Date(this.selectedFilter.dateFilters[0]), new Date(this.selectedFilter.dateFilters[1]));
      }
      this.moveCalendarView(new Date(this.selectedFilter.dateFilters[0]), new Date(this.selectedFilter.dateFilters[1]));
    } else {
      this.onSelectDateFilter(this.selectedFilter.dateFilters as DateRangesEnum);
    }
    this.hideBots = this.selectedFilter.hideBots ? true : false;
    this.compare = this.selectedFilter.compare !== undefined ? this.selectedFilter.compare : this.compare;
  }

  private applyFilterPartially(filters: InsightsFilters) {
    const currentState = {
      ...this.selectedFilter,
      ...filters
    };

    this.selectedFilter = currentState;
  }

  private moveCalendarView(fromDate: Date, toDate: Date): void {
    if (fromDate.getMonth() !== toDate.getMonth() || fromDate.getFullYear() !== toDate.getFullYear()) {
      if (fromDate.getMonth() !== this.fromViewDate.getMonth() || fromDate.getFullYear() !== this.fromViewDate.getFullYear()) {
        this.fromViewDate = fromDate;
        // eslint-disable-next-line no-underscore-dangle
        this.fromCalendar?._goToDateInView(this.fromViewDate, 'month');
      }

      if (toDate.getMonth() !== this.toViewDate.getMonth() || toDate.getFullYear() !== this.toViewDate.getFullYear()) {
        this.toViewDate = toDate;
        // eslint-disable-next-line no-underscore-dangle
        this.toCalendar?._goToDateInView(this.toViewDate, 'month');
      }
    } else {
      this.fromViewDate = _.cloneDeep(fromDate);
      this.fromViewDate.setMonth(this.fromViewDate.getMonth() - 1);
      // eslint-disable-next-line no-underscore-dangle
      this.fromCalendar?._goToDateInView(this.fromViewDate, 'month');
      this.toViewDate = toDate;
      // eslint-disable-next-line no-underscore-dangle
      this.toCalendar?._goToDateInView(this.toViewDate, 'month');
    }
  }

  private formatSelectedDate(): void {
    let startDateStr: string = '';
    let endDateStr: string = '';

    if (this.selectedDateRange instanceof DateRange<Date> && this.selectedDateRange.start) {
      startDateStr = DateTime.fromJSDate(this.selectedDateRange.start).toFormat('yyyy-MM-dd');
      this.selectedDateDisplay = startDateStr;

      if (this.selectedDateRange.end) {
        endDateStr = DateTime.fromJSDate(this.selectedDateRange.end).toFormat('yyyy-MM-dd');
        this.selectedDateDisplay += ' to ' + endDateStr;
      } else {
        endDateStr = DateTime.fromJSDate(this.selectedDateRange.start).toFormat('yyyy-MM-dd');
      }
    } else {
      this.selectedDateDisplay = DateTime.fromJSDate(this.selectedDateRange as Date).toFormat('yyyy-MM-dd');
    }

    if (!!startDateStr && !!endDateStr) {
      this.applyFilterPartially({
        dateFilters: [startDateStr, endDateStr]
      });
    }
  }
}
