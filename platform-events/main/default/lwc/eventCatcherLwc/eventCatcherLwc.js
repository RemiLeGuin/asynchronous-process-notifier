import { LightningElement, wire } from 'lwc';
import { subscribe, onError } from 'lightning/empApi';
import USER_ID from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from "lightning/navigation";

export default class EventCatcherLWC extends LightningElement {

    channelName = '/event/AsynchronousProcess__e';
    subscription = {};
    recordId;

    @wire(CurrentPageReference)
    currentPageReference() {
        // When the user navigates on the record's page, refresh the data to see an eventual rollback.
        if (this.recordId && window.location.href.includes(this.recordId)) {
            eval("$A.get('e.force:refreshView').fire();");
        }
    }

    // Called when the component is initialized.
    // Subscribes to the channel and displays a toast message.
    // Specifies an error handler function for empApi.
    connectedCallback() {
        // Callback function to be passed in the subscribe call after an event is received.
        // This callback prints the event payload to the console.
        // A helper method displays the message in the console app.
        var self = this;
        const messageCallback = function(response) {
            self.onReceiveEvent(response);
        };
        // Subscribe to the channel and save the returned subscription object.
        subscribe(this.channelName, -1, messageCallback).then(response => {
            this.subscription = response;
        });
    }

    // Client-side function that displays the platform event message
    // in the console app and displays a toast if not muted.
    onReceiveEvent(response) {
        if (response.data.payload.UserToNotify__c == USER_ID) {
            // Extract notification from platform event.
            const newNotification = {
                recordId: response.data.payload.RecordId__c,
                recordName: response.data.payload.RecordName__c,
                message: response.data.payload.Message__c
            };
            // Display notification in a toast.
            this.displayToast("sticky", "error", newNotification.recordId, newNotification.recordName, newNotification.message);
            // If the user is on the record's page, refresh the data to see an eventual rollback.
            this.recordId = newNotification.recordId;
            if (window.location.href.includes(this.recordId)) {
                eval("$A.get('e.force:refreshView').fire();");
            }
        }
    }

    // Displays the given toast message.
    displayToast(mode, variant, recordId, recordName, message) {
        const toastEvent = new ShowToastEvent({
            "mode": mode,
            "variant": variant,
            "message": message,
            "messageData": [
                {
                    url: "/lightning/r/Contact/" + recordId + "/view",
                    label: recordName,
                }
            ]
        });
        this.dispatchEvent(toastEvent);
    }

    // Define an error handler function that prints the error to the console.
    registerErrorListener() {
        onError(error => {
            console.log(JSON.stringify(error));
        });
    }

}