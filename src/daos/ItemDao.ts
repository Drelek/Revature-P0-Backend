import Item from '@entities/Item';
import Response from '@entities/Response';
import * as AWS from 'aws-sdk';

AWS.config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
}
AWS.config.region = process.env.AWS_REGION;
const dynamo = new AWS.DynamoDB();

export interface IItemDao {
    create: (item: Item) => Promise<Response>;
    get: (id: number) => Promise<Response>;
    getAll: () => Promise<Response>;
    getTagged: (tag: string) => Promise<Response>;
    update: (id: number, item: Item) => Promise<Response>;
    remove: (id: number) => Promise<Response>;
}

class ItemDao implements IItemDao {

    private cachedItems: Item[];

    constructor() {
        this.cachedItems = [];
        dynamo.scan(Item.getAllSchema(), (err, data) => {
            const items = data.Items || []
            for (let item of items) {
                this.cachedItems.push(new Item(
                    item.name.S || '',
                    item.description.S || '',
                    Number(item.price.N) || 0,
                    Number(item.id.N),
                    ...item.tags.SS || []
                ));
            }
        });
    }

    
    /**
     * Creates a new item.
     * 
     * @param item the item object to add
     * @returns a response object containing the full item object
     */
    public async create(item: Item): Promise<Response> {
        try {
            const newId = this.cachedItems.length;
            await dynamo.putItem(item.createSchema(newId)).promise();
            const result = await dynamo.getItem(Item.getSchema(newId)).promise();
            if (result.Item) {
                const newItem = new Item(
                    result.Item.name.S || '',
                    result.Item.description.S || '',
                    Number(result.Item.price.N),
                    Number(result.Item.id.N),
                    ...result.Item.tags.SS || []
                );
                this.cachedItems.push(newItem);
                return new Response(
                    true,
                    newItem
                );
            } else {
                return new Response(
                    false,
                    "An unknown error has occurred"
                );
            }
        } catch (err) {
            return new Response(
                false,
                err
            );
        }
    }


    /**
     * Gets info about an item.
     * 
     * @param id the id of the item to get
     * @returns a response object containing the fetched item object
     */
    public async get(id: number):  Promise<Response> {
        try {
            const result = await dynamo.getItem(Item.getSchema(id)).promise();
            if (result.Item) {
                const item = new Item(
                    result.Item.name.S || '',
                    result.Item.description.S || '',
                    Number(result.Item.price.N),
                    Number(result.Item.id.N),
                    ...result.Item.tags.SS || []
                );
                return new Response(
                    true,
                    item
                );
            } else {
                return new Response(
                    false,
                    "An item with that ID was not found."
                );
            }
        } catch (err) {
            return new Response(
                false,
                err
            );
        }
    }


    /**
     * Gets all items in the database.
     * 
     * @returns a response object containing an array of item objects
     */
    public async getAll(): Promise<Response> {
        try {
            const result = await dynamo.scan(Item.getAllSchema()).promise();
            const items = result.Items || [];
            this.cachedItems = [];
            for (let item of items) {
                console.log(item)
                this.cachedItems.push(new Item(
                    item.name.S || '',
                    item.description.S || '',
                    Number(item.price.N),
                    Number(item.id.N),
                    ...item.tags.SS || []
                ));
            }
            return new Response(
                true,
                {Items: this.cachedItems}
            );
        } catch (err) {
            return new Response(
                false,
                err
            );
        }
    }


    /**
     * Gets all items with a given tag from the database
     * 
     * @param tag the tag to search for
     * @returns a response object containing an array of item objects
     */
    public async getTagged(tag: string): Promise<Response> {
        try {
            const result = await dynamo.scan(Item.getTaggedSchema(tag)).promise();
            const items = result.Items || [];
            const taggedItems = [];
            for (let item of items) {
                taggedItems.push(new Item(
                    item.name.S || '',
                    item.description.S || '',
                    Number(item.price.N || 0),
                    Number(item.id.N),
                    ...item.tags.SS || []
                ));
            }
            return new Response(true, {Items: taggedItems});
        } catch (err) {
            return new Response(false, err);
        }
    }


    /**
     * Updates an item in the database.
     * 
     * @param id the item ID to update
     * @param item the new information for the item 
     * @returns a response object containing the updated item object
     */
    public async update(id: number, item: Item): Promise<Response> {
        try {
            const exists = await this.get(id);
            if (exists.data) {
                const result = await dynamo.updateItem(item.updateSchema(id)).promise();
                if (result.Attributes) {
                    const newItem = new Item(
                        result.Attributes.name.S || '',
                        result.Attributes.description.S || '',
                        Number(result.Attributes.price.N),
                        Number(result.Attributes.id.N),
                        ...result.Attributes.tags.SS || []
                    );
                    return new Response(true, "Item was updated as follows.", newItem);
                } else {
                    return new Response(false, "Item does not exist.");
                }
            } else {
                return new Response(false, "Item does not exist.");
            }
        } catch (err) {
            return new Response(false, err);
        }
    }


    /**
     * Remove an item from the database.
     * 
     * @param id the item to remove
     * @returns a response object 
     */
    public async remove(id: number): Promise<Response> {
        try {
            const result = await dynamo.deleteItem(Item.removeSchema(id)).promise();
            if (result.Attributes) return new Response(true, "Item was deleted successfully.");
            else return new Response(false, "Item does not exist.");
        } catch (err) {
            return new Response(false, err);
        }
    }

}

export default ItemDao;