import { Model } from 'elise-graphics/lib/core/model';

export interface ISampleViewer {
    title: string;
    description: string;
    model: Model;
    scale: number;
    timerEnabled: boolean;
    displayModel: boolean;
    background: string;
    codeString: string;
}
