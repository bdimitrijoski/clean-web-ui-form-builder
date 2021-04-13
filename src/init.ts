import { CWFormBuilder } from './lib/form-builder';

export function initFormBuilder(): void {
  customElements.define('cw-form-builder', CWFormBuilder as any);
}
