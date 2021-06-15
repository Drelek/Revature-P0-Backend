import * as AWS from 'aws-sdk'
import { CreateTableInput, PutItemInput, DescribeTableInput } from 'aws-sdk/clients/dynamodb';
import { isJSDocDeprecatedTag } from 'typescript';
import * as accTools from './src/services/AccountTools'
import * as types from './src/types/types'

AWS.config.loadFromPath(process.cwd() + '/config/aws-credentials.json');

const dynamo = new AWS.DynamoDB();

function testCallback(err, data) {
    if (err) {
        console.log("There was an error");
        //console.log(err);
    }
    if (data) {
        console.log("There was some data");
        //console.log(data);
    }
}

const createParams : CreateTableInput = {
    AttributeDefinitions: [
        {
            AttributeName: "Name",
            AttributeType: "S"
        },
        {
            AttributeName: "Address",
            AttributeType: "S"
        }
    ],
    KeySchema: [
        {
            AttributeName: "Name",
            KeyType: "HASH"
        },
        {
            AttributeName: "Address",
            KeyType: "RANGE"
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: "People"
};

//dynamo.createTable(createParams, testCallback);

const putParams : PutItemInput = {
    Item: {
        "Name": {
            S: "Steven"
        },
        "Address": {
            S: "1234 NotAReal Dr"
        }
    },
    TableName: "People"
}

//dynamo.putItem(putParams, testCallback);

const describeParams : DescribeTableInput = {
    TableName: "People"
}

//dynamo.describeTable(describeParams, testCallback);

const newUser: types.User = {
    firstName: "Jared",
    lastName: "Burkamper",
    email: "jaredburkamper@gmail.com",
}

async function tester() {
    const userInfo = await accTools.get("asdf");
    console.log(userInfo);
}

tester();