import { ElementBase } from './element-base';
import { TextResource } from '../resource/text-resource';
import { ResourceManager } from '../resource/resource';
import { Point } from '../core/point';
import { Size } from '../core/size';
import { FillFactory } from '../fill/fill-factory';

export class TextElement extends ElementBase {
    /**
      Text string to render
    */
    text: string;

    /**
      Text resource key
    */
    source: string;

    /**
      Font typeface
    */
    typeface: string;

    /**
      Font type size in pixels
    */
    typesize: number;

    /**
      Font typestyle
    */
    typestyle: string;

    /**
      Text block alignment directives
    */
    alignment: string;

    /**
      Constructs a text element
      @classdesc Renders stroked and/or filled, formatted text.
      @extends Elise.Drawing.ElementBase
    */
    constructor() {
        super();
        this.type = 'text';
        this.setText = this.setText.bind(this);
        this.setSource = this.setSource.bind(this);
        this.setTypeface = this.setTypeface.bind(this);
        this.setTypesize = this.setTypesize.bind(this);
        this.setTypestyle = this.setTypestyle.bind(this);
        this.setAlignment = this.setAlignment.bind(this);
        this.getLines = this.getLines.bind(this);
    }

    /**
      Text element factory function
      @param text - Text string or text resource key to render
      @param x - Text block x coordinate
      @param y - Text block y coordinate
      @param width - Text block width
      @param height - Text block height
      @returns New text element
    */
    static create(text?: string | TextResource, x?: number, y?: number, width?: number, height?: number): TextElement {
        const e = new TextElement();
        if (arguments.length === 5) {
            if (typeof text === 'string') {
                e.text = text;
            }
            else {
                e.source = text.key;
            }
            e._location = new Point(x, y);
            e._size = new Size(width, height);
        }
        return e;
    }

    /**
      Copies properties of another object to this instance
      @param o - Source object
    */
    parse(o: any): void {
        super.parse(o);
        if (o.text) {
            this.text = o.text;
        }
        if (o.source) {
            this.source = o.source;
        }
        if (o.typeface) {
            this.typeface = o.typeface;
        }
        if (o.typesize) {
            this.typesize = o.typesize;
        }
        if (o.typestyle) {
            this.typestyle = o.typestyle;
        }
        if (o.alignment) {
            this.alignment = o.alignment;
        }
        if (!this.location) {
            this._location = new Point(0, 0);
        }
    }

    /**
      Serializes persistent properties to new object instance
      @returns Serialized element
    */
    serialize(): any {
        const o = super.serialize();
        if (this.text) {
            o.text = this.text;
        }
        if (this.source) {
            o.source = this.source;
        }
        if (this.typeface) {
            o.typeface = this.typeface;
        }
        if (this.typesize) {
            o.typesize = this.typesize;
        }
        if (this.typestyle) {
            o.typestyle = this.typestyle;
        }
        if (this.alignment) {
            o.alignment = this.alignment;
        }
        return o;
    }

    /**
      Clones this text element to a new instance
      @returns Cloned text element
    */
    clone(): TextElement {
        const e: TextElement = TextElement.create();
        super.cloneTo(e);
        if (this.text) {
            e.text = this.text;
        }
        if (this.source) {
            e.source = this.source;
        }
        if (this.typeface) {
            e.typeface = this.typeface;
        }
        if (this.typesize) {
            e.typesize = this.typesize;
        }
        if (this.typestyle) {
            e.typestyle = this.typestyle;
        }
        if (this.alignment) {
            e.alignment = this.alignment;
        }
        return e;
    }

    /**
      Registers referenced resources with resource manager
      @param rm - Resource manager
    */
    registerResources(rm: ResourceManager) {
        super.registerResources(rm);
        if (this.source) {
            rm.register(this.source);
        }
    }

    /**
      Returns list of referenced resource keys
    */
    getResourceKeys() {
        const keys = super.getResourceKeys();
        if (this.source) {
            keys.push(this.source);
        }
        return keys;
    }

