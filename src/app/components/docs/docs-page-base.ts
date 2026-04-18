import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DocsService, DocsPage } from '../../../services/docs.service';

@Component({ template: '' })
export abstract class DocsPageBase implements OnInit, OnDestroy {
    currentPage?: DocsPage;
    nextPage?: DocsPage;
    previousPage?: DocsPage;
    private routeSub?: Subscription;

    constructor(
        protected route: ActivatedRoute,
        protected docsService: DocsService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            const categoryId = this.route.parent?.snapshot.params['category'] ?? this.route.snapshot.data['category'];
            const pageId = params['page'] ?? this.route.snapshot.data['page'];
            if (categoryId && pageId) {
                this.currentPage = this.docsService.getPage(categoryId, pageId);
                this.nextPage = this.docsService.getNextPage(categoryId, pageId);
                this.previousPage = this.docsService.getPreviousPage(categoryId, pageId);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub?.unsubscribe();
    }
}
