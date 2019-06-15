({
    // Called when the component is initialized.
    // Subscribes to the channel and displays a toast message.
    // Specifies an error handler function for empApi.
    onInit: function(component, event, helper) {
        // Get empApi component.
        console.log('test');
        const empApi = component.find("empApi");
        // Define an error handler function that prints the error to the console.
        const errorHandler = function(message) {
            console.error("Received error ", JSON.stringify(message));
        };
        // Register empApi error listener and pass in the error handler function.
        empApi.onError($A.getCallback(errorHandler));
        helper.subscribe(component, event, helper);
    }
})