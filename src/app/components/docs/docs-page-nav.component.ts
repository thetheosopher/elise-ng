import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsPage } from '../../services/docs.service';

@Component({
    imports: [CommonModule, RouterModule],
    selector: 'app-docs-page-nav',
    template: `
        <div class="docs-page-nav">
            <a *ngIf="previousPage" class="docs-page-nav-link docs-page-nav-prev" [routerLink]="previousPage.route">
                <span class="fas fa-arrow-left me-2"></span>
                <div>
                    <div class="docs-page-nav-label">Previous</div>
                    <div class="docs-page-nav-title">{{ previousPage.title }}</div>
                </div>
            </a>
            <div *ngIf="!previousPage" class="docs-page-nav-spacer"></div>
            <a *ngIf="nextPage" class="docs-page-nav-link docs-page-nav-next" [routerLink]="nextPage.route">
                <div>
                    <div class="docs-page-nav-label">Next</div>
                    <div class="docs-page-nav-title">{{ nextPage.title }}</div>
                </div>
                <span class="fas fa-arrow-right ms-2"></span>
            </a>
        </div>
    `,
    styles: [`
        .docs-page-nav {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid var(--docs-border, #dee2e6);
        }
        .docs-page-nav-link {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            border: 1px solid var(--docs-border, #dee2e6);
            border-radius: 8px;
            text-decoration: none;
            color: var(--docs-nav-active-color, #0d6efd);
            transition: all 0.15s;
            max-width: 48%;
        }
        .docs-page-nav-link:hover {
            background: var(--docs-nav-active-bg, rgba(13, 110, 253, 0.06));
            border-color: var(--docs-nav-active-color, #0d6efd);
        }
        .docs-page-nav-next { margin-left: auto; text-align: right; }
        .docs-page-nav-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.7; }
        .docs-page-nav-title { font-weight: 600; font-size: 0.95rem; }
        .docs-page-nav-spacer { flex: 1; }
        :host-context(.dark-theme) {
            .docs-page-nav { border-top-color: #2d3139; }
            .docs-page-nav-link { border-color: #2d3139; color: #6ea8fe; }
            .docs-page-nav-link:hover { background: rgba(110, 168, 254, 0.08); border-color: #6ea8fe; }
        }
    `]
})
export class DocsPageNavComponent {
    @Input() previousPage?: DocsPage;
    @Input() nextPage?: DocsPage;
}
