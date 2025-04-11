import { Language } from "./langauge.model";

export interface Organization{
    id: number;
    name: string;
    createAt: Date;
    userId: number;
    defaultLangId: number;
    strings: number;
    progress: number;
    defaultLangCode: string;
}