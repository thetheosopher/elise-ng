import { Model } from '../elise/core/model';

export interface ISampleDesigner {
    title: string;
    description: string;
    model: Model;
    scale: number;
    displayModel: boolean;
    background: string;
    codeString: string;
}
