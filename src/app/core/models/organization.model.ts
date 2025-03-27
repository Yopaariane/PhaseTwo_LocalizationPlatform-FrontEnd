import { Language } from "./langauge.model";

export interface Organization{
    id: number;
    name: string;
    createAt: Date;
    userId: number;
    defaultLanguageId: number;
    strings: number;
    progress: number;
    defaultLangCode: string;
}