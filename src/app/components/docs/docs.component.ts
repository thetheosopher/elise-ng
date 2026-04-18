import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsCategory } from '../../services/docs.service';

@Component({
    imports: [CommonModule, RouterModule],
    selector: 'app-docs',
    templateUrl: './docs.component.html',
    styleUrls: ['./docs.component.scss']
})
export class DocsComponent {
    categories: DocsCategory[];
    expandedCategories = new Set<string>();

    constructor(private docsService: DocsService) {
        this.categories = this.docsService.categories;
        if (this.categories.length > 0) {
            this.expandedCategories.add(this.categories[0].id);
        }
    }

    toggleCategory(categoryId: string) {
        if (this.expandedCategories.has(categoryId)) {
            this.expandedCategories.delete(categoryId);
        } else {
            this.expandedCategories.add(categoryId);
        }
    }

    isCategoryExpanded(categoryId: string): boolean {
        return this.expandedCategories.has(categoryId);
    }

    expandCategoryForRoute(categoryId: string) {
        this.expandedCategories.add(categoryId);
    }
}
