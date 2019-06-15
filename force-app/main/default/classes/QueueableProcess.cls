public class QueueableProcess implements Queueable {
    
    private List<Account> accounts;
    private Map<Id, Account> oldAccounts;
    private Id userId;
    
    public QueueableProcess(List<Account> accounts, Map<Id, Account> oldAccounts, Id userId) {
        this.accounts = accounts;
        this.oldAccounts = oldAccounts;
        this.userId = userId;
    }
    
    public void execute(QueueableContext context) {
        Datetime dt = Datetime.now();
        // Artificial delay to fake a long-running process.
        while (Datetime.now() < dt.addSeconds(5)) {}
        Set<String> allEmailAddresses = getAllEmailAddresses();
        List<Account> accountsToRollback = rollbackAccountsEmailAddresses(accounts, oldAccounts, allEmailAddresses);
        update accountsToRollback;
        List<AsynchronousProcess__e> asyncProcesses = setAsyncProcessEvents(accountsToRollback, userId);
        EventBus.publish(asyncProcesses);
    }

    private static Set<String> getAllEmailAddresses() {
        List<Account> allAccounts = [SELECT EmailAddress__c FROM Account WHERE EmailAddress__c != null];
        Set<String> allEmailAddresses = new Set<String> ();
        for (Account acc : allAccounts) {
            allEmailAddresses.add(acc.EmailAddress__c);
        }
        return allEmailAddresses;
    }

    private static List<Account> rollbackAccountsEmailAddresses(List<Account> accounts,
                                                                Map<Id, Account> oldAccounts,
                                                                Set<String> allEmailAddresses) {
        List<Account> accountsToRollback = new List<Account> ();
        for (Account acc : accounts) {
            if (allEmailAddresses.contains(acc.EmailAddress__c)) {
                acc.EmailAddress__c = oldAccounts.get(acc.Id).EmailAddress__c;
                accountsToRollback.add(acc);
            }
        }
        return accountsToRollback;
    }

    private static List<AsynchronousProcess__e> setAsyncProcessEvents(List<Account> accounts, Id userId) {
        List<AsynchronousProcess__e> asyncProcesses = new List<AsynchronousProcess__e> ();
        for (Account acc : accounts) {
            asyncProcesses.add(new AsynchronousProcess__e(RecordId__c = acc.Id,
                                                          RecordName__c = acc.Name,
                                                          UserToNotify__c = userId,
                                                          Message__c = Label.EmailAddressAlreadyExists));
        }
        return asyncProcesses;
    }
    
}