# Elise NG Safe Upgrade Path (Angular 9 -> Angular 21)

## Goal

Move from Angular 9.1.x to an Angular version compatible with Node 24, with minimal outage risk.

- Node 24 compatible targets: Angular 20.x and 21.x.
- Recommended first production target: Angular 20 latest.
- Recommended final target after stabilization: Angular 21 latest.

## Current State Summary

- Angular core/cli: 9.1.x
- Build system: legacy Angular CLI builder
- Linting: TSLint + Codelyzer (deprecated)
- E2E: Protractor (deprecated)
- Browser legacy config: custom es5 serve/build config present
- External Angular-heavy deps: ng-bootstrap, angular-split, angular-tree-component, ngx-color-picker, ngx-toastr
- Local package dependency: elise-graphics from ../elise-npm

## Strategy (Safety First)

Do not jump from 9 directly to 20/21. Upgrade one major at a time and require a green checkpoint after each major.

Per-major checkpoint gates:

1. Install and compile succeed.
2. ng serve starts.
3. Production build succeeds.
4. Unit tests pass (or known failures documented).
5. Manual smoke test of critical flows.
6. Commit and tag before next major.

## Environment Plan by Phase

Use a Node version manager (nvm/fnm/volta) and pin node per phase.

- Phase A (9 -> 11): Node 12
- Phase B (11 -> 13): Node 14 then 16
- Phase C (13 -> 15): Node 16 then 18
- Phase D (15 -> 17): Node 18
- Phase E (17 -> 19): Node 20
- Phase F (19 -> 21): Node 20/22 first, then Node 24 validation

Do not switch to Node 24 until Angular 20+ is reached.

## Execution Template (repeat per major)

Run from elise-ng folder:

1. Clean baseline

- npm ci
- npm run build
- npm run test

1. Update Angular framework + CLI to next major

- npx -p @angular/cli@<next-major> ng update @angular/core@<next-major> @angular/cli@<next-major>

1. Update ecosystem packages and fix migrations

- npm install
- npm audit fix (optional, review changes)
- Address migration notes in angular.json, tsconfig, polyfills, test setup.

1. Validate

- npm run build
- npm run test
- npm run start (or equivalent serve command)

1. Commit and tag

- git add -A
- git commit -m "upgrade: angular <next-major>"
- git tag angular-<next-major>-green

## Recommended Major Sequence

1. 9 -> 10
2. 10 -> 11
3. 11 -> 12
4. 12 -> 13
5. 13 -> 14
6. 14 -> 15
7. 15 -> 16
8. 16 -> 17
9. 17 -> 18
10. 18 -> 19
11. 19 -> 20
12. 20 -> 21 (optional final)

## Progress Checkpoints

### 2026-03-14: Completed 10 -> 11

- Framework upgraded to Angular 11.2.x and CLI 11.2.x.
- Core migrations applied by `ng update`:
  - `angular.json` deprecated options cleanup
  - Router migration added explicit `relativeLinkResolution: 'legacy'`
- Ecosystem alignment:
  - `@ng-bootstrap/ng-bootstrap` upgraded to `^9.1.3` for Angular 11 compatibility.

Validation status:

- Build on Node 24 fails without OpenSSL legacy provider (`ERR_OSSL_EVP_UNSUPPORTED`) due to older webpack toolchain.
- Build succeeds with temporary env var:
  - PowerShell: `$env:NODE_OPTIONS='--openssl-legacy-provider'; npm run build`

Next action before 11 -> 12:

- Use Node 14 (recommended) for this phase to avoid OpenSSL compatibility workarounds.

### 2026-03-15: Completed 11 -> 12

- Framework upgraded to Angular 12.2.x and CLI 12.2.x.
- TypeScript upgraded to 4.3.5.
- Core migrations applied by `ng update`:
  - `angular.json` deprecated options removed
  - `zone.js` updated to 0.11.x with polyfills/test imports updated
  - `emitDecoratorMetadata` removed from tsconfig
  - `--prod` replaced in package.json scripts
- Ecosystem alignment:
  - `@ng-bootstrap/ng-bootstrap` upgraded to `^10.0.0` for Angular 12 compatibility.
  - `angular-tree-component` replaced with `@circlon/angular-tree-component` (Ivy compatible).
  - Import paths and CSS import updated for tree component rename.
  - `TreeModule.forRoot()` changed to `TreeModule` (forRoot removed in @circlon).
  - `jasmine-core` bumped to `~3.8.0`.
  - `ngx-color-picker` bumped to `^11.0.0`.
  - `ColorLike` casts added for `toHexString()`/`equalsHue()` calls in fill-modal, stroke-modal, model-designer.
  - `elise-npm` `.d.ts` inline type imports split for TypeScript 4.3 compatibility.

Validation status:

- Build succeeds with `NODE_OPTIONS=--openssl-legacy-provider` on Node 24.

### 2026-03-15: Completed 12 -> 13

- Clean migration, build passed immediately.

### 2026-03-15: Completed 13 -> 14

