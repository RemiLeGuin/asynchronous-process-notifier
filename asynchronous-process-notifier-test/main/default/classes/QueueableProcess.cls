public class QueueableProcess implements Queueable {
    
    private List<Contact> contacts;
    private Map<Id, Contact> oldContacts;
    private Id userId;
    
    public QueueableProcess(List<Contact> contacts, Map<Id, Contact> oldContacts, Id userId) {
        this.contacts = contacts;
        this.oldContacts = oldContacts;
        this.userId = userId;
    }
    
    public void execute(QueueableContext context) {
        Datetime dt = Datetime.now();
        // Artificial delay to fake a long-running process.
        while (Datetime.now() < dt.addSeconds(5)) {}
        List<Contact> contactsToRollback = rollbackContactsEmailAddresses(contacts, oldContacts);
        update contactsToRollback;
        List<AsynchronousProcessNotification__e> asynchronousProcessNotification = setAsynchronousProcessNotificationEvents(contactsToRollback, userId);
        EventBus.publish(asynchronousProcessNotification);
    }

    private static List<Contact> rollbackContactsEmailAddresses(List<Contact> contacts, Map<Id, Contact> oldContacts) {
        for (Contact ct : contacts) {
            if (oldContacts != null && !oldContacts.isEmpty() && oldContacts.get(ct.Id) != null
                && ct.Email != oldContacts.get(ct.Id).Email) {
                ct.Email = oldContacts.get(ct.Id).Email;
            }
        }
        return contacts;
    }

    private static List<AsynchronousProcessNotification__e> setAsynchronousProcessNotificationEvents(List<Contact> contacts, Id userId) {
        AsynchronousProcessNotifierSetting__mdt	rollbackSettings = [SELECT DisplayNotification__c,
                                                                           RefreshRecordsViewPage__c,
                                                                           RefreshObjectsListViews__c,
                                                                           ToastNotificationMode__c,
                                                                           ToastNotificationVariant__c
                                                                    FROM AsynchronousProcessNotifierSetting__mdt
                                                                    WHERE DeveloperName = 'RollbackContactsEmailAddresses'
                                                                    LIMIT 1];
        List<AsynchronousProcessNotification__e> asynchronousProcessNotification = new List<AsynchronousProcessNotification__e> ();
        for (Contact ct : contacts) {
            asynchronousProcessNotification.add(new AsynchronousProcessNotification__e(UsersToNotify__c = userId,
                                                                                       DisplayNotification__c = rollbackSettings.DisplayNotification__c,
                                                                                       RefreshRecordsViewPage__c = rollbackSettings.RefreshRecordsViewPage__c,
                                                                                       RefreshObjectsListViews__c = rollbackSettings.RefreshObjectsListViews__c,
                                                                                       ToastNotificationMode__c = rollbackSettings.ToastNotificationMode__c,
                                                                                       ToastNotificationVariant__c = rollbackSettings.ToastNotificationVariant__c,
                                                                                       ToastNotificationMessage__c = Label.EmailAddressAlreadyExists,
                                                                                       RecordName__c = ct.FirstName + ' ' + ct.LastName,
                                                                                       RecordId__c = ct.Id,
                                                                                       ObjectApiName__c = 'Contact'));
        }
        return asynchronousProcessNotification;
    }

}