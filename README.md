# Platform Events

This repository illustrates a fake functional case to introduce Salesforce Platform Events: each time a contact's email address is updated, an asynchronous process rolls it back to its previous state and notififies the user of it with an error toast notification (red ribbon on top of the page).

**Only works for Lightning experience on desktop!**

To know and understand the purpose of platform events, please review the following Trailhead modules:
-   [Platform Events Basics](https://trailhead.salesforce.com/en/content/learn/modules/platform_events_basics)
-   [Build an Instant Notification App](https://trailhead.salesforce.com/en/content/learn/projects/workshop-platform-events)


## Steps to install it in a Salesforce instance:
Install the unlocked package by clicking one of the following URLs:
-   [Follow this link for Sandboxes](https://test.salesforce.com/packaging/installPackage.apexp?p0=04t3X000002lZdnQAE "https://test.salesforce.com/packaging/installPackage.apexp?p0=04t3X000002lZdnQAE")
-   [Follow this link for Developer Editions and Trailhead Playgrounds](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3X000002lZdnQAE "https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3X000002lZdnQAE")

Then, follow these configuration steps:
1. Go to the Salesforce instance and go to 'Setup' &rightarrow 'Apps' &rightarrow 'App Manager'.
2. Edit the Lightning app of your choice and navigate to 'Utility Items' section on the left.
3. Add the 'Event Catcher (LWC)' or the 'EventCatcher' (Aura version) utility item. **Not both and do not forget to set 'Start automatically'.**

## Test it yourself!
-   Go to a contact and modify its email address.
-   Wait at least 5 seconds for the toast notification to display and the contact email address to revert.