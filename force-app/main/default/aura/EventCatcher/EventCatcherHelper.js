({
    // Client-side function that invokes the subscribe method on the empApi component.
    subscribe : function(component, event, helper) {
        // Get the empApi component.
        const empApi = component.find("empApi");
        // Get the channel from the attribute.
        const channel = component.get("v.channel");
        // Subscription option to get only new events.
        const replayId = -1;
        // Callback function to be passed in the subscribe call after an event is received.
        // This callback prints the event payload to the console.
        // A helper method displays the message in the console app.
        const callback = function(message) {
            console.log("Event Received : " + JSON.stringify(message));
            helper.onReceiveNotification(message);
        };
        // Subscribe to the channel and save the returned subscription object.
        empApi.subscribe(channel, replayId, $A.getCallback(callback)).then($A.getCallback(function (newSubscription) {
            console.log("Subscribed to channel " + channel);
            component.set("v.subscription", newSubscription);
        }));
    },
    
    // Client-side function that displays the platform event message
    // in the console app and displays a toast if not muted.
    onReceiveNotification : function(message) {
        if (message.data.payload.UserToNotify__c == $A.get("$SObjectType.CurrentUser.Id")) {
            // Extract notification from platform event.
            const newNotification = {
                recordId: message.data.payload.RecordId__c,
                recordName: message.data.payload.RecordName__c,
                message: message.data.payload.Message__c
            };
            // Display notification in a toast.
            this.displayToast("sticky", "error", newNotification.recordId, newNotification.recordName, newNotification.message);
            if (window.location.toString().includes("/lightning/r/Account/" + newNotification.recordId)
                || window.location.toString().includes("/lightning/o/Account/list")) {
                $A.get("e.force:refreshView").fire();
            };
        }
    },
    
    // Displays the given toast message.
    displayToast : function(mode, type, recordId, recordName, message) {
        const toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            mode: mode,
            type: type,
            message: message,
            messageTemplate: message,
            messageTemplateData: [{
                url: "/lightning/r/Account/" + recordId + "/view",
                label: recordName,
            }]
        });
        toastEvent.fire();
    }
})