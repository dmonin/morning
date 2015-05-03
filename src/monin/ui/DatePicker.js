// Copyright 2012 Dmitry Monin. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Date Picker component. Allows to select single date or date range.
 */
goog.provide('monin.ui.DatePicker');
goog.provide('monin.ui.DatePicker.SelectionMode');
goog.provide('monin.ui.DatePickerEvent');

goog.require('goog.date');
goog.require('goog.date.Date');
goog.require('goog.date.DateRange');
goog.require('goog.date.Interval');
goog.require('goog.dom');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimeSymbols');
goog.require('goog.ui.Component');


/**
 * Date Picker component. Allows to select single date or date range.
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.ui.DatePicker = function()
{
    goog.base(this);

    /**
     * Selection mode (Start date, End date, or both dates at the same time, i.e. Start date = End Date (single date mode)
     *
     * @type {monin.ui.DatePicker.SelectionMode}
     * @private
     */
    this.selectionMode_ = monin.ui.DatePicker.SelectionMode.BOTH;

    /**
     * Date and time symbols to use.
     *
     * @type {Object}
     * @private
     */
    this.symbols_ = goog.i18n.DateTimeSymbols_en_ISO;

    /**
     * Weekday na
     * @type {[type]}
     * @private
     */
    this.wdayNames_ = this.symbols_.NARROWWEEKDAYS;

    /**
     * Start date
     * @type {goog.date.Date}
     * @private
     */
    this.startDate_ = new goog.date.Date();

    /**
     * End date
     * @type {goog.date.Date}
     * @private
     */
    this.endDate_ = new goog.date.Date();

    /**
     * Highlightede date
     * @type {goog.date.Date}
     * @private
     */
    this.highlightDate_ = new goog.date.Date();

    /**
     * Active month.
     * @type {goog.date.Date}
     * @private
     */
    this.activeMonth_ = this.startDate_.clone();
    this.activeMonth_.setDate(1);
    this.activeMonth_.setFirstWeekCutOffDay(this.symbols_.FIRSTWEEKCUTOFFDAY);
    this.activeMonth_.setFirstDayOfWeek(this.symbols_.FIRSTDAYOFWEEK);

    /**
     * Class names to apply to the weekday columns.
     * @type {Array.<string>}
     * @private
     */
    this.wdayStyles_ = ['', '', '', '', '', '', ''];
    this.wdayStyles_[this.symbols_.WEEKENDRANGE[0]] =
    goog.getCssName(this.getBaseCssClass(), 'wkend-start');
    this.wdayStyles_[this.symbols_.WEEKENDRANGE[1]] =
    goog.getCssName(this.getBaseCssClass(), 'wkend-end');
};
goog.inherits(monin.ui.DatePicker, goog.ui.Component);

/**
 * Name of base CSS clase of datepicker.
 * @type {string}
 * @private
 */
monin.ui.DatePicker.BASE_CSS_CLASS_ = goog.getCssName('uc-date-picker');


/**
 * Minimum date
 * @type {goog.date.Date}
 * @private
 */
monin.ui.DatePicker.minDate_ = null;

/**
 * Maximum date
 * @type {goog.date.Date}
 * @private
 */
monin.ui.DatePicker.maxDate_ = null;

/**
 * Constants for event names
 *
 * @enum {string}
 */
monin.ui.DatePicker.EventType = {
    MONTH_CHANGE: 'month_change',
    NEXT_MONTH: 'next_month',
    PREVIOUS_MONTH: 'previous_month',
    CHANGE: 'change',
    HIDE: 'hide',
    SELECT: 'select',
    SHOW: 'show',
    HIGHLIGHT: 'highlight',
    UNHIGHLIGHT: 'unhighlight'
};

/**
 * Selection Mode: Start Date, End Date, Both dates simultaniosly
 * @enum {number}
 */
monin.ui.DatePicker.SelectionMode = {
  BOTH: 0,
  START: 1,
  END: 2
};


/**
 * Sets start date of range
 *
 * @param {goog.date.Date} date
 */
monin.ui.DatePicker.prototype.setMinDate = function(date)
{
    this.minDate_ = date;
    this.redrawCalendarGrid_();
};

/**
 * Sets end date of range
 *
 * @param {goog.date.Date} date
 */
monin.ui.DatePicker.prototype.setMaxDate = function(date)
{
    this.maxDate_ = date;
    this.redrawCalendarGrid_();
};

/**
 * Returns current selection mode
 *
 * @return {monin.ui.DatePicker.SelectionMode}
 */
