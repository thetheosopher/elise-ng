import { SurfaceElement } from './surface-element';
import { CommonEvent } from '../core/common-event';
import { TextElement } from '../elements/text-element';
import { RectangleElement } from '../elements/rectangle-element';
import { Model } from '../core/model';
import { Surface } from './surface';

export class Text extends SurfaceElement {
    static TEXT_CLICK = 'textClick';

    /**
      Rendered text content
    */
    content: string;

    /**
      Text color as string
    */
    color: string;

    /**
      Text alignment directives
    */
    textAlignment: string;

    /**
      Font typeface
    */
    typeFace: string;

    /**
      Font type size in pixels
    */
    typeSize: number;

    /**
      Font type style
    */
    typeStyle: string;

    /**
      Background fill color as string
    */
    background: string;

    /**
      Layut area border stroke
    */
    border: string;

    /**
      Layout area padding
    */
    padding: number;

    /**
      Click event
    */
    clicked: CommonEvent<Text> = new CommonEvent<Text>();

    /**
      Internal Elise TextElement
    */
    textElement: TextElement;

    /**
      Constructs a text item
      @classdesc Renders styled text with an optional background fill and border stroke
      @extends Elise.Player.SurfaceElement
      @param id - Item id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param content - Rendered text content
      @param clickListener - Click event listener
    */
    constructor(
        id: string,
        left: number,
        top: number,
        width: number,
        height: number,
        content: string,
        clickListener: (text: Text) => void
    ) {
        super(id, left, top, width, height);
        this.onClicked = this.onClicked.bind(this);
        this.color = 'Black';
        this.textAlignment = 'left,top';
        this.typeFace = 'sans-serif';
        this.typeSize = 10;
        this.typeStyle = '';
        this.background = null;
        this.border = null;
        this.padding = 0;
        this.content = content;

        this.addToModel = this.addToModel.bind(this);
        this.onClicked = this.onClicked.bind(this);

        if (clickListener) {
            this.clicked.add(clickListener);
        }
    }

    /**
    Creates a text item
    @param id - Item id
    @param left - Layout area x coordinate
    @param top - Layout area y coordinate
    @param width - Layout area width
    @param height - Layout area height
    @param content - Rendered text content
    @param clickListener - Click event listener
    @returns New text item
     */
    public static create(
        id: string,
        left: number,
        top: number,
        width: number,
        height: number,
        content: string,
        clickListener: (text: Text) => void
    ) {
        return new Text(id, left, top, width, height, content, clickListener);
    }

    /**
      Creates and adds a text item to target surface
      @param surface - Target surface for text element
      @returns This text element
    */
    addTo(surface: Surface) {
        surface.elements.push(this);
        return this;
    }

    /**
          Adds item to surface model
          @param model - Surface model
          @returns New text item
        */
    addToModel(model: Model) {
        if (this.background || this.border) {
            const rect = RectangleElement.create(this.left, this.top, this.width, this.height);
            if (this.background) {
                rect.setFill(this.background);
            }
            if (this.border) {
                rect.setStroke(this.border);
            }
            rect.interactive = false;
            model.add(rect);
        }

        const text = TextElement.create(
            this.content,
            this.left + this.padding,
            this.top + this.padding,
            this.width - this.padding * 2,
            this.height - this.padding * 2
        );
        text.setFill(this.color);
        text.alignment = this.textAlignment;
        text.typeface = this.typeFace;
        text.typesize = this.typeSize;
        text.typestyle = this.typeStyle;
        text.id = this.id;
        this.textElement = text;
        text.click = Text.TEXT_CLICK;
        text.setInteractive(true);
        model.add(text);
        return text;
    }

    /**
      Click handler called from lower level event handlers
      @method Elise.Player.Text.onClicked
    */
    onClicked() {
        this.clicked.trigger(this);
    }
}
