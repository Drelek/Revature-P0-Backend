// Import packages
import dynamo from 'dynamodb';
import Joi from 'joi';
import {Game} from '../types/types';

// Set up DynamoDB
dynamo.AWS.config.loadFromPath('../config/aws-credentials.json');

const GameDef = dynamo.define('Game', {
    hashKey: 'name',
    schema: {
        name: Joi.string(),
        medium: Joi.string(),
        description: Joi.string(),
        tags: dynamo.types.stringSet(),
        link: Joi.string()
    }
});

export function Add(game: Game) {

}