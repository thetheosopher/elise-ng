import { ManifestFolderDTO } from './manifest-folder-dto';
import { ManifestFileDTO } from './manifest-file-dto';

export class ManifestDTO {
    Bucket?: string;
    ContainerID?: string;
    RootPath?: string;
    FileCount?: number;
    FileSize?: number;
    TimeStamp?: string;
    Folders?: [ManifestFolderDTO];
    Files?: [ManifestFileDTO];
}
