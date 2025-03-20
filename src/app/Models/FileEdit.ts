export interface FileEdit {
    filePath: string;
    fileContent: string;
    encoding?: string;
    lastModified?: Date;
    originalContent?: string;  // Değişiklikleri izlemek için
    fileType?: string;        // Dosya türü (text, binary, vb.)
    readOnly?: boolean;       // Dosyanın yazma izni kontrolü
}