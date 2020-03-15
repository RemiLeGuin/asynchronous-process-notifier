({
    // Called when the component is initialized.
    // Subscribes to the channel and displays a toast message.
    // Specifies an error handler function for empApi.
    onInit: function(component, event, helper) {
        // Get empApi component.
        const empApi = component.find("empApi");
        // Define an error handler function that prints the error to the console.
        const errorHandler = function(message) {
            console.error(JSON.stringify(message));
        };
        // Register empApi error listener and pass in the error handler function.
        empApi.onError($A.getCallback(errorHandler));
        helper.subscribe(component, event, helper);
    },

    // Check for URL change during navigation.
    handleLocationChange: function(component, event, helper) {
        setTimeout(function() {
            helper.refreshPages(component);
        }, 3000);
    }
})