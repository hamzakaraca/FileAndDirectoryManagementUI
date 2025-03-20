export enum SearchMethod {
    FileName = 'fileName',
    FileType = 'fileType',
    Date = 'date'
}

export interface SearchingMethod {
    value: string;
    viewValue: string;
}
