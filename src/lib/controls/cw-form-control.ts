/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ControlType } from '../models';

import { FormControlComposite } from './form-control-composite';

/**
 * The fieldset element is a Concrete Composite.
 */
export class CWFormControl extends FormControlComposite {
  getControlType(): ControlType {
    return ControlType.FORM;
  }
  attachEventListeners(): void {
    // nothing to do for now
  }
  removeEventListeners(): void {
    // nothing to do for now
  }
  getNativeElementType(): string {
    return 'form';
  }
  render(): HTMLFormElement {
    const el: any = document.createElement('form');
    this.nativeElement = el;
    // this.assignAttributes();
    el.appendChild(super.render());

    return el;
  }
}
