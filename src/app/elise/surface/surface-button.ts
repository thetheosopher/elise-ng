import { SurfaceElement } from './surface-element';
import { CommonEvent } from '../core/common-event';
import { Model } from '../core/model';
import { SpriteElement } from '../elements/sprite-element';
import { SpriteFrame } from '../elements/sprite-frame';
import { EliseException } from '../core/elise-exception';
import { ElementStates } from './element-states';
import { Surface } from './surface';

export class SurfaceButton extends SurfaceElement {
    static BUTTON_CLICK = 'buttonClick';

    /**
      Click event (button: SurfaceButton)
    */
    clicked: CommonEvent<SurfaceButton> = new CommonEvent<SurfaceButton>();

    /**
      Normal state sprite index
    */
    normalIndex: number;

    /**
      Selected state sprite index
    */
    selectedIndex: number;

    /**
      Highlighted state sprite index
    */
    highlightedIndex: number;

    /**
      Disabled state sprite index
    */
    disabledIndex: number;

    /**
      Button enabled state
    */
    isEnabled: boolean;

    /**
      Button toggle button selected state
    */
    isSelected: boolean;

    /**
      True if toggle button (checkbox/radio)
    */
    isToggle: boolean;

    /**
      Button radio group id
    */
    groupId: string = null;

    /**
      Internal sprite element
    */
    spriteElement: SpriteElement;

    /**
      Constructs a surface button
      @classdesc Renders a multistate image button derived from surface page images
      @extends Elise.Player.SurfaceElement
      @param id - Item id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param clickListener - Click event listener
    */
    constructor(
        id: string,
        left: number,
        top: number,
        width: number,
        height: number,
        clickListener: (button: SurfaceButton) => void
    ) {
        super(id, left, top, width, height);
        this.normalIndex = 0;
        this.selectedIndex = 0;
        this.highlightedIndex = 0;
        this.disabledIndex = 0;
        this.isEnabled = true;
        this.isSelected = false;
        this.isToggle = false;
        this.setEnabled = this.setEnabled.bind(this);
        this.addToModel = this.addToModel.bind(this);
        this.onClicked = this.onClicked.bind(this);
        if (clickListener) {
            this.clicked.add(clickListener);
        }
    }

    /**
      Creates a surface button
      @classdesc Renders a multistate image button derived from surface page images
      @extends Elise.Player.SurfaceElement
      @param id - Item id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param clickListener - Click event listener
    */
    static create(
        id: string,
        left: number,
        top: number,
        width: number,
        height: number,
        clickListener: (button: SurfaceButton) => void
    ) {
        return new SurfaceButton(id, left, top, width, height, clickListener);
    }

    /**
      Creates a checkbox (toggle) surface button
      @classdesc Renders a multistate image button derived from surface page images
      @extends Elise.Player.SurfaceElement
      @param id - Item id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param clickListener - Click event listener
    */
    static createCheckbox(
        id: string,
        left: number,
        top: number,
        width: number,
        height: number,
        clickListener: (button: SurfaceButton) => void
    ) {
        const button = new SurfaceButton(id, left, top, width, height, clickListener);
        button.isToggle = true;
        return button;
    }

    /**
      Creates a radio button group surface button
      @classdesc Renders a multistate image button derived from surface page images
      @extends Elise.Player.SurfaceElement
      @param id - Item id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param clickListener - Click event listener
    */
    static createRadioButton(
        groupId: string,
        id: string,
        left: number,
        top: number,
        width: number,
        height: number,
        clickListener: (button: SurfaceButton) => void
    ) {
        const button = new SurfaceButton(id, left, top, width, height, clickListener);
        button.groupId = groupId;
        button.isToggle = true;
        return button;
    }

    addTo(surface: Surface) {
        surface.elements.push(this);
        return this;
    }

    setEnabled(isEnabled: boolean) {
        if (isEnabled === this.isEnabled) {
            return;
        }
        this.isEnabled = isEnabled;
        if (!this.isEnabled) {
            this.spriteElement.frameIndex = this.disabledIndex;
            this.spriteElement.setInteractive(false);
        }
        else {
            if (this.isSelected && this.isToggle) {
                this.spriteElement.frameIndex = this.selectedIndex;
            }
            else {
                this.spriteElement.frameIndex = this.normalIndex;
            }
            this.spriteElement.setInteractive(true);
        }
        this.surface.controller.draw();
    }

