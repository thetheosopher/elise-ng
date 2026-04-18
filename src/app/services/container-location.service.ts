import { Injectable } from '@angular/core';

import { ContainerDTO } from '../schematrix/classes/container-dto';

export type ContainerLocation = {
    container: ContainerDTO | null;
    folderPath: string | null;
};

@Injectable({
    providedIn: 'root'
})
export class ContainerLocationService {

    private location: ContainerLocation = {
        container: null,
        folderPath: null
    };

    getLocation(): ContainerLocation {
        return {
            container: this.location.container ? { ...this.location.container } : null,
            folderPath: this.location.folderPath
        };
    }

    getFolderPathForContainer(containerId: string | null | undefined): string | null {
        if (!containerId || !this.location.container?.ContainerID || this.location.container.ContainerID !== containerId) {
            return null;
        }
        return this.location.folderPath;
    }

    saveLocation(container: ContainerDTO | null, folderPath: string | null): void {
        this.location = {
            container: container ? { ...container } : null,
            folderPath
        };
    }

    clear(): void {
        this.saveLocation(null, null);
    }
}
