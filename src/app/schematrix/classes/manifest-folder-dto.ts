import { ManifestFileDTO } from './manifest-file-dto';

export class ManifestFolderDTO {
    Name: string;
    Folders?: [ManifestFolderDTO];
    Files?: [ManifestFolderDTO];
}
