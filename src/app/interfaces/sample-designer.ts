import { Model } from 'elise-graphics/lib/core/model';

export interface ISampleDesigner {
    title: string;
    description: string;
    model: Model;
    scale: number;
    displayModel: boolean;
    background: string;
}