    /**
      Render text element to canvas context
      @param c - Rendering context
    */
    draw(c: CanvasRenderingContext2D): void {
        const model = this.model;
        c.save();
        if (this.transform) {
            model.setRenderTransform(c, this.transform, new Point(this._location.x, this._location.y));
        }
        c.beginPath();
        c.rect(this._location.x, this._location.y, this._size.width + 10, this._size.height);
        c.clip();
        let font = '';
        let fontSize = '10.0';
        if (this.typestyle && this.typestyle.length > 0) {
            const parts = this.typestyle.split(',');
            for (let i = 0; i < parts.length; i++) {
                font += parts[i];
                font += ' ';
            }
        }
        if (this.typesize) {
            fontSize = String(this.typesize);
            font += this.typesize + 'px ';
        }
        if (this.typeface) {
            const parts = this.typeface.split(',');
            for (let i = 0; i < parts.length; i++) {
                font += parts[i];
                font += ' ';
            }
        }
        else {
            font += 'sans-serif';
        }
        c.font = font;
        let valign = 'top';
        let halign = 'left';
        if (this.alignment) {
            const parts = this.alignment.split(',');
            for (let i = 0; i < parts.length; i++) {
                if (parts[i].toLowerCase() === 'start') {
                    c.textAlign = 'start';
                    halign = 'left';
                }
                else if (parts[i].toLowerCase() === 'end') {
                    c.textAlign = 'end';
                    halign = 'right';
                }
                else if (parts[i].toLowerCase() === 'left') {
                    c.textAlign = 'left';
                    halign = 'left';
                }
                else if (parts[i].toLowerCase() === 'right') {
                    c.textAlign = 'right';
                    halign = 'right';
                }
                else if (parts[i].toLowerCase() === 'center') {
                    c.textAlign = 'center';
                    halign = 'center';
                }
                else if (parts[i].toLowerCase() === 'top') {
                    valign = 'top';
                }
                else if (parts[i].toLowerCase() === 'bottom') {
                    valign = 'bottom';
                }
                else if (parts[i].toLowerCase() === 'middle') {
                    valign = 'middle';
                }
            }
        }

        // Resolve text content
        let text: string = null;
        if (this.source) {
            const res = model.resourceManager.get(this.source) as TextResource;
            if (res) {
                text = res.text;
            }
        }
        if (!text) {
            text = this.text;
        }

        // Get lines of text
        const lines = this.getLines(c, text, this._size.width);

        // Compute total height of text
        const lineHeight: number = parseFloat(fontSize);
        const totalHeight = lineHeight * lines.length;
        let line: string, x: number, y: number;

        if (FillFactory.setElementFill(c, this)) {
            const loc = this.getLocation();

            // Iterate lines and fill text
            x = this._location.x;
            if (halign === 'right') {
                x += this._size.width;
            }
            else if (halign === 'center') {
                x += this._size.width / 2;
            }
            y = this._location.y;
            c.textBaseline = 'top';
            if (valign === 'middle') {
                y = this._location.y + this._size.height / 2 - totalHeight / 2;
            }
            else if (valign === 'bottom') {
                y = this._location.y + this._size.height - totalHeight;
            }
            for (let i = 0; i < lines.length; i++) {
                line = lines[i];
                if (this.fillOffsetX || this.fillOffsetY) {
                    const fillOffsetX = this.fillOffsetX || 0;
                    const fillOffsetY = this.fillOffsetY || 0;
                    c.translate(loc.x + fillOffsetX, loc.y + fillOffsetY);
                    c.fillText(line, -fillOffsetX + x - loc.x, -fillOffsetY + y - loc.y);
                    c.translate(-(loc.x + fillOffsetX), -(loc.y + fillOffsetY));
                }
                else {
                    c.translate(loc.x, loc.y);
                    c.fillText(line, x - loc.x, y - loc.y);
                    c.translate(-loc.x, -loc.y);
                }
                y += lineHeight;
            }
        }

        if (model.setElementStroke(c, this)) {
            // Iterate lines and stroke text
            x = this._location.x;
            if (halign === 'right') {
                x += this._size.width;
            }
            else if (halign === 'center') {
                x += this._size.width / 2;
            }
            y = this._location.y;
            c.textBaseline = 'top';
            if (valign === 'middle') {
                y = this._location.y + this._size.height / 2 - totalHeight / 2;
            }
            else if (valign === 'bottom') {
                y = this._location.y + this._size.height - totalHeight;
            }
            for (let i = 0; i < lines.length; i++) {
                line = lines[i];
                c.strokeText(line, x, y);
                y += lineHeight;
            }
        }

        c.restore();
    }

    /**
      Text set accessor.  Clears source property when set.
      @param text - Text string to render
      @returns This text element
    */
    setText(text: string) {
        this.text = text;
        delete this.source;
        return this;
    }

    /**
      Source set accessor. Clears text property when set.
      @param source - Text resource key
      @returns This text element
    */
    setSource(source: string) {
        this.source = source;
        delete this.text;
        return this;
    }

    /**
      Typeface set accessor
      @param typeface - Font typeface
      @returns This text element
    */
    setTypeface(typeface: string) {
        this.typeface = typeface;
        return this;
    }

    /**
      Typeface set accessor
      @param typesize - Font type size in pixels
      @returns This text element
    */
    setTypesize(typesize: number) {
        this.typesize = typesize;
        return this;
    }

    /**
      Typestyle set accessor
      @param typestyle - Font typestyle
      @returns This text element
    */
    setTypestyle(typestyle: string) {
        this.typestyle = typestyle;
        return this;
    }

    /**
      Alignment set accessor
      @param alignment - Text block alignment directives
      @returns This text element
    */
    setAlignment(alignment: string) {
        this.alignment = alignment;
        return this;
    }

    /**
      Splits text to render into lines that will fit into specified
      element width
      @param c - Rendering context
      @param text - Text to render
      @param lineWidth - Text block width
      @returns Split text lines
     */
    getLines(c: CanvasRenderingContext2D, text: string, lineWidth: number): string[] {
        const splitLines = text.split('\n');
        const lines: string[] = [];
        for (let j = 0; j < splitLines.length; j++) {
            const line = splitLines[j];
            const words = line.split(' ');
            if (words.length === 1) {
                lines.push(words[0]);
                continue;
            }
            let lastLine = words[0];
            let measure = 0;
            const wl = words.length;
            for (let i = 1; i < wl; i++) {
                const word = words[i];
                measure = c.measureText(lastLine + word).width;
                if (measure < lineWidth) {
                    lastLine += ' ' + word;
                }
                else {
                    lines.push(lastLine);
                    lastLine = word;
                }
                if (i === words.length - 1) {
                    lines.push(lastLine);
                    break;
                }
            }
        }
        return lines;
    }

    /**
      Can element be stroked
      @returns Can stroke
    */
    canStroke(): boolean {
        return true;
    }

    /**
      Can element be filled
      @returns Can fill
    */
    canFill(): boolean {
        return true;
    }
}
