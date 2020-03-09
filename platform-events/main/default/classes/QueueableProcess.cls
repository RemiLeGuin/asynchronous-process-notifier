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
        List<AsynchronousProcess__e> asyncProcesses = setAsyncProcessEvents(contactsToRollback, userId);
        EventBus.publish(asyncProcesses);
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

    private static List<AsynchronousProcess__e> setAsyncProcessEvents(List<Contact> contacts, Id userId) {
        List<AsynchronousProcess__e> asyncProcesses = new List<AsynchronousProcess__e> ();
        for (Contact ct : contacts) {
            asyncProcesses.add(new AsynchronousProcess__e(RecordId__c = ct.Id,
                                                          ObjectApiName__c = 'Contact',
                                                          ToastNotificationMode__c = 'sticky',
                                                          OperationInformation__c = 'error',
                                                          RecordName__c = ct.FirstName + ' ' + ct.LastName,
                                                          UserToNotify__c = userId,
                                                          Message__c = Label.EmailAddressAlreadyExists));
        }
        return asyncProcesses;
    }
    
}