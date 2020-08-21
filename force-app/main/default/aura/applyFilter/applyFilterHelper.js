({
	sendFilter: function(component, helper) {     
    var developerName = component.get('v.developerName');
    // build a filter on the dataset that sets the field to the value
    var filter = '{"datasets":{"' + component.get("v.datasetName") + 
      '":[{"fields":["' + component.get("v.fieldName") + '"], ' + 
      '"filter":{"operator": "==", "values":[[' + component.get("v.showOrder") + ']]}}]}}'
    
    // send the wave update event with the filter
    var evt = $A.get('e.wave:update');    
    evt.setParams({
      value: filter,
      devName: developerName,
      type: "dashboard"
    });

    evt.fire();
  },
    
  incrementAndFilter: function(component, helper) {
    // get the current value
    var sOrder = component.get("v.showOrder");
    
    // if we are under the max, increment and filter. Otherwise, halt the refresh interval
    if (sOrder >= component.get("v.maxValue")) {
      window.clearInterval(component.get("v.setIntervalId"));
    } else {
      component.set("v.showOrder", sOrder + 1);
      this.sendFilter(component, helper);
    }    
  },
})