monin.ui.DatePicker.prototype.getSelectionMode = function()
{
    return this.selectionMode_;
};

/**
 * Sets selection mode
 *
 * @param {monin.ui.DatePicker.SelectionMode} selectionMode
 */
monin.ui.DatePicker.prototype.setSelectionMode = function(selectionMode)
{
    this.selectionMode_ = selectionMode;
    this.updateHighlightDate_();
    this.redrawCalendarGrid_();
};

/**
 * Sets currently highlighted date
 *
 * @private
 */
monin.ui.DatePicker.prototype.updateHighlightDate_ = function()
{
    if (this.selectionMode_ == monin.ui.DatePicker.SelectionMode.START)
    {
        this.highlightDate_ = this.startDate_;
    }
    else
    {
        this.highlightDate_ = this.endDate_;
    }
};

/**
 * @return {number} The first day of week, 0 = Monday, 6 = Sunday.
 */
monin.ui.DatePicker.prototype.getFirstWeekday = function()
{
    return this.activeMonth_.getFirstDayOfWeek();
};

/**
 * @return {goog.date.Date}
 */
monin.ui.DatePicker.prototype.getMinDate = function()
{
    return this.minDate_;
};

/**
 * @return {goog.date.Date}
 */
monin.ui.DatePicker.prototype.getMaxDate = function()
{
    return this.maxDate_;
};

/**
 * @return {goog.date.DateRange}
 */
monin.ui.DatePicker.prototype.getRange = function()
{
    return new goog.date.DateRange(this.startDate_, this.endDate_);
};

/**
 * Returns base CSS class. This getter is used to get base CSS class part.
 * All CSS class names in component are created as:
 *   goog.getCssName(this.getBaseCssClass(), 'CLASS_NAME')
 * @return {string} Base CSS class.
 */
monin.ui.DatePicker.prototype.getBaseCssClass = function()
{
    return monin.ui.DatePicker.BASE_CSS_CLASS_;
};

/**
 * Sets the first day of week
 *
 * @param {number} wday Week day, 0 = Monday, 6 = Sunday.
 */
monin.ui.DatePicker.prototype.setFirstWeekday = function(wday)
{
    this.activeMonth_.setFirstDayOfWeek(wday);
    this.updateCalendarGrid_();
    this.redrawWeekdays_();
};

/**
 * Changes the active month to the previous one.
 */
monin.ui.DatePicker.prototype.previousMonth = function()
{
    this.activeMonth_.add(new goog.date.Interval(goog.date.Interval.MONTHS, -1));
    this.updateCalendarGrid_();

    this.dispatchEvent(monin.ui.DatePicker.EventType.PREVIOUS_MONTH);
};

/**
 * Changes the active month to the next one.
 */
monin.ui.DatePicker.prototype.nextMonth = function()
{
    this.activeMonth_.add(new goog.date.Interval(goog.date.Interval.MONTHS, 1));
    this.updateCalendarGrid_();

    this.dispatchEvent(monin.ui.DatePicker.EventType.NEXT_MONTH);
};

/**
 * @return goog.date.Date.
 */
monin.ui.DatePicker.prototype.getStartDate = function()
{
    return this.startDate_;
};

/**
 * @return goog.date.Date.
 */
monin.ui.DatePicker.prototype.getEndDate = function()
{
    return this.endDate_;
};

/** @inheritDoc */
monin.ui.DatePicker.prototype.createDom = function()
{
    goog.base(this, 'createDom');
    this.decorateInternal(this.getElement());
};

/** @inheritDoc */
monin.ui.DatePicker.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    el.className = this.getBaseCssClass();

    var row = this.dom_.createDom('div', goog.getCssName(this.getBaseCssClass(), 'hd'));
    this.decorateNav_(row);

    var rows = this.dom_.createDom('div', goog.getCssName(this.getBaseCssClass(), 'bd'));
    var cell;
    this.elTable_ = [];
    for (var i = 0; i < 7; i++)
    {
        row = this.dom_.createDom('div', goog.getCssName(this.getBaseCssClass(), 'week'));
        this.elTable_[i] = [];

        for (var j = 0; j < 7; j++)
        {
            cell = this.dom_.createElement('div');
            cell.className = goog.getCssName(this.getBaseCssClass(), 'wday');
            row.appendChild(cell);
            this.elTable_[i][j] = cell;
        }

        row.appendChild(this.dom_.createDom('div', 'clear'));

        rows.appendChild(row);
    }

    this.redrawWeekdays_();
    this.updateCalendarGrid_();

    el.appendChild(this.elNavRow_);
    el.appendChild(rows);

};

