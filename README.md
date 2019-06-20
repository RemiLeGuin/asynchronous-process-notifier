# Platform Events

This repository illustrates a fake functional case to introduce Platform Events: each time contact's email address is updated, an asynchronous process rolls it back to its previous state et notififies the user of it with a red toast notification.

**Only works for Lightning experience!**

To know and understand the purpose of platform events, please review the following Trailhead module:
-   [Platform Events Basics](https://trailhead.salesforce.com/en/content/learn/modules/platform_events_basics)
-   [Build an Instant Notification App](https://trailhead.salesforce.com/en/content/learn/projects/workshop-platform-events)


## Steps to install it in a Salesforce instance:
1. Clone the Git repository.
2. Open it in Visual Studio Code with Salesforce CLI and Salesforce Extension Pack installed.
3. Wait a minute for the VSC plugins to initialize and then connect to a Salesforce instance of your choice.
4. Right click on manifest/package.xml and select 'SFDX: Deploy Source in Manifest to Org'.
5. Go to the instance and go to 'Setup' -> 'Apps' -> 'App Manager'.
6. Edit the Lightning app of your choice and navigate to 'Utility Items' section on the left.
7. Add the 'EventCatcher' utility item. Do not forget to set 'Start automatically'.

## Test it yourself!
-   Go to a contact and modify its email address.
-   Wait at least 5 seconds for the toast notification to display and the contact email address to revert.