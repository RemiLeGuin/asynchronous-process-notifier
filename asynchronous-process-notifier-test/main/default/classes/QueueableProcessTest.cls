@IsTest
private class QueueableProcessTest {

    @testSetup
    private static void setup() {
        List<Contact> contacts = new List<Contact>();
        for(Integer i=0; i < 210; i++) {
            contacts.add(new Contact(LastName = 'Test' + String.valueOf(i).leftPad(3, '0')));
        }
        insert contacts;        
    }

    @IsTest
	private static void updateContactEmailAddress() {
		List<Contact> contacts = [SELECT Id FROM Contact ORDER BY LastName ASC];
        for(Contact ct : contacts) {
            ct.Email = 'contact@email.com';
        }

		Test.startTest();
		List<Database.SaveResult> results = Database.update(contacts, false);
		Test.stopTest();

        for (Database.SaveResult result : results) {
            if (!result.isSuccess()) {
                for(Database.Error err : result.getErrors()) {
                    System.assert(result.isSuccess(), err.getStatusCode() + ': ' + err.getMessage());
                }
            }
        }
		Map<Id, Contact> contactsMap = new Map<Id, Contact> ([SELECT Id, LastName, Email FROM Contact ORDER BY LastName ASC]);
        if (contactsMap != null && !contactsMap.isEmpty()) {
            for (Contact ct : contactsMap.values()) {
                System.assertEquals(ct.Email, null, 'Contact\'s email address has not been rollbacked');
            }
        }
        // As the Platform Events cannot be queried, we cannot assert them.
	}

}