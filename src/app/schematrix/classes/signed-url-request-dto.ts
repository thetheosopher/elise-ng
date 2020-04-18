export class SignedUrlRequestDTO {
    ContainerID: string;
    Path: string;
    ContentType?: string;
    ContentDisposition?: string;
    Verb: string;
    Url: string;
}
