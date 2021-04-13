/* eslint-disable no-prototype-builtins */
import { CWFormControl, FormControlComposite } from '../controls';
import { FormBuilderConfig, FormBuilderConfigItem, FormBuilderConfigItemComposite, FormBuilderOptions, IFormControl } from '../models';

import { FormBuilderControlsFactory } from './form-builder-controls-factory';

export class FormBuilderService {
  constructor(private factory: FormBuilderControlsFactory) {}

  // private dataSources;
  build(config: FormBuilderConfig, options?: FormBuilderOptions): CWFormControl {
    const hmxForm = new CWFormControl({
      id: 'cwForm',
      label: '',
      name: 'cwForm',
      description: '',
      metadata: {},
      events: {},
      attributes: {},
      rules: [],
    });
    hmxForm.init();

    // this.dataSources = config.data_sources;
    config.form.children.forEach((configItem) => {
      if (this.factory.isKnownControlType(configItem.type)) {
        const ctrl = this.buildFormControl(configItem, options) as any;
        // if (options && options.formControlsBuilder) {
        //   ctrl = options.formControlsBuilder(configItem, ctrl);
        // }
        hmxForm.add(ctrl);
      } else {
        // eslint-disable-next-line
        console.warn('Found unknown control type - ' + configItem.type);
      }
    });
    // if (options && options.formControlBuilder) {
    //   hmxForm = options.formControlBuilder(config, hmxForm);
    // }
    return hmxForm;
  }

  private buildFormControl(config: FormBuilderConfigItemComposite | FormBuilderConfigItem, options?: FormBuilderOptions): IFormControl {
    // const formControl: any =
    //   options && options.formControlFactory
    //     ? options.formControlFactory(config)
    //     : FormControlsFactory.getInstance().create(config, container);

    const formControl = this.factory.create(config);
    if (this.isCompositeControl(config)) {
      const childrenControls = (config as FormBuilderConfigItemComposite).children;
      (childrenControls || []).forEach((childConfig) => {
        if (this.factory.isKnownControlType(childConfig.type)) {
          const childControl: any = this.buildFormControl(childConfig, options);
          (formControl as FormControlComposite).add(childControl);
        } else {
          // eslint-disable-next-line
          console.warn('Found unknown control type - ' + childConfig.type);
        }
      });
    }
    // if (formControl.getControlType() === ControlType.DataSourceFormControl) {
    //   (formControl as IDataSourceFormControl).setDataSource(this.dataSources);
    // }
    return formControl as any;
  }

  private isCompositeControl(formControl: FormBuilderConfigItemComposite | FormBuilderConfigItem): boolean {
    return formControl.hasOwnProperty('children');
  }
}
