({
    doInit: function(component, event, helper) {
        // Need to find the dataset name and current version 
        var datasetId = component.get("v.datasetId");
        var sdk = component.find("sdk");
        var context = {apiVersion: "49"};
        
        var methodName = 'describeDataset';
        var methodParameters = {
            "datasetId": datasetId
        };
        
        sdk.invokeMethod(context, methodName, methodParameters,
            $A.getCallback(function (err, data) {
                if (err !== null) {
                    console.error("SDK error", err);
                } else {
                    console.log(data);
                    component.set("v.datasetName", data.name);
                    var currentVersionId = data.currentVersionId;                    

                    var methodNameExec = 'executeQuery';
                    var methodParametersExec = {
                        'query' : 'q = load "' + datasetId + '/' + currentVersionId + '"; q = group q by all; q = foreach q generate min(' + component.get("v.fieldName") + ') as min_value, max(' + component.get("v.fieldName") + ') as max_value;'
                    };
        
                    sdk.invokeMethod(context, methodNameExec, methodParametersExec,
                        $A.getCallback(function (err, data) {
                            if (err !== null) {
                                console.error("SDK error", err);
                            } else {
                                console.log(data);
                                let d = JSON.parse(data)                                
                                component.set("v.maxValue", d.results.records[0].max_value);
                                component.set("v.minValue", d.results.records[0].min_value);
                            }
                        }        
                    ))
                }
            }
        )) 
    },
    
    // sets a call back interval to refresh, based on the delay
    handleAutomate : function(component, event, helper) {
        var delaySec = component.get("v.delay") * 1000;
        var interval =  window.setInterval(
            $A.getCallback(function() {
                helper.incrementAndFilter(component, helper);
            }), delaySec
        );     
    
        component.set("v.setIntervalId", interval) ;
    },
    
    handleDestroy : function(component, event, helper) {
        window.clearInterval(component.get("v.setIntervalId"));
    },
})