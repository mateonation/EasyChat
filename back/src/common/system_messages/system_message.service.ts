import * as fs from 'fs';
import * as path from 'path';

export class SystemMessageService {
    private static messages: Record<string, string>;

    private static loadMessages() {
        const filePath = path.join( // construct the path to the messages file
            process.cwd(),
            'src',
            'common',
            'system_messages',
            'messages.json'
        );
        if (!fs.existsSync(filePath)) {
            console.error(`Messages file not found: ${filePath}`);
            this.messages = {};
            return;
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        this.messages = JSON.parse(fileContent);
    }

    static getMessage(systemType: string, params: Record<string, string>): string {
        if(!this.messages) this.loadMessages(); // load messages if not already loaded
        const template = this.messages[systemType]; // get the message template for the given system message type
        if (!template) return systemType;

        return template.replace(/\{(\w+)\}/g, (_, key) => params[key] || '');
    }
}