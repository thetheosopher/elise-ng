import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
  selector: 'app-sprite-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent, DocsCodeSampleComponent],
  template: `
    <h1>Sprite</h1>
    <p class="lead">
      The sprite element displays animated frame sequences, enabling frame-by-frame animation
      with configurable transitions between frames. Each frame references a bitmap resource.
    </p>

    <h2>Factory Method</h2>
    <p>
      Create a sprite element using the <code>elise.sprite()</code> factory method.
    </p>
    <app-code-block code="elise.sprite(x, y, width, height)" language="javascript" label="JavaScript"></app-code-block>

    <h2>Properties</h2>
    <table class="docs-table">
      <thead>
        <tr>
          <th>Property</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>x</code></td>
          <td>number</td>
          <td>0</td>
          <td>X coordinate of the sprite</td>
        </tr>
        <tr>
          <td><code>y</code></td>
          <td>number</td>
          <td>0</td>
          <td>Y coordinate of the sprite</td>
        </tr>
        <tr>
          <td><code>width</code></td>
          <td>number</td>
          <td>0</td>
          <td>Rendered width of the sprite</td>
        </tr>
        <tr>
          <td><code>height</code></td>
          <td>number</td>
          <td>0</td>
          <td>Rendered height of the sprite</td>
        </tr>
        <tr>
          <td><code>frames</code></td>
          <td>SpriteFrame[]</td>
          <td>[]</td>
          <td>Array of frame definitions</td>
        </tr>
        <tr>
          <td><code>frameIndex</code></td>
          <td>number</td>
          <td>0</td>
          <td>Current frame index</td>
        </tr>
        <tr>
          <td><code>loop</code></td>
          <td>boolean</td>
          <td>false</td>
          <td>Whether the animation loops continuously</td>
        </tr>
        <tr>
          <td><code>timer</code></td>
          <td>string</td>
          <td></td>
          <td>Timer command tag for animation playback</td>
        </tr>
        <tr>
          <td><code>timelineLength</code></td>
          <td>number</td>
          <td></td>
          <td>Total animation time in seconds</td>
        </tr>
      </tbody>
    </table>

    <h2>SpriteFrame Structure</h2>
    <p>
      Each frame in the sprite's frame array is a <code>SpriteFrame</code> object with the
      following properties:
    </p>
    <table class="docs-table">
      <thead>
        <tr>
          <th>Property</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>source</code></td>
          <td>string</td>
          <td>Bitmap resource key for this frame</td>
        </tr>
        <tr>
          <td><code>duration</code></td>
          <td>number</td>
          <td>Duration of this frame in seconds</td>
        </tr>
        <tr>
          <td><code>transition</code></td>
          <td>SpriteTransitionType</td>
          <td>Transition effect when entering this frame</td>
        </tr>
      </tbody>
    </table>

    <h2>Transition Types</h2>
    <p>
      Sprites support over 38 transition types for visually switching between frames. Available
      transitions include:
    </p>
    <ul>
      <li><strong>Basic:</strong> none, fade</li>
      <li><strong>Push:</strong> pushLeft, pushRight, pushUp, pushDown</li>
      <li><strong>Wipe:</strong> wipeLeft, wipeRight, wipeUp, wipeDown</li>
      <li><strong>Slide:</strong> slideLeft, slideRight, slideUp, slideDown</li>
      <li><strong>Shape:</strong> ellipticalIn, ellipticalOut, rectangularIn, rectangularOut</li>
      <li><strong>Expand:</strong> expandHorizontal, expandVertical</li>
      <li><strong>Zoom:</strong> zoomIn, zoomOut, zoomRotateIn, zoomRotateOut</li>
      <li><strong>Special:</strong> radar, grid, and more</li>
    </ul>

    <h2>Examples</h2>

    <h3>Basic Sprite</h3>
    <p>A sprite using three frame regions from one local sprite sheet.</p>
    <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Sprite with Transitions</h3>
    <p>A locally loaded sprite sheet animated with frame transitions and timer-driven playback.</p>
    <app-docs-code-sample [code]="animatedCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Looping Sprite</h3>
    <p>Two looping sprites sharing the same local sheet, each with its own transition sequence.</p>
    <app-docs-code-sample [code]="loopCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

    <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
  `
})
export class SpritePageComponent {
  previousPage: DocsPage | undefined;
  nextPage: DocsPage | undefined;

  basicCode = `const m = elise.model(240, 190);
elise.bitmapResource('santa', '/assets/resources/sprites/santa.png').addTo(m);

const sprite = elise.sprite(45, 20, 150, 150)
  .setFrames([
    elise.spriteFrame('santa', 0, 0, 150, 150, 0.1, 'none', 0),
    elise.spriteFrame('santa', 150, 0, 150, 150, 0.1, 'none', 0),
    elise.spriteFrame('santa', 300, 0, 150, 150, 0.1, 'none', 0)
  ])
  .addTo(m);

sprite.setFrameIndex(1);`;

  animatedCode = `const m = elise.model(240, 190);
const sheetWidth = 256;
const sheetHeight = 256;
const frameWidth = 64;
const frameHeight = 64;

elise.bitmapResource('explosion', '/assets/resources/sprites/explosion.png').addTo(m);

const sprite = elise.sprite(72, 46, 96, 96)
  .setLoop(true)
  .setTimer('tick')
  .addTo(m);

sprite.createSheetFrames('explosion', sheetWidth, sheetHeight, frameWidth, frameHeight, 16, 0.06, 'fade', 0.03);

m.controllerAttached.add((_model, controller) => {
  const handler = new elise.ElementCommandHandler();
  handler.attachController(controller);
  handler.addHandler('tick', (_controller, element, command, trigger, parameters) => {
    elise.TransitionRenderer.spriteTransitionHandler(_controller, element, command, trigger, parameters);
  });
});`;

  loopCode = `const m = elise.model(260, 190);
elise.bitmapResource('santa', '/assets/resources/sprites/santa.png').addTo(m);
elise.bitmapResource('explosion', '/assets/resources/sprites/explosion.png').addTo(m);

const walker = elise.sprite(-70, 28, 70, 70)
  .setTimer('walkTick')
  .setLoop(true)
  .addTo(m);

walker.createSheetFrames('santa', 600, 600, 150, 150, 16, 0.08, 'none', 0);

const burst = elise.sprite(150, 54, 72, 72)
  .setTimer('burstTick')
  .setLoop(true)
  .addTo(m);

burst.createSheetFrames('explosion', 256, 256, 64, 64, 16, 0.05, 'zoomOut', 0.03);

m.controllerAttached.add((_model, controller) => {
  const handler = new elise.ElementCommandHandler();
  handler.attachController(controller);

  handler.addHandler('walkTick', (_controller, element, command, trigger, parameters) => {
    const phase = _controller.timerPhase(0.12);
    const x = phase / (Math.PI * 2) * 340 - 80;
    element.setLocation(elise.point(x, 28));
    elise.TransitionRenderer.spriteTransitionHandler(_controller, element, command, trigger, parameters);
    controller.invalidate();
  });

  handler.addHandler('burstTick', (_controller, element, command, trigger, parameters) => {
    elise.TransitionRenderer.spriteTransitionHandler(_controller, element, command, trigger, parameters);
  });
});`;

  constructor(private docsService: DocsService) {
    this.previousPage = docsService.getPreviousPage('elements', 'sprite');
    this.nextPage = docsService.getNextPage('elements', 'sprite');
  }
}
