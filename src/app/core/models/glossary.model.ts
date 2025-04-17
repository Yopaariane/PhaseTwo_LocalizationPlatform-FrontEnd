export interface Glossary{
    id: number;
    term: string;
    initial_translation: string;
    context: string;
    translatable: string;
    comment: string;
    status: string;
    createAt: Date;
    organizationId: number;
}