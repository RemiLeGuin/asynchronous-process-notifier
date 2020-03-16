# Asynchronous Process Notifier

Get your Salesforce users informed of a completed asynchronous process (@future, queueable, batch...) with a toast notification and refresh pages users are viewing with rollback data if an error occured, all thanks to a platform event.

**Only works for Lightning experience on desktop!**

To know and understand the purpose of platform events, please review the following Trailhead modules:
-   [Platform Events Basics](https://trailhead.salesforce.com/en/content/learn/modules/platform_events_basics)
-   [Build an Instant Notification App](https://trailhead.salesforce.com/en/content/learn/projects/workshop-platform-events)


## Installation:
Install the unlocked package by clicking one of the following URLs:
-   [Follow this link for Sandboxes](https://test.salesforce.com/packaging/installPackage.apexp?p0=04t3X000002mF3sQAE "https://test.salesforce.com/packaging/installPackage.apexp?p0=04t3X000002mF3sQAE")
-   [Follow this link for Developer Editions and Trailhead Playgrounds](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3X000002mF3sQAE "https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3X000002mF3sQAE")

Then, follow these configuration steps:
1. Go to the Salesforce instance and go to 'Setup' &rightarrow 'Apps' &rightarrow 'App Manager'.
2. Edit the Lightning app of your choice and navigate to 'Utility Items' section on the left.
3. Add the 'Asynchronous Process Notifier (LWC)' **OR** the 'Asynchronous Process Notifier (Aura)' utility item. **Do not forget to set 'Start automatically'.**

> IMPORTANT: A Lightning Web Component cannot subscribe to a Platform Event if there is already an Aura component that is subscribing to a Platform Event in the same Lightning Page. [It is a known issue](https://github.com/salesforce/lwc/issues/1618 "LWC EmpApi does not work when there is an Aura component using EmpApi #1618"). Then, if an existing Aura component in your user interface uses the lightning:empApi component, use the Aura version of the Asynchronous Process Notifier.

## Test:

-   Install the test package:
	-   [Follow this link for Sandboxes](https://test.salesforce.com/packaging/installPackage.apexp?p0=04t3X000002mFObQAM "https://test.salesforce.com/packaging/installPackage.apexp?p0=04t3X000002mFObQAM")
    -   [Follow this link for Developer Editions and Trailhead Playgrounds](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3X000002mFObQAM "https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3X000002mFObQAM")
-   Go to a contact and modify its email address.
-   Wait at least 5 seconds for the toast notification to display and the contact email address to revert.