const casual = require('casual');
const converter  = require('json-2-csv');
const fs = require('fs');

// #### CONFIG ####
const UserLimit = 100;
const CaseRecordLimit = 10000;
const CaseActionsPerUser = 1000;
const EarliestDate = new Date(2021, 0, 1);
const CaseActions = [ 'create', 'read', 'update', 'delete', 'search' ];
// #### CONFIG ####

casual.define('dateTimeFrom', (start) => {
    let end = new Date();
    let startHour = 0;
    let endHour = 24;

    var date = new Date(+start + Math.random() * (end - start));
    var hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    return date;
})

// Create users (ID + full name)
let usersCollection = [];

for (let i = 1; i <= UserLimit; i++) {
    usersCollection.push({
        UserID: i,
        UserName: casual.full_name
    });
}

// Create CaseRecords (ID + full name, Action)
let casesCollection = [];

for (let i = 1; i <= CaseRecordLimit; i++) {
    casesCollection.push({
        CaseID: (50000 + i),
        CaseName: casual.full_name
    });  
}

// Create Actions for Users interacting with Cases
let userCaseActionsCollection = [];
for (let i = 0; i < UserLimit; i++) {
    // Who is this user?
    let user = usersCollection[i];

    for (let j = 0; j < CaseActionsPerUser; j++) {
        // Pick a random case
        let randomCaseIndex = casual.integer(from = 0, to = (casesCollection.length-1));
        let caseRecord = casesCollection[randomCaseIndex];
        // Generate a random action
        let action = casual.random_element(CaseActions);

        let actionItem = {
            TimeStamp: casual.dateTimeFrom(EarliestDate).toISOString(),
            UserID: user.UserID,
            UserName: user.UserName,
            Action: action,
            RecordID: caseRecord.CaseID,
            RecordName: caseRecord.CaseName,
        };

        userCaseActionsCollection.push(actionItem);
    }
}

let json2csvCallback = (err, csv) => {
    if (err) throw err;
    fs.writeFileSync('fake-data.csv', csv, { encoding: 'utf8', flag: 'w' });
};

converter.json2csv(userCaseActionsCollection, json2csvCallback, {
    prependHeader: false
});