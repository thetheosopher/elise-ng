import { Surface } from '../elise/surface/surface';

export interface ISurfaceViewer {
    title: string;
    description: string;
    surface: Surface;
    scale: number;
    opacity: number;
    transition: string;
    transitionDisplay: boolean;
    log: (message: string) => void;
}
