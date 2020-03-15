import { LightningElement, wire } from 'lwc';
import { subscribe, onError } from 'lightning/empApi';
import USER_ID from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from "lightning/navigation";

export default class AsyncProcessNotifierLWC extends LightningElement {

    channelName = '/event/AsynchronousProcessNotification__e';
    subscription = {};
    recordId;
    objectType;
    // The data refreshes to see an eventual rollback. We only want this to happen once after an event occurs.
    isRefreshed = true;
    refreshRecordsViewPage;
    refreshObjectsListViews;

    // Check for URL change during navigation.
    @wire(CurrentPageReference)
    currentPageReference() {
        this.refreshPages();
    }

    refreshPages() {
        // When the user navigates on the record's page, refresh the data to see an eventual rollback.
        if (!this.isRefreshed && this.refreshRecordsViewPage && this.recordId
            && window.location.href.includes(this.recordId + '/view')) {
            eval("$A.get('e.force:refreshView').fire();");
            this.isRefreshed = true;
        }
        // When the user navigates on a record's list view, refresh the data to see an eventual rollback.
        if (!this.isRefreshed && this.refreshObjectsListViews && this.recordId && this.objectType
            && window.location.href.includes('/lightning/o/' + this.objectType + '/list')) {
            eval("$A.get('e.force:refreshView').fire();");
            this.isRefreshed = true;
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
        var usersToNotify = response.data.payload.UsersToNotify__c;
        if (!usersToNotify || usersToNotify.includes(USER_ID)) {
            // Extract notification from platform event.
            const newNotification = {
                displayNotification: response.data.payload.DisplayNotification__c,
                refreshRecordsViewPage: response.data.payload.RefreshRecordsViewPage__c,
                refreshObjectsListViews: response.data.payload.RefreshObjectsListViews__c,
                mode: response.data.payload.ToastNotificationMode__c,
                variant: response.data.payload.ToastNotificationVariant__c,
                title: response.data.payload.ToastNotificationTitle__c,
                message: response.data.payload.ToastNotificationMessage__c,
                objectType: response.data.payload.ObjectApiName__c,
                recordId: response.data.payload.RecordId__c,
                recordName: response.data.payload.RecordName__c
            };
            this.recordId = newNotification.recordId;
            this.objectType = newNotification.objectType;
            this.refreshRecordsViewPage = newNotification.refreshRecordsViewPage;
            this.refreshObjectsListViews = newNotification.refreshObjectsListViews;
            this.isRefreshed = false;
            // If the user is on the record's page or on a record's list view, refresh the data to see an eventual rollback.
            this.refreshPages();
            // Display notification in a toast.
            if (newNotification.displayNotification && (newNotification.title || newNotification.message)) {
                this.displayToast(newNotification.mode, newNotification.variant, newNotification.title, newNotification.message,
                                  newNotification.objectType, newNotification.recordId, newNotification.recordName);
            }
        }
    }

    // Displays the given toast message.
    displayToast(mode, variant, title, message, objectType, recordId, recordName) {
        var messageData;
        if (objectType && recordId && recordName) {
            messageData = [
                {
                    url: '/lightning/r/' + objectType + '/' + recordId + '/view',
                    label: recordName,
                }
            ];
        }
        else if (recordName) {
            messageData = [ { label: recordName, } ];
        }
        const toastEvent = new ShowToastEvent({
            'mode': mode,
            'variant': variant,
            'title': title,
            'message': message,
            'messageData': messageData
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