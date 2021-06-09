// Class definition for a game. This is what will be returned by the API.
export class Game {
    name: string;
    medium: string;
    description: string;
    tags: string[];
    link: string;
    
    constructor(name: string, medium: string, description: string, link: string, ...tags: string[]) {
        this.name = name;
        this.medium = medium; 
        this.description = description;
        this.tags = tags;
        this.link = link;
    }
}