monin.ui.DatePicker.prototype.decorateNav_ = function(navEl)
{
    this.elNavRow_ = navEl;

    this.month_ = goog.dom.createDom('div', goog.getCssName(this.getBaseCssClass(), 'month'));

    var eh = this.getHandler();

    this.nextBtn_ = goog.dom.createDom('div', goog.getCssName(this.getBaseCssClass(), 'next-btn'));
    eh.listen(this.nextBtn_, goog.events.EventType.MOUSEDOWN, this.handleNextClick_);

    this.prevBtn_ = goog.dom.createDom('div', goog.getCssName(this.getBaseCssClass(), 'prev-btn'));
    eh.listen(this.prevBtn_, goog.events.EventType.MOUSEDOWN, this.handlePrevClick_);

    navEl.appendChild(this.month_);
    navEl.appendChild(this.prevBtn_);
    navEl.appendChild(this.nextBtn_);
};


/** @inheritDoc */
monin.ui.DatePicker.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    var eh = this.getHandler();
    eh.listen(this.getElement(), goog.events.EventType.MOUSEOVER,
        this.handleGridOver_);

    eh.listen(this.getElement(), goog.events.EventType.MOUSEOUT,
        this.handleGridOut_);

    eh.listen(this.getElement(), goog.events.EventType.MOUSEDOWN,
        this.handleGridMouseDown_);
};

/** @inheritDoc */
monin.ui.DatePicker.prototype.disposeInternal = function()
{
    goog.base(this, 'disposeInternal');
    this.startDate_ = null;
    this.endDate_ = null;
    this.activeMonth_ = null;
};

/**
 * Determines whether a date is inside of selected date range
 *
 * @param {goog.date.Date} date the date.
 * @param {goog.date.Date} start start date.
 * @param {goog.date.Date} end end date.
 * @private
 * @return {boolean}
 */
monin.ui.DatePicker.prototype.isInRange_ = function(date, start, end)
{
    var time = date.getTime();
    return time >= start.getTime() &&
        time <= end.getTime();
};

/**
 * Click handler for date grid.
 *
 * @param {goog.events.BrowserEvent} e Click event.
 * @private
 */
monin.ui.DatePicker.prototype.handleGridMouseDown_ = function(e)
{
    var target = /** @type {Element} */ (e.target);
    var startEnd = this.getStartEnd(target);
    if (!startEnd)
    {
        return;
    }

    var evt = new monin.ui.DatePickerEvent(
        monin.ui.DatePicker.EventType.SELECT, this, startEnd[0],
        startEnd[1]);

    this.dispatchEvent(evt);
    this.selectRange(startEnd[0], startEnd[1]);
};

/**
 * Over handler for date grid
 *
 * @param {goog.events.BrowserEvent} e MouseOver event.
 * @private
 */
monin.ui.DatePicker.prototype.handleGridOver_ = function(e)
{
    var target = /** @type {Element} */ (e.target);
    var startEnd = this.getStartEnd(target);
    if (!startEnd)
    {
        return;
    }

    var highlight = this.selectionMode_ == monin.ui.DatePicker.SelectionMode.START ? startEnd[0] : startEnd[1];
    this.highlight(startEnd[0], startEnd[1], highlight);

    this.dispatchEvent(new monin.ui.DatePickerEvent(
        monin.ui.DatePicker.EventType.HIGHLIGHT,
        this, startEnd[0], startEnd[1]));
};

/**
 * Handles click on next button
 *
 * @param {goog.events.BrowserEvent} e MouseOver event.
 * @private
 */
monin.ui.DatePicker.prototype.handleNextClick_ = function(e)
{
    e.stopPropagation();
    this.nextMonth();
};

/**
 * Handles click on prev button
 *
 * @param {goog.events.BrowserEvent} e MouseOver event.
 * @private
 */
monin.ui.DatePicker.prototype.handlePrevClick_ = function(e)
{
    e.stopPropagation();
    this.previousMonth();
};

/**
 * Draws calendar view from in memory representation and applies class names
 * depending on the selection, weekday and whatever the day belongs to the
 * active month or not.
 * @param {goog.date.Date=} opt_start selected start.
 * @param {goog.date.Date=} opt_end selected end.
 * @param {goog.date.Date=} opt_highlight highlight date.
 */
