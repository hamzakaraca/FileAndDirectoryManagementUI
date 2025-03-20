
export class FileEditModel {
    filePath: string = '';
    content: string = '';
    encoding?: string;
    lastModified?: Date;
    fileType?: string;
    readOnly?: boolean;

    constructor() {
        this.filePath = '';
        this.content = '';
    }
}