

/**
 * KTRS Component.
 *Dependencies jQuery, daterrangepicker component, moment js, KTRSConstants js. 
 * @constructor
 * @param {string} _id - The id of the div on which TRS will be created.
 * @param {object} options - The configuration required to time range selector.
 * @param {object} data - The data required to draw Time range selector(Data start/end, gran min max).
 * @return {object} The object the Time range selector.
 */
var KTRS  = function(_id,_options,_data)
{
  this.options = {};
	this.minmax = {};
  this. granMap = {};
  this.hourGranAllowed = true;
	this.id = _id;
  this.quickLinksObject = undefined;
	var element = document.getElementById(_id);
  var ktrsObj = this;
  var advKTRSObj = undefined;

  /**
   * Parse and store all the configuration values provided by user to draw Time range selector.
   * @param {object} options - view model of TRS.
   */
    this.parseOptions = function(options)
    {
    	this.options = options;
    }

  /**
   * Store the data and create the meta data required for working of time range selector.
   * @param {object} data - raw data for TRS.
   */
    this.setData = function(data)
    {
      var startTimeEpoch = undefined;
      var endTimeEpoch = undefined;
      var minGran = undefined;
      this.granMap = {};
      for(var granID in data.dateSelection)
      {
        if(minGran == undefined)
        {
          minGran = parseInt(granID);
        }
        if(minGran > parseInt(granID))
        {
          minGran = parseInt(granID);
        }
        var granData = data.dateSelection[granID];
        if(startTimeEpoch == undefined)
        {
          startTimeEpoch = granData[0];
        }
        else if(startTimeEpoch > granData[0])
        {
          startTimeEpoch = granData[0];
        }
        if(endTimeEpoch == undefined)
        {
          endTimeEpoch = granData[1];
        }
        else if(endTimeEpoch < granData[1])
        {
          endTimeEpoch = granData[1];
        }
        var startTime = moment(granData[0]*1000);
        startTime.utcOffset(this.options.timezone);
        var endTime = moment(granData[1]*1000);
        endTime.utcOffset(this.options.timezone);
        this.granMap[granID] = [startTime,endTime];
      }
    	this.minmax = {};
      var startTimeMin = moment(startTimeEpoch*1000);
      startTimeMin.utcOffset(this.options.timezone);
      var startDate =  moment(endTimeEpoch*1000);
      startDate.utcOffset(this.options.timezone);
      startDate.startOf('day');
      // var todaydiff = endTimeEpoch-startDate.unix();
      // if(todaydiff<minGran)
      // {
      //   endTimeEpoch = endTimeEpoch - todaydiff -1;
      // }
      var endTimeMin = moment(endTimeEpoch*1000);
      endTimeMin.utcOffset(this.options.timezone);
    	this.minmax[KTRSCONSTANTS.DATA_START_CONST] = startTimeMin;
    	this.minmax[KTRSCONSTANTS.DATA_END_CONST] = endTimeMin;
      this.quickLinksObject = new QuickLinks(_id,this.options.quickLinks,this.minmax);
    }
   
 /**
   * Creates and add div to display selected time range.
   */
	this.addTimeRangeValue = function()
	{
	
		var timeRangeValueDiv = document.createElement(KTRSCONSTANTS.DIV_CONST);
		timeRangeValueDiv.className = KTRSCONSTANTS.TIME_RANGE_VALUE_DIV_CLASSNAME;
		var timeRangeValueDivImg = document.createElement(KTRSCONSTANTS.IMG_CONST);
		timeRangeValueDivImg.src = KTRSCONSTANTS.KTRS_CLOCK_IMAGEPATH;
		timeRangeValueDivImg.style =KTRSCONSTANTS.IMG_STYLE;
		timeRangeValueDiv.appendChild(timeRangeValueDivImg);
    var timeRangeValueSpan = document.createElement(KTRSCONSTANTS.SPAN_CONST);
    timeRangeValueSpan.id = KTRSCONSTANTS.TIME_RANGE_VALUE_SPANID;
    timeRangeValueDiv.appendChild(timeRangeValueSpan);
    if(element != undefined)
    {
			element.appendChild(timeRangeValueDiv);
		}
	}

 /**
   * It updates the time range display string based upon user selection.
   * @param {object} dateSelection - the current date selction by user.
   * @param {boolean} isCustom - Flag indicating of custom mode.
   */
  this.updateTimeRangeValue = function(dateSelection,isCustom)
  {
      if(isCustom)
      {
          ktrsObj.quickLinksObject.updateQuickLinks(undefined,true);
      }
      else
      {
        if(advKTRSObj != undefined && this.quickLinksObject.currentQuickLinkID != undefined)
        {
          advKTRSObj.data('daterangepicker').setStartDate(moment(this.quickLinksObject.currentSelectedTime(KTRSCONSTANTS.DATA_START_CONST)).format(this.options.format));
          advKTRSObj.data('daterangepicker').setEndDate(moment(this.quickLinksObject.currentSelectedTime(KTRSCONSTANTS.DATA_END_CONST)).format(this.options.format));
        }
      }
      var timeRangeValueSpan = document.getElementById(KTRSCONSTANTS.TIME_RANGE_VALUE_SPANID);
      timeRangeValueSpan.innerHTML = moment(dateSelection.selection.fromDate).format(this.options.format) + this.options.locale.separator + moment(dateSelection.selection.toDate).format(this.options.format);
      
  }

 /**
   * Creates and add div to display all the given quick links(given in options).Also dispatches the event for the default time range selection.
   */
	this.addTimeRangeQuickLinks = function()
	{
    element.addEventListener('timeTangeEvent',function(e)
      {
        ktrsObj.updateTimeRangeValue(e.detail,false);
      },false); 
    this.quickLinksObject.addTimeRangeQuickLinks();
	}

 /**
   * Creates and add the advanced time range selector which is used to select custom time range.
   */
	this.addDateRangePicker = function()
	{
     var dateRangePickerDiv = document.createElement(KTRSCONSTANTS.DIV_CONST);
     dateRangePickerDiv.id = KTRSCONSTANTS.DATE_RANGE_PICKER_DIVID;
     dateRangePickerDiv.className = KTRSCONSTANTS.DATE_RANGE_PICKER_DIV_CLASSNAME;
     var dateRangePickerDivImg = document.createElement(KTRSCONSTANTS.IMG_CONST);
  	 dateRangePickerDivImg.src = KTRSCONSTANTS.CALENDAR_IMAGEPATH;
  	 dateRangePickerDivImg.className =KTRSCONSTANTS.GLYPHICON_CLASS;
  	 dateRangePickerDiv.appendChild(dateRangePickerDivImg);
		if(element != undefined)
    {
      element.appendChild(dateRangePickerDiv);
    }
    var minDate = moment((this.minmax[KTRSCONSTANTS.DATA_START_CONST].unix()-moment().utcOffset()*60)*1000);
    // minDate.utcOffset(this.options.timezone);
    var maxDate= moment((this.minmax[KTRSCONSTANTS.DATA_END_CONST].unix()-moment().utcOffset()*60)*1000);
    // maxDate.utcOffset(this.options.timezone);
    var startDate= moment(((this.quickLinksObject.currentSelectedTime(KTRSCONSTANTS.DATA_START_CONST)).unix()-moment().utcOffset()*60)*1000);
    // startDate.utcOffset(this.options.timezone);
    var endDate= moment(((this.quickLinksObject.currentSelectedTime(KTRSCONSTANTS.DATA_END_CONST)).unix()-moment().utcOffset()*60)*1000);
    // endDate.utcOffset(this.options.timezone);
		 advKTRSObj = $('#'+KTRSCONSTANTS.DATE_RANGE_PICKER_DIVID).daterangepicker({
          format: this.options.format,
          minDate: minDate,
          maxDate: maxDate,
          startDate: startDate,
          endDate: endDate,
          showDropdowns: true,
          showWeekNumbers: false,
          timePicker: true,
          timePickerIncrement: 1,
           timePicker12Hour: false,
          opens: this.options.opens,
          drops: this.options.drops,
          buttonClasses: ['btn', 'btn-sm'],
          applyClass: KTRSCONSTANTS.DTRAPPLY_CLASSNAME,
          cancelClass: KTRSCONSTANTS.DTRCANCEL_CLASSNAME,
          granMap:this.granMap,
          allowSlowCall:this.options.allowSlowCall,
          hourGranAllowed:this.hourGranAllowed,
          locale: this.options.locale
        });

        $('#'+KTRSCONSTANTS.DATE_RANGE_PICKER_DIVID).on('apply.daterangepicker', function (event, picker) {
          var dateSelection = {
            fromDate: moment((picker.startDate.unix()+moment().utcOffset()*60)*1000).utcOffset(0),
            toDate: moment((picker.endDate.unix()+moment().utcOffset()*60)*1000).utcOffset(0)
          };
      
           var event = new CustomEvent(KTRSCONSTANTS.TIME_RANGE_EVENT, { 'detail': {
        quickLinkID:'custom',
        selection:dateSelection
      } });
        ktrsObj.updateTimeRangeValue(event.detail,true);
          if(element != undefined)
          {
             element.dispatchEvent(event);
          }
        });
	}

  //The functions are called in the order to create and display time range selector.
  // Note: Quick links are added after the advanced time range view due to css constraint of putting advanced view to the right most position in div.
	this.parseOptions(_options);
  this.setData(_data);
	this.addTimeRangeValue();
	this.addDateRangePicker();
	this.addTimeRangeQuickLinks();
  return ktrsObj;
}






  
    