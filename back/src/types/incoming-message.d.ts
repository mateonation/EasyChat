import { IncomingMessage } from "http";

declare module "http" {
    interface IncomingMessage {
        session?: any;
    }
}