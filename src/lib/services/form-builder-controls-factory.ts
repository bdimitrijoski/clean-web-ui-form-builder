/* eslint-disable no-prototype-builtins */
import { CWFormControl, FormControlParams } from '../controls';
import { formBuilderControlDecorator } from '../decorators/form-builder-control-decorator';
import { ControlsMap, FormBuilderConfigItem, IFormControl } from '../models';

import { EventDispatcherService } from './event-dispatcher-service';
import { FormBuilderValueService } from './form-builder-value.service';

export const CONTROLS_MAP = {
  FORM: CWFormControl,
};
export class FormBuilderControlsFactory {
  private controlsMap: ControlsMap = Object.assign({}, CONTROLS_MAP) as any;
  constructor(private eventDispatcher: EventDispatcherService, private valueService: FormBuilderValueService) {}

  registerControls(ctrls: ControlsMap): void {
    this.controlsMap = Object.assign(this.controlsMap, CONTROLS_MAP, ctrls);
  }

  create(config: FormBuilderConfigItem): IFormControl {
    const ctrl = formBuilderControlDecorator(
      new (this.controlsMap as any)[config.type]({
        id: config.property,
        name: config.property,
        label: config.label,
        description: '',
        attributes: config.attributes,
        metadata: config.metadata,
        events: config.events,
        rules: config.rules || [],
      } as FormControlParams),
      this.eventDispatcher,
      this.valueService,
    );

    ctrl.init();
    return ctrl;
  }

  isKnownControlType(controlType: string): boolean {
    return this.controlsMap.hasOwnProperty(controlType);
  }
}