monin.ui.DatePicker.prototype.highlight = function(opt_start, opt_end,
    opt_highlight)
{
    this.redrawCalendarGrid_(opt_start, opt_end, opt_highlight);
};

/**
 * Returns new start end
 * @param {Element} target
 * @return Array.<goog.date.Date>
 */
monin.ui.DatePicker.prototype.getStartEnd = function(target)
{
    var classes = goog.dom.classlist,
        baseClass = this.getBaseCssClass();
    if (!classes.contains(target, goog.getCssName(baseClass, 'date')) ||
        classes.contains(target, goog.getCssName(baseClass, 'disabled')))
    {
        return null;
    }

    var date = this.getDateFromTarget_(target), start, end;

    switch (this.selectionMode_)
    {
        case monin.ui.DatePicker.SelectionMode.BOTH:
            start = date;
            end = date;
            break;
        case monin.ui.DatePicker.SelectionMode.START:
            start = date;
            end = this.endDate_;

            if (start.getTime() > end.getTime())
            {
                end = start;
            }
            break;
        case monin.ui.DatePicker.SelectionMode.END:
            start = this.startDate_;
            end = date;

            if (start.getTime() > end.getTime())
            {
                start = end;
            }
            break;
    }

    return [start, end];
};


/**
 * Over handler for date grid
 *
 * @param {goog.events.BrowserEvent} e MouseOut event.
 * @private
 */
monin.ui.DatePicker.prototype.handleGridOut_ = function(e)
{
    if (!goog.dom.classlist.contains(e.target, goog.getCssName(this.getBaseCssClass(), 'date')))
    {
        return;
    }

    this.redrawCalendarGrid_();

    this.dispatchEvent(new monin.ui.DatePickerEvent(
        monin.ui.DatePicker.EventType.UNHIGHLIGHT,
        this, null, null));
};

/**
 * Returns selected date from element
 *
 * @param {Element} cell element.
 * @return {goog.date.Date}
 * @private
 */
monin.ui.DatePicker.prototype.getDateFromTarget_ = function(cell)
{
    // colIndex/rowIndex is broken in Safari, find position by looping
    var el, x = -1, y = -2; // first col/row is for weekday/weeknum

    for (el = cell; el; el = el.previousSibling, x++) {}
    for (el = cell.parentNode; el; el = el.previousSibling, y++) {}

    return this.grid_[y][x];
};

/**
 * Selects specified interval
 *
 * @param {goog.date.Date} start
 * @param {goog.date.Date} end
 *
 */
monin.ui.DatePicker.prototype.selectRange = function(start, end)
{
    var changeEvent = new monin.ui.DatePickerEvent(
        monin.ui.DatePicker.EventType.CHANGE, this, start, end);

    if (this.dispatchEvent(changeEvent))
    {
        this.startDate_ = start;
        this.endDate_ = end;

        this.redrawCalendarGrid_(start, end);
    }
};

/**
 * Determines the dates/weekdays for the current month and builds an in memory
 * representation of the calendar.
 *
 * @private
 */
monin.ui.DatePicker.prototype.updateCalendarGrid_ = function()
{
    if (!this.getElement())
    {
        return;
    }

    var date = this.activeMonth_.clone();
    date.setDate(1);

    if (this.month_)
    {
        goog.dom.setTextContent(this.month_,
        goog.date.formatMonthAndYear(
            this.symbols_.MONTHS[date.getMonth()],
            date.getFullYear()));
      }

    var wday = date.getWeekday();

    // Determine how many days to show for previous month
    date.add(new goog.date.Interval(goog.date.Interval.MONTHS, -1));
    date.setDate(date.getNumberOfDaysInMonth() - (wday - 1));

    // Create weekday/day grid
    var dayInterval = new goog.date.Interval(goog.date.Interval.DAYS, 1);
    this.grid_ = [];
    for (var y = 0; y < 6; y++)  // Weeks
    {
        this.grid_[y] = [];
        for (var x = 0; x < 7; x++)  // Weekdays
        {
            this.grid_[y][x] = date.clone();
            date.add(dayInterval);
        }
    }

    this.redrawCalendarGrid_();
};


/**
 * Draws calendar view from in memory representation and applies class names
 * depending on the selection, weekday and whatever the day belongs to the
 * active month or not.
 * @param {goog.date.Date=} opt_start selected start.
 * @param {goog.date.Date=} opt_end selected end.
 * @param {goog.date.Date=} opt_highlight highlight date.
 * @private
 */
