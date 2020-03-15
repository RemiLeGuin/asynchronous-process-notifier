({
    // Client-side function that invokes the subscribe method on the empApi component.
    subscribe: function(component, event, helper) {
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
            helper.onReceiveNotification(component, message);
        };
        // Subscribe to the channel and save the returned subscription object.
        empApi.subscribe(channel, replayId, $A.getCallback(callback)).then($A.getCallback(function (newSubscription) {
            component.set("v.subscription", newSubscription);
        }));
    },

    refreshPages: function(component) {
        // When the user navigates on the record's page, refresh the data to see an eventual rollback.
        if (!component.get("v.isRefreshed") && component.get("v.refreshRecordsViewPage") && component.get("v.recordId")
            && window.location.toString().includes(component.get("v.recordId") + "/view")) {
            $A.get("e.force:refreshView").fire();
            component.set("v.isRefreshed", true);
        }
        // When the user navigates on a record's list view, refresh the data to see an eventual rollback.
        if (!component.get("v.isRefreshed") && component.get("v.refreshObjectsListViews")
            && component.get("v.recordId") && component.get("v.objectType")
            && window.location.toString().includes("/lightning/o/" + component.get("v.objectType") + "/list")) {
            $A.get("e.force:refreshView").fire();
            component.set("v.isRefreshed", true);
        }
    },
    
    // Client-side function that displays the platform event message
    // in the console app and displays a toast if not muted.
    onReceiveNotification: function(component, message) {
        var usersToNotify = message.data.payload.UsersToNotify__c;
        if (!usersToNotify || usersToNotify.includes($A.get("$SObjectType.CurrentUser.Id"))) {
            // Extract notification from platform event.
            const newNotification = {
                displayNotification: message.data.payload.DisplayNotification__c,
                refreshRecordsViewPage: message.data.payload.RefreshRecordsViewPage__c,
                refreshObjectsListViews: message.data.payload.RefreshObjectsListViews__c,
                mode: message.data.payload.ToastNotificationMode__c,
                type: message.data.payload.ToastNotificationVariant__c,
                title: message.data.payload.ToastNotificationTitle__c,
                message: message.data.payload.ToastNotificationMessage__c,
                objectType: message.data.payload.ObjectApiName__c,
                recordId: message.data.payload.RecordId__c,
                recordName: message.data.payload.RecordName__c
            };
            component.set("v.recordId", newNotification.recordId);
            component.set("v.objectType", newNotification.objectType);
            component.set("v.refreshRecordsViewPage", newNotification.refreshRecordsViewPage);
            component.set("v.refreshObjectsListViews", newNotification.refreshObjectsListViews);
            component.set("v.isRefreshed", false);
            // If the user is on the record's page or on a record's list view, refresh the data to see an eventual rollback.
            this.refreshPages(component);
            // Display notification in a toast.
            if (newNotification.displayNotification && (newNotification.title || newNotification.message)) {
                this.displayToast(newNotification.mode, newNotification.type, newNotification.title, newNotification.message,
                                  newNotification.objectType, newNotification.recordId, newNotification.recordName);
            }
        }
    },
    
    // Displays the given toast message.
    displayToast: function(mode, type, title, message, objectType, recordId, recordName) {
        var messageData;
        if (objectType && recordId && recordName) {
            messageData = [
                {
                    url: "/lightning/r/" + objectType + "/" + recordId + "/view",
                    label: recordName,
                }
            ];
        }
        else if (recordName) {
            messageData = [ { label: recordName, } ];
        }
        const toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            mode: mode,
            type: type,
            title: title,
            message: message,
            messageTemplate: message,
            messageTemplateData: messageData
        });
        toastEvent.fire();
    }
})