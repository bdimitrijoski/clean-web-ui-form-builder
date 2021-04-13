/* eslint-disable no-prototype-builtins */
import { ControlType, ControlsMap, DataObject, IFormControl } from '../models';

import { FormControl } from './form-control';

export abstract class FormControlComposite extends FormControl {
  protected controls: ControlsMap = {};

  add(field: IFormControl): void {
    const name = field.getName();
    this.controls[name] = field;
  }

  remove(component: IFormControl): void {
    delete this.controls[component.getName()];
  }

  setValue(data: DataObject, controlName?: string): void {
    const setDataCallback = (control: IFormControl) => {
      let val = data.hasOwnProperty(control.getName()) ? data[control.getName()] : data;

      if (!data.hasOwnProperty(control.getName()) && control.getControlType() === ControlType.FORM_CONTROL) {
        val = null;
      }

      if (controlName) {
        if (control.getControlType() === ControlType.FORM_CONTROL && control.getName() === controlName) {
          control.setValue(val);
        } else if (control.getControlType() === ControlType.FORM_CONTROL_COMPOSITE) {
          control.setValue(val);
        }
      } else {
        control.setValue(val);
      }
    };
    this.iterateControls(setDataCallback);
  }

  getValue(): any {
    const data = {};
    const getDataCallback = (control: IFormControl) => {
      data[control.getName()] = control.getValue();
    };
    this.iterateControls(getDataCallback);

    return data;
  }

  render(): any {
    const output = document.createDocumentFragment();
    const renderCallback = (control: IFormControl) => output.appendChild(control.render());
    this.iterateControls(renderCallback);
    return output;
  }

  destroy(): void {
    const destroyCallback = (control: IFormControl) => control.destroy();
    this.iterateControls(destroyCallback);

    this.controls = {};
    super.destroy();
  }

  // setControlAttribute(
  //   controlId: string,
  //   attributeName: string,
  //   value: any
  // ): void {
  //   this.control.setControlAttribute(controlId, attributeName, value);
  // }

  protected iterateControls(callback: (control: IFormControl) => void): void {
    Object.keys(this.controls).forEach((controlName) => {
      callback(this.controls[controlName]);
    });
  }
}