    /**
      Adds button to surface model
      @returns New button
    */
    addToModel(model: Model) {
        const surface = this.surface;

        // If no normal image, throw error
        if (!surface.normalImageSource) {
            throw new EliseException('No normal image source defined.');
        }

        const sprite = SpriteElement.create(this.left, this.top, this.width, this.height);
        sprite.id = this.id;
        this.spriteElement = sprite;
        sprite.frames.push(
            SpriteFrame.create(ElementStates.NORMAL, this.left, this.top, this.width, this.height, 0, null, 0)
        );

        if (surface.selectedImageSource) {
            sprite.frames.push(
                SpriteFrame.create(ElementStates.SELECTED, this.left, this.top, this.width, this.height, 0, null, 0)
            );
            this.selectedIndex = sprite.frames.length - 1;
        }

        if (surface.highlightedImageSource) {
            sprite.frames.push(
                SpriteFrame.create(ElementStates.HIGHLIGHTED, this.left, this.top, this.width, this.height, 0, null, 0)
            );
            this.highlightedIndex = sprite.frames.length - 1;
            if (!surface.selectedImageSource) {
                this.selectedIndex = this.highlightedIndex;
            }
        }

        if (surface.disabledImageSource) {
            sprite.frames.push(
                SpriteFrame.create(ElementStates.DISABLED, this.left, this.top, this.width, this.height, 0, null, 0)
            );
            this.disabledIndex = sprite.frames.length - 1;
        }

        if (this.highlightedIndex !== this.normalIndex) {
            sprite.mouseDown = 'pushFrame(' + this.highlightedIndex + ')';
            sprite.mouseUp = 'popFrame()';
        }
        else if (this.selectedIndex !== this.normalIndex) {
            sprite.mouseDown = 'pushFrame(' + this.selectedIndex + ')';
            sprite.mouseUp = 'popFrame()';
        }
        sprite.click = SurfaceButton.BUTTON_CLICK;

        if (!this.isEnabled) {
            sprite.frameIndex = this.disabledIndex;
        }
        else {
            if (this.isSelected && this.isToggle) {
                sprite.frameIndex = this.selectedIndex;
            }
            sprite.setInteractive(true);
        }

        model.add(sprite);

        return sprite;
    }

    /**
      Click handler called from lower level event handlers
      @method Elise.Player.SurfaceButton.onClicked
    */
    onClicked() {
        const self = this;
        if (self.isToggle) {
            if (self.groupId !== null) {
                if (!self.isSelected) {
                    self.surface.elements.forEach(function(sel) {
                        if (sel instanceof SurfaceButton) {
                            if (sel.id === self.id) {
                                sel.isSelected = true;
                                sel.spriteElement.frameIndex = sel.selectedIndex;
                            }
                            else if (self.groupId === sel.groupId) {
                                sel.isSelected = false;
                                if (sel.isEnabled) {
                                    sel.spriteElement.frameIndex = sel.normalIndex;
                                }
                                else {
                                    sel.spriteElement.frameIndex = sel.disabledIndex;
                                }
                            }
                        }
                    });
                }
                else {
                    self.surface.elements.forEach(function(sel) {
                        if (sel instanceof SurfaceButton) {
                            if (self.groupId === sel.groupId) {
                                sel.isSelected = false;
                                sel.spriteElement.frameIndex = sel.normalIndex;
                            }
                        }
                    });
                }
            }
            else {
                if (!self.isSelected) {
                    self.isSelected = true;
                    self.spriteElement.frameIndex = self.selectedIndex;
                }
                else {
                    self.isSelected = false;
                    self.spriteElement.frameIndex = self.normalIndex;
                }
            }
        }
        if (self.clicked.hasListeners()) {
            self.clicked.trigger(self);
        }
        if (self.surface.controller) {
            self.surface.controller.draw();
        }
    }
}