monin.ui.DatePicker.prototype.redrawCalendarGrid_ = function(opt_start, opt_end,
    opt_highlight)
{
    if (!this.getElement())
    {
        return;
    }

    var start = opt_start || this.startDate_;
    var end = opt_end || this.endDate_;
    var highlight = opt_highlight || this.highlightDate_;

    var month = this.activeMonth_.getMonth();
    var today = new goog.date.Date();

    // Draw calendar week by week, a worst case month has six weeks.
    for (var y = 0; y < 6; y++)
    {
        for (var x = 0; x < 7; x++)
        {
            var date = this.grid_[y][x];
            var el = this.elTable_[y + 1][x];

            var classes = [goog.getCssName(this.getBaseCssClass(), 'date')];

            // Date belongs to previous or next month
            if (date.getMonth() != month)
            {
                classes.push(goog.getCssName(this.getBaseCssClass(), 'other-month'));
            }

            // Checking if item is disabled
            if (this.minDate_ && date.getTime() < this.minDate_ ||
                this.maxDate_ && date.getTime() > this.maxDate_)
            {
                classes.push(goog.getCssName(this.getBaseCssClass(), 'disabled'));
            }

            // Apply styles set by setWeekdayClass
            var wday = (x + this.activeMonth_.getFirstDayOfWeek() + 7) % 7;
            if (this.wdayStyles_[wday])
            {
                classes.push(this.wdayStyles_[wday]);
            }

            // Current date
            if (date.equals(today))
            {
                classes.push(goog.getCssName(this.getBaseCssClass(), 'today'));
            }

            // Selected date

            if (this.isInRange_(date, start, end))
            {
                classes.push(goog.getCssName(this.getBaseCssClass(), 'selected'));
            }

            if (date.equals(highlight))
            {
                classes.push(goog.getCssName(this.getBaseCssClass(), 'highlight'));
            }

            // Set cell text to the date and apply classes.
            goog.dom.setTextContent(el, date.getDate());

            goog.dom.classlist.set(el, classes.join(' '));
        }

        // Hide the either the last one or last two weeks if they contain no days
        // from the active month and the showFixedNumWeeks is false. The first four
        // weeks are always shown as no month has less than 28 days).
        if (y >= 4)
        {
            goog.style.setElementShown(this.elTable_[y + 1][0].parentNode,
                this.grid_[y][0].getMonth() == month);
        }
    }
};


/**
 * Draw weekday names, if enabled. Start with whatever day has been set as the
 * first day of week.
 * @private
 */
monin.ui.DatePicker.prototype.redrawWeekdays_ = function()
{
    if (!this.getElement())
    {
        return;
    }

    for (var x = 0; x < 7; x++)
    {
        var el = this.elTable_[0][x];
        var wday = (x + this.activeMonth_.getFirstDayOfWeek() + 7) % 7;
        goog.dom.setTextContent(el, this.wdayNames_[wday % 7]);
    }
};

/**
 * Sets visibility
 * @param {goog.math.Coordinate} position
 */
monin.ui.DatePicker.prototype.setVisible = function(position)
{
    var style = goog.style;
    var element = this.getElement();

    if (position)
    {
        style.setPageOffset(element, position);
        style.setStyle(element, 'visibility', 'visible');
        this.dispatchEvent(monin.ui.DatePicker.EventType.SHOW);

        // Making sure selected date is visible
        var date = this.selectionMode_ == monin.ui.DatePicker.SelectionMode.START ? this.startDate_ : this.endDate_;
        this.activeMonth_ = date.clone();
        this.activeMonth_.setDate(1);
        this.updateCalendarGrid_();
    }
    else
    {
        style.setStyle(element, 'visibility', 'hidden');
        this.dispatchEvent(monin.ui.DatePicker.EventType.HIDE);
    }
};

/**
 * Object representing a date picker event.
 *
 * @param {string} type Event type.
 * @param {monin.ui.DatePicker} target Date picker initiating event.
 * @param {goog.date.Date} startDate Selected date.
 * @param {goog.date.Date} endDate Selected date.
 * @constructor
 * @extends {goog.events.Event}
 */
monin.ui.DatePickerEvent = function(type, target, startDate, endDate)
{
    goog.events.Event.call(this, type, target);

    /**
     * The selected date
     * @type {goog.date.Date}
     */
    this.startDate = startDate;

    /**
     * The selected date
     * @type {goog.date.Date}
     */
    this.endDate = endDate;
};
goog.inherits(monin.ui.DatePickerEvent, goog.events.Event);