- `@ng-bootstrap/ng-bootstrap` bumped to `^12.1.2`.
- Added `@popperjs/core` (peer dep for ng-bootstrap 12.x).

### 2026-03-15: Completed 14 -> 15

- Fixed SCSS `~` prefix deprecation (removed `~` from all imports).
- `@ng-bootstrap/ng-bootstrap` bumped to `^13.1.1`.
- `ngx-toastr` bumped to `^16.0.0`.
- `relativeLinkResolution` removed by Angular 15 migration.

### 2026-03-15: Completed 15 -> 16

- `@circlon/angular-tree-component` replaced with `@ali-hm/angular-tree-component`.
- Import paths and CSS import updated for tree component rename.
- `@ng-bootstrap/ng-bootstrap` bumped to `^14.2.0`.
- `angular-split` bumped to `^16.2.1`; `AngularSplitModule.forRoot()` changed to `AngularSplitModule`.
- `ngx-color-picker` bumped to `^14.0.0`.

### 2026-03-15: Completed 16 -> 17

- `@ng-bootstrap/ng-bootstrap` bumped to `^16.0.0`.
- Build passes WITHOUT `--openssl-legacy-provider` (webpack 5/esbuild in Angular 17+).

### 2026-03-15: Completed 17 -> 18

- Migration auto-converted to esbuild `application` builder.
- `@ali-hm/angular-tree-component` bumped to `^18.0.5`.
- `@ng-bootstrap/ng-bootstrap` bumped to `^17.0.1`.
- `ngx-color-picker` bumped to `^16.0.0`.
- `ngx-toastr` bumped to `^19.0.0`.

### 2026-03-15: Completed 18 -> 19

- Angular 19 made standalone default. All 55 components/directives needed `standalone: false` added to their decorators.
- Declarations array in `app.module.ts` preserved with `standalone: false` on all components.

### 2026-03-15: Completed 19 -> 20

- Angular 20 no longer allows `standalone: false` components in NgModule `declarations`.
- **Standalone migration**: Removed `standalone: false` from all components; added `imports` arrays to each component with their required modules (CommonModule, FormsModule, RouterModule, NgbModule, etc.).
- Moved all components from `declarations` to `imports` in `app.module.ts`.
- `EliseModule` updated: moved component declarations to imports.
- `rxjs` upgraded from `^6.6.7` to `^7.8.0` (required by angular-split 19 and Angular 20).
- `observer.next()` calls in `api.service.ts` updated to `observer.next(undefined)` for rxjs 7 compatibility.
- Ecosystem alignment:
  - `@ng-bootstrap/ng-bootstrap` bumped to `^20.0.0`.
  - `@ali-hm/angular-tree-component` bumped to `^20.3.4`.
  - `angular-split` bumped to `^19.0.0`.
  - `ngx-color-picker` bumped to `^20.1.1`; `ColorPickerModule` replaced with `ColorPickerDirective` (module removed in v20).
  - `ngx-toastr` bumped to `^20.0.5`.
- `elise-npm` `.d.ts` inline type imports re-patched (overwritten by npm install).

Validation status:

- Build succeeds on Node 24 without any workarounds.

## Known Risk Areas and Mitigations

1. TSLint/Codelyzer deprecation

- Risk: Tooling breaks in newer Angular/CLI.
- Mitigation: Migrate to ESLint no later than Angular 12/13.

1. Protractor deprecation

- Risk: E2E pipeline becomes brittle/unmaintained.
- Mitigation: Migrate to Playwright or Cypress around Angular 14-16.

1. ES5 configuration removal

- Risk: Custom es5 target in angular.json/tsconfig-es5 may fail in later majors.
- Mitigation: Remove es5 config once IE11 support is dropped in your support policy.

1. Third-party component libraries

- Risk: Dependency version caps block framework upgrades.
- Mitigation: Upgrade libraries at each major and keep a compatibility sheet.

1. Local dependency (elise-graphics)

- Risk: Build/runtime issues across TypeScript and bundler changes.
- Mitigation: Validate elise-graphics build compatibility at every checkpoint before moving on.

## Suggested Dependency Workstreams

Track these in parallel with the major upgrades:

1. Linting modernization

- Replace TSLint/Codelyzer with angular-eslint.

1. Test modernization

- Keep Karma initially, defer large test-runner migration until framework is stable on Angular 16+.

1. E2E modernization

- Replace Protractor with Playwright/Cypress before final Angular 20/21 rollout.

1. Styling framework review

- ng-bootstrap and bootstrap versions may require coordinated upgrades and template/CSS adjustments.

## Rollback Plan

If any major fails and cannot be resolved quickly:

1. Stop at that major.
2. Revert to previous green tag.
3. Create a focused spike branch for blocker investigation.
4. Resume mainline upgrades only after blocker is resolved.

## Practical Destination Recommendation

- Short term stable destination: Angular 20 on Node 20/22.
- Final Node 24 destination: Angular 21 with full validation on Node 24.

This approach minimizes migration blast radius while getting to a Node 24-compatible stack.
