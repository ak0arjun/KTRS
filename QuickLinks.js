
/**
 * Quick link Component.
 * @constructor
 * @param {string} _id - The id of the div on which quick links will be created.
 * @param {object} options - The configuration required for quick links.
 * @param {object} data - The data required to draw quick links.
 * @return {object} The object of quick links.
 */
var QuickLinks = function(_id,_options,_data)
{
	var element = document.getElementById(_id);
	this.quickLinks = {};
	this.currentQuickLinkID = undefined;
	var quickLinksObject = this;

  /**
   * Parse and store all the configuration values provided by user to draw quick link bar.
   * @param {object} options - view model of quicklink.
   */
	this.parseOptions = function(options)
    {
    	this.options = options.quickLinkOptions;
    	this.currentQuickLinkID = options.defaultSelection;
      this.timezone = options.timezone;
    }

   /**
   * Store the data and create the meta data required for working of quick links.
   * @param {object} data - raw data for quick links.
   */
    this.setData = function(data)
    {
    	this.data = data;
    	this.createQuickLinks();
    }

   /**
   * Get the current start time/end time of the current selected quick link.In case no quick link is selected will return null.
   * @param {string} type - identifier for start/end time. KTRSCONSTANTS.DATASTARTCONST for start time.
   */
    this.currentSelectedTime = function(type)
    {
    	if(this.currentQuickLinkID == undefined)
    	{
    		return null;
    	}
    	if(type == KTRSCONSTANTS.DATA_START_CONST)
    	{
    		return this.quickLinks[this.currentQuickLinkID].startTime;
    	}
    	return  this.quickLinks[this.currentQuickLinkID].endTime;
    }

   /**
   * Creating start time for any given quick link.
   * @param {string} quickLinkUnit - unit of the quick link.
   * @param {object} quickLinkMagnitude - magnitude for the quick link.
   * @param {object} quickLinkRuleType - quick link rule to be used.
   * @param {object} dataEndTime - Data end in the application.
   * @param {object} dataStartTime - Data start in the application.
   * @return {object} The start date.
   */
    this.createQuickLinkStartTime = function(quickLinkUnit,quickLinkMagnitude,quickLinkRuleType,dataEndTime,dataStartTime)
    {
		if(quickLinkRuleType == KTRSCONSTANTS.CURRENT_RULE_TYPE)
    	{
    		if(quickLinkUnit == KTRSCONSTANTS.DAY_CONST)
    		{
	    		var startDate = moment(dataEndTime.unix()*1000);
          startDate.utcOffset(this.timezone);
	    		startDate.startOf('day');
          if(dataStartTime > startDate)
          {
            startDate = dataStartTime;
          }
	    		return startDate;
    		}
    		if(quickLinkUnit == KTRSCONSTANTS.WEEK_CONST)
    		{
	    		var startDate =  moment(dataEndTime.unix()*1000);
          startDate.utcOffset(this.timezone);
	    	//	startDate.date(startDate.date()-7*quickLinkMagnitude );
          startDate.startOf('week');
	    		startDate.startOf('day');
          if(startDate<dataStartTime)
          {
            return null;
          }
	    		return startDate;
    		}
        if(quickLinkUnit == KTRSCONSTANTS.MONTH_CONST)
        {
          var startDate =  moment(dataEndTime.unix()*1000);
          startDate.utcOffset(this.timezone);
          startDate.subtract('month',quickLinkMagnitude);
          startDate.startOf('day');
          if(startDate<dataStartTime)
          {
            return null;
          }
          return startDate;
        }
    	}
    	if(quickLinkRuleType == KTRSCONSTANTS.YESTER_RULE_TYPE)
    	{
        if(quickLinkUnit == KTRSCONSTANTS.DAY_CONST)
        {
          var startDate =  moment(dataEndTime.unix()*1000);
          startDate.utcOffset(this.timezone);
          startDate.date(startDate.date()-quickLinkMagnitude);
          startDate.startOf('day');
          if(startDate<dataStartTime)
          {
              return null;
          }
          return startDate;
        }  
        if(quickLinkUnit == KTRSCONSTANTS.MONTH_CONST)
        {
          var startDate =  moment(dataEndTime.unix()*1000);
          startDate.utcOffset(this.timezone);
          startDate.subtract(quickLinkMagnitude,'month');
          startDate.startOf('month');
          startDate.startOf('day');
          if(startDate<dataStartTime)
          {
              return null;
          }
          return startDate;
        }   		
    	}
    }
  /**
   * Creating end time for any given quick link.
   * @param {string} quickLinkUnit - unit of the quick link.
   * @param {object} quickLinkMagnitude - magnitude for the quick link.
   * @param {object} quickLinkRuleType - quick link rule to be used.
   * @param {object} dataEndTime - Data end in the application.
   * @param {object} dataStartTime - Data start in the application.
   * @return {object} The end date.
   */
    this.createQuickLinkEndTime = function(quickLinkUnit,quickLinkMagnitude,quickLinkRuleType,dataEndTime,dataStartTime)
    {
    	if(quickLinkRuleType == KTRSCONSTANTS.CURRENT_RULE_TYPE)
    	{
    		return dataEndTime;
    	}
    	if(quickLinkRuleType == KTRSCONSTANTS.YESTER_RULE_TYPE)
    	{
        if(quickLinkUnit == KTRSCONSTANTS.DAY_CONST)
        {
          var endDate =  moment(dataEndTime.unix()*1000);
          endDate.utcOffset(this.timezone);
          endDate.date(endDate.date()-quickLinkMagnitude);
          endDate.endOf('day');
          if(endDate<dataStartTime)
          {
            return null;
          }
          return endDate;
        }
        else if(quickLinkUnit == KTRSCONSTANTS.MONTH_CONST)
        {
          var endDate =  moment(dataEndTime.unix()*1000);
          endDate.utcOffset(this.timezone);
          endDate.subtract(quickLinkMagnitude,'month');
          endDate.endOf('month');
          endDate.endOf('day');
          if(endDate<dataStartTime)
          {
            return null;
          }
          return endDate;
        }
    		
    	}
    }

   /**
   * Creating all the quick link data given in the options.
   * @return {null} .
   */
    this.createQuickLinks = function()
    {
    	if(this.options != undefined && this.data != undefined)
    	{
    		this.quickLinks = {};
    		var quickLinksOpt = this.options;
    		for(var index=0;index<quickLinksOpt.length;index++)
    		{
    			var quickLinkOpt  = quickLinksOpt[index];
    			var quickLinkObj = {
            label : quickLinkOpt.label,
		    		id : quickLinkOpt.id,
	    			startTime : this.createQuickLinkStartTime(quickLinkOpt.ruleUnit,quickLinkOpt.ruleMagnitude,quickLinkOpt.ruleType,this.data.dataEnd,this.data.dataStart),
	    			endTime : this.createQuickLinkEndTime(quickLinkOpt.ruleUnit,quickLinkOpt.ruleMagnitude,quickLinkOpt.ruleType,this.data.dataEnd,this.data.dataStart)
    			};
    			this.quickLinks[quickLinkOpt.id] = quickLinkObj;
    		}
    	}

    }


  /**
   * It updates the style of the quick links depending upon user selection.Also dispatch the event to update new time range selection.
   * @param {object} newQuickLinkID - the new quick link id selected by user.
   * @param {boolean} isCustom - mode of selection custom or quick link.
   */
	this.updateQuickLinks = function(newQuickLinkID,isCustom)
	{
		if(isCustom)
		{
		  var currQuickLinkElement = document.getElementById(this.currentQuickLinkID);
          if(currQuickLinkElement)
          {
            currQuickLinkElement.className = KTRSCONSTANTS.TIME_RANGE_NONSELECTEDTEXT_CLASSNAME;
          }
          this.currentQuickLinkID = undefined;
		}
		else
		{
			if(this.currentQuickLinkID != undefined)
		    {
		      var currQuickLinkElement = document.getElementById(this.currentQuickLinkID);
		      currQuickLinkElement.className = KTRSCONSTANTS.TIME_RANGE_NONSELECTEDTEXT_CLASSNAME;
		    }
			var quickLinkElement = document.getElementById(newQuickLinkID);
			quickLinkElement.className = KTRSCONSTANTS.TIME_RANGE_SELECTEDTEXT_CLASSNAME;
			this.currentQuickLinkID = newQuickLinkID;
	         var quickLinkObj = this.quickLinks[newQuickLinkID];
	          var dateSelection = {
	            fromDate: quickLinkObj.startTime,
	            toDate: quickLinkObj.endTime
	          };
	       // updateTimeRangeValue(dateSelection,false);
	        var event = new CustomEvent(KTRSCONSTANTS.TIME_RANGE_EVENT, { 'detail': {
	        	quickLinkID:newQuickLinkID,
	        	selection:dateSelection
	        }  });
	        if(element != undefined)
	        {
	           element.dispatchEvent(event);
	        }
		}
	}

   /**
   * Creates and add div to display all the given quick links(given in options).Also dispatches the event for the default time range selection.
   */
	this.addTimeRangeQuickLinks = function()
	{
		var timeRangeQuickLinkDiv = document.createElement(KTRSCONSTANTS.DIV_CONST);
		timeRangeQuickLinkDiv.className = KTRSCONSTANTS.TIME_RANGE_QUICKLINK_DIV_CLASSNAME;
		var timeRangeQuickLinkUL =document.createElement(KTRSCONSTANTS.UL_CONST);
		timeRangeQuickLinkUL.style = KTRSCONSTANTS.TIME_RANGE_QUICKLINK_UL_STYLE;
		timeRangeQuickLinkUL.className=KTRSCONSTANTS.TIME_RANGE_QUICKLINK_UL_CLASSNAME;
		for (var quickLinkID in this.quickLinks)
		{
			var quickLinkObj = this.quickLinks[quickLinkID];
			var timeRangeQuickLinkLI = document.createElement(KTRSCONSTANTS.LI_CONST);
			var timeRangeQuickLinkAhref = document.createElement(KTRSCONSTANTS.A_CONST);
			timeRangeQuickLinkAhref.id = quickLinkID;
	    if(quickLinkObj.startTime == null || quickLinkObj.endTime == null)
		  {
			    timeRangeQuickLinkAhref.className =KTRSCONSTANTS.TIME_RANGE_NONSELECTED_DISABLEDTEXT_CLASSNAME;
	    }
      else if(quickLinkObj.startTime.unix() == quickLinkObj.endTime.unix())
      {
          timeRangeQuickLinkAhref.className = KTRSCONSTANTS.TIME_RANGE_NONSELECTED_DISABLEDTEXT_CLASSNAME;
      }
			else if(quickLinkID == this.currentQuickLinkID)
			{
				timeRangeQuickLinkAhref.className =KTRSCONSTANTS.TIME_RANGE_SELECTEDTEXT_CLASSNAME;
			}
			else
			{
				timeRangeQuickLinkAhref.className =KTRSCONSTANTS.TIME_RANGE_NONSELECTEDTEXT_CLASSNAME;
			}
			timeRangeQuickLinkAhref.href = "javascript:void(0);";
			timeRangeQuickLinkAhref.addEventListener("click",function(e)
			{
				quickLinksObject.updateQuickLinks(this.id,false);
			},false);
			timeRangeQuickLinkAhref.innerHTML = quickLinkObj.label;
			timeRangeQuickLinkLI.appendChild(timeRangeQuickLinkAhref);
			timeRangeQuickLinkUL.appendChild(timeRangeQuickLinkLI);
		}
		timeRangeQuickLinkDiv.appendChild(timeRangeQuickLinkUL);
	    if(element != undefined)
	    {
	          element.appendChild(timeRangeQuickLinkDiv);
	    }
	    var quickLinkObj = this.quickLinks[ this.currentQuickLinkID];
	    var dateSelection = {
	            fromDate: quickLinkObj.startTime,
	            toDate: quickLinkObj.endTime
	    };
	    var event = new CustomEvent(KTRSCONSTANTS.TIME_RANGE_EVENT, { 'detail': {
	    	quickLinkID:this.currentQuickLinkID,
	    	selection:dateSelection
	    } });
	    if(element != undefined)
	    {
	      element.dispatchEvent(event);
	    }
	}

	this.parseOptions(_options);
	this.setData(_data);

}
