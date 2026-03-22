# Elise-NG Project Analysis

> Comprehensive analysis of the Angular 20 application — inconsistencies, issues, and improvement suggestions.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Critical Issues](#critical-issues)
3. [Inconsistencies](#inconsistencies)
4. [Security Concerns](#security-concerns)
5. [Performance Issues](#performance-issues)
6. [Code Quality Issues](#code-quality-issues)
7. [Testing Gap](#testing-gap)
8. [Suggestions for Improvement](#suggestions-for-improvement)
9. [Feature Suggestions](#feature-suggestions)

---

## Critical Fix Status (March 2026)

Completed in code:

- Added auth guard for protected test and API routes.
- Added explicit 404 handling with a not-found component and wildcard route.
- Converted remaining non-standalone components (`FooterComponent`, `ProgressComponent`) to standalone-style components.
- Removed `EliseModule` usage and switched to direct standalone component imports.
- Patched long-lived subscriptions in high-risk components (`LoginComponent`, `HeaderComponent`, `ContainerExplorerComponent`, `ModelDesignerComponent`, `ModelPlaygroundComponent`) using `takeUntilDestroyed` and one-shot upload callbacks.

Still recommended next:

- Add an HTTP interceptor for token handling and 401 recovery.
- Replace service-level `EventEmitter` usage with `Subject` or `BehaviorSubject`.
- Review remaining `subscribe` usage patterns and migrate to consistent teardown strategy where streams are long-lived.

---

## Architecture Overview

| Attribute | Value |
|---|---|
| Angular Version | 20.x |
| Build System | `@angular-devkit/build-angular:application` |
| Component Pattern | Standalone (mostly) |
| Routing | Eager-loaded, hash-based |
| State Management | Service-based (no NgRx/signals) |
| CSS Framework | Bootstrap 5 + SCSS |
| HTTP | `provideHttpClient()` |
| Auth | Custom JWT via `ApiService` with `localStorage` |
| Graphics Engine | `elise-graphics` (local npm link) |
| Test Framework | Karma + Jasmine (configured but unused) |

**Components:** ~50 (standalone)  
**Services:** 11  
**DTOs/Classes:** 8  
**Routes:** 23 (all eagerly loaded)

---

## Critical Issues

### 1. Pervasive Memory Leaks — Missing Subscription Cleanup

**85 `.subscribe()` calls** found across the codebase, but only **2 components** properly clean up (`AlertComponent`, `RandomSketchesComponent`). The three `elise-*` wrapper components also clean up, but they manage controller bindings, not subscriptions.

**Affected components with long-lived subscriptions:**

| Component | Subscriptions | Has `ngOnDestroy`? |
|---|---|---|
| `LoginComponent` | 3 (event subscriptions) | No |
| `HeaderComponent` | 2 (event subscriptions) | No |
| `RegisterComponent` | 4+ (API + validation) | No |
| `ContainerExplorerComponent` | 6+ (API + QueryList) | No |
| `ModelDesignerComponent` | 10+ (API + QueryList + uploads) | No |
| `ModelPlaygroundComponent` | 5+ (API + QueryList + uploads) | No |
| `ContainerTreeComponent` | 3 (API calls) | No |
| `ContainerSelectorComponent` | 3 (API calls) | No |

**Impact:** Every navigation away from these routes leaks subscriptions. EventEmitter subscriptions on `ApiService` (`loginEvent`, `logoutEvent`, `errorEvent`) accumulate with each route visit.

### 2. No Route Guards or Auth Protection

There are **no route guards** anywhere in the application. Routes like `/tests/container-explorer`, `/tests/model-designer`, and `/tests/model-playground` require authentication to function but are accessible without login. Users can navigate to authenticated routes, trigger API calls that fail silently, and see broken UI states.

### 3. No Wildcard / 404 Route

The route configuration has no `**` wildcard route. Any invalid URL silently loads nothing below the header/footer.

### 4. Two Components Not Converted to Standalone

`FooterComponent` and `ProgressComponent` are still using the legacy class-based pattern (`export class`) **without** the `imports` array in their `@Component` decorator. Every other component in the project has been converted to standalone.

```typescript
// footer.component.ts — missing imports array
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit { ... }
```

### 5. `EliseModule` NgModule Still Exists

`elise.module.ts` is the only remaining `@NgModule` in the project. Since the three components it wraps (`EliseViewComponent`, `EliseDesignComponent`, `EliseSurfaceComponent`) are already standalone, the module is redundant. Components that import `EliseModule` could import the standalone components directly.

---

## Inconsistencies

### Component File Naming

Most components follow `component-name.component.ts` / `.component.html` / `.component.scss`. Two components break this:

- `model-playground/model-playground.component.ts` → **actually named** `model-playground.ts`
- `model-playground/model-playground.component.html` → **actually named** `model-playground.html`
- `model-playground/model-playground.component.scss` → **actually named** `model-playground.scss`

These files omit the `.component` suffix.

### Empty Lifecycle Hooks

Multiple components implement `OnInit` with an empty `ngOnInit()`:
- `FooterComponent`
- `ProgressComponent`
- `FileListComponent`
- `UploadListComponent`

These should either be removed or populated with initialization logic.

### Inconsistent `styleUrls` vs `styleUrl`

Angular 20 supports both `styleUrls: [...]` (array) and `styleUrl: '...'` (single string). The codebase uses `styleUrls` everywhere, which is fine for consistency, but some components have empty SCSS files that could be eliminated entirely.

### Template Syntax: Legacy `*ngFor` / `*ngIf`

All templates use the legacy structural directive syntax (`*ngFor`, `*ngIf`). Angular 17+ introduced the new control flow syntax (`@for`, `@if`, `@switch`) which is now the recommended approach. The entire codebase should be migrated.

### `EventEmitter` Used in Services

`UploadService` and `ApiService` use `EventEmitter` for inter-component communication. `EventEmitter` is designed for `@Output()` bindings only. These should use RxJS `Subject` or `BehaviorSubject` instead.

### `useDefineForClassFields: false` in tsconfig

This is a legacy compatibility flag. It should be set to `true` (or removed, as `true` is the default) for modern Angular. Setting it to `false` causes class field semantics to differ from the ECMAScript standard.

### `module: "es2020"` in tsconfig

With Angular 20 targeting `ES2022`, the module field should also be updated. The `bundler` moduleResolution is already set, but `es2020` is outdated.

---

## Security Concerns

### 1. JWT Tokens in `localStorage`

`ApiService` stores the full login DTO (including tokens) in `localStorage`. This is vulnerable to XSS attacks — any injected script can read `localStorage.getItem('login')` and steal the JWT.

**Recommendation:** Use `httpOnly` cookies for token storage, or at minimum use `sessionStorage` and implement a Content Security Policy.

### 2. Password Fields in `LoginDTO`

The `LoginDTO` class contains `Password` and `NewPassword` fields alongside token data. The entire DTO is serialized to `localStorage`, meaning passwords could be persisted in cleartext if the DTO is not carefully sanitized before storage.

### 3. No CSRF Protection

The API calls use bearer tokens but there's no CSRF token handling. If the backend relies on cookies for any auth flow, this is a vulnerability.

### 4. External Script Without SRI

`index.html` loads Font Awesome from a CDN without Subresource Integrity (SRI):
```html
<script src="https://kit.fontawesome.com/60672631ba.js" crossorigin="anonymous"></script>
```
If the CDN is compromised, arbitrary JavaScript executes in the app context.

### 5. No HTTP Interceptor for Auth

Auth headers are manually added per-request in `ApiService`. There's no `HttpInterceptor` to:
- Automatically attach tokens
- Handle 401 responses globally
- Queue requests during token refresh (race condition exists in current code)

---

## Performance Issues

### 1. No Lazy Loading

All 23 routes eagerly load their components. The initial bundle includes the entire application. Routes like `/tests/*`, `/api-tests`, and auth routes (`/register`, `/change-password`, etc.) should be lazy-loaded.

**Estimated impact:** Splitting into ~5 lazy chunks could reduce initial bundle size by 40-60%.

### 2. No `trackBy` on `*ngFor` Loops

None of the `*ngFor` directives use `trackBy`. Lists of models, tests, files, uploads, and elements are re-rendered entirely on every change detection cycle.

Affected templates: `animations`, `primitives`, `sketches`, `design-tests`, `view-tests`, `surface-tests`, `file-list`, `upload-list`, `model-designer` elements list, `fill-modal` colors.

### 3. No `OnPush` Change Detection

No component uses `ChangeDetectionStrategy.OnPush`. For a graphics-heavy application with frequent timer ticks and mouse events, this causes excessive change detection cycles.

### 4. Massive Service Files

| Service | Approx. Lines |
|---|---|
| `design-test.service.ts` | ~3,500 |
| `view-test.service.ts` | ~2,300 |
| `surface-test.service.ts` | ~1,600 |

These files contain dozens of hardcoded test configurations. They should be split into individual test definition files or loaded from JSON assets.

### 5. No Debouncing on Validation Calls

`RegisterComponent` calls `checkNameInUse()` and `checkEmailInUse()` on every keystroke. There's no `debounceTime()` or `distinctUntilChanged()`, leading to excessive API calls.

---

## Code Quality Issues

### 1. Duplicate Code in Upload Handling

`UploadService.queue()`, `immediate()`, and `beginNext()` contain duplicated upload initialization logic. The `onUploadProgress` binding is duplicated in the constructor.

### 2. Duplicate Code Across Container Components

`ContainerExplorerComponent`, `ModelDesignerComponent`, and `ModelPlaygroundComponent` all contain nearly identical code for:
- File upload handling with `QueryList<ElementRef>`
- Container manifest loading
- Signed URL requests
- Upload queue management

This should be extracted into a shared service or base class.

### 3. `ApiService` Code Duplication

Token update logic is duplicated across `authenticate()`, `checkToken()`, and `refreshToken()`. The `refreshingToken` flag prevents concurrent refresh but doesn't queue pending requests, leading to potential dropped requests.

### 4. Inconsistent Error Handling

- Some API methods have `error:` callbacks, others don't
- Error events are emitted inconsistently
- No global error handler
- `ModelService` HTTP calls have no error handling at all

### 5. Unused `@Output()` in Header

`HeaderComponent` declares `@Output() public selectedFolderPath?: string` but never emits it.

### 6. `EliseModule` Redundancy

The `EliseModule` `@NgModule` wraps three standalone components. It serves no purpose and adds an unnecessary abstraction layer.

---

## Testing Gap

**Zero unit tests exist in the project.** The test infrastructure is fully configured (Karma, Jasmine, `tsconfig.spec.json`, `test.ts`) but no `.spec.ts` files have been written.

### Priority Test Targets

1. **`ApiService`** — Authentication flow, token refresh, error handling
2. **`UploadService`** — Queue management, concurrent upload limits, state transitions
3. **`AlertService`** — Alert emission and clearing
4. **`LoginComponent`** — Form validation, auth flow
5. **`RegisterComponent`** — Validation, name/email availability checks
6. **`ContainerExplorerComponent`** — File operations, manifest loading
7. **Modal components** — Input/output contracts

### Test Infrastructure Modernization

The current test setup uses Karma 6.4 with `karma-coverage-istanbul-reporter`. Consider:
- Migrating to **Jest** (faster, better DX, no browser needed for unit tests)
- Or at minimum upgrading to `karma-coverage` (istanbul-reporter is deprecated)
- Adding **Cypress** or **Playwright** for E2E tests

---

## Suggestions for Improvement

### High Priority

1. **Implement a `DestroyRef`-based cleanup pattern** — Angular 16+ provides `DestroyRef` and `takeUntilDestroyed()` which eliminates manual `ngOnDestroy` boilerplate:
   ```typescript
   private destroyRef = inject(DestroyRef);
   
   ngOnInit() {
     this.apiService.loginEvent
       .pipe(takeUntilDestroyed(this.destroyRef))
       .subscribe(login => { ... });
   }
   ```

2. **Add route guards** — Create a functional `authGuard` for protected routes:
   ```typescript
   export const authGuard: CanActivateFn = () => {
     return inject(ApiService).isLoggedIn();
   };
   ```

3. **Add a wildcard route** with a `NotFoundComponent`:
   ```typescript
   { path: '**', component: NotFoundComponent }
   ```

4. **Convert `FooterComponent` and `ProgressComponent` to standalone**

5. **Remove `EliseModule`** and import standalone components directly

6. **Add an HTTP interceptor** for auth token management:
   ```typescript
   export const authInterceptor: HttpInterceptorFn = (req, next) => {
     const apiService = inject(ApiService);
     const token = apiService.getToken();
     if (token) {
       req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
     }
     return next(req);
   };
   ```

7. **Replace `EventEmitter` in services** with `Subject`/`BehaviorSubject`

### Medium Priority

8. **Implement lazy loading** for route groups:
   ```typescript
   { path: 'tests', loadChildren: () => import('./routes/test.routes') },
   { path: 'login', loadComponent: () => import('./components/login/login.component') },
   ```

9. **Migrate to new control flow syntax** (`@if`, `@for`, `@switch`) — Angular provides an automatic schematic:
   ```bash
   ng generate @angular/core:control-flow
   ```

10. **Extract shared container/upload logic** into a reusable service or mixin

11. **Add `trackBy` functions** to all `*ngFor` / `@for` loops

12. **Adopt `OnPush` change detection** progressively, starting with leaf components

13. **Add debouncing** to validation in `RegisterComponent`:
    ```typescript
    this.nameControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(name => this.apiService.checkNameInUse(name))
    ).subscribe(...)
    ```

14. **Split giant test services** into modular test definition files

15. **Add SRI hash** to the Font Awesome CDN script tag

### Low Priority

16. **Remove empty `ngOnInit()` methods** and `OnInit` implements
17. **Remove empty SCSS files** or consolidate styles
18. **Update `module` in tsconfig** from `es2020` to `es2022`
19. **Set `useDefineForClassFields: true`** (or remove the flag)
20. **Add `strict: true`** to tsconfig for better type safety
21. **Remove unused `@Output` in `HeaderComponent`**

---

## Feature Suggestions

### 1. Global Error Handling

Add an Angular `ErrorHandler` implementation and/or an HTTP interceptor that catches errors globally, logs them, and shows user-friendly messages via the existing `AlertService`.

### 2. Loading State Management

Create a `LoadingService` that components can use to show/hide spinners. Currently each component manages its own `processing`/`isBusy` flags independently.

### 3. Undo/Redo in Model Designer

The `ModelDesignerComponent` handles element creation, deletion, and manipulation but has no undo/redo capability. Implementing a command pattern with a history stack would significantly improve the designer UX.

### 4. Keyboard Shortcuts

The model designer and playground could benefit from keyboard shortcuts (Ctrl+Z undo, Ctrl+S save, Delete to remove selected elements, arrow keys to nudge).

### 5. Offline Support / PWA

Add a service worker for offline model viewing. The app already loads models from a CDN-like service; caching loaded models would improve the experience.

### 6. Dark Mode

The app uses Bootstrap 5, which has built-in dark mode support via `data-bs-theme="dark"`. A theme toggle in the header would be straightforward.

### 7. Export Capabilities

Add model export to SVG, PNG, or PDF formats. The `elise-graphics` library renders to canvas; canvas-to-image export would be a natural addition.

### 8. Collaborative Editing

For the model designer, consider WebSocket-based real-time collaboration using the existing signed URL infrastructure.

### 9. Model Versioning

Track model versions in the container storage. Show version history, allow rollback, and support branching.

### 10. Accessibility (a11y) Improvements

- Add `aria-label` to all icon-only buttons and links
- Add `aria-busy` states during async operations
- Ensure keyboard navigation works in the model designer
- Add skip-to-content links
- Test with screen readers

---

## Summary Statistics

| Category | Count |
|---|---|
| Critical issues | 5 |
| Security concerns | 5 |
| Performance issues | 5 |
| Inconsistencies | 7 |
| Code quality issues | 6 |
| High-priority improvements | 7 |
| Medium-priority improvements | 8 |
| Low-priority improvements | 6 |
| Feature suggestions | 10 |
| Components with memory leaks | 8+ |
| Unit tests | 0 |
| `.subscribe()` calls needing cleanup | ~85 |
