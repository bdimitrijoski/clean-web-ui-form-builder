import { CWFormControl } from './controls';
import { formBuilderStyles } from './form-builder-styles';
import { formBuilderTemplate } from './form-builder-template';
import { FormBuilderConfig, FormBuilderFormControlEvents, FormBuilderOptions, KeyValueMap } from './models';
import { FormBuilderValueService } from './services';
import { ConfigParserService } from './services/config-parser.service';
import { EventDispatcherService } from './services/event-dispatcher-service';
import { FormBuilderControlsFactory } from './services/form-builder-controls-factory';
import { FormBuilderService } from './services/form-builder.service';

import { Logger } from './utils/logger';

/* eslint-disable */
export class CWFormBuilder extends HTMLElement {
  private _defaultOptions: FormBuilderOptions = {
    controls: {},
  };
  private _options: FormBuilderOptions;
  private _config: FormBuilderConfig;
  private _root;
  private _formBuilderEl: HTMLDivElement;
  private _isReady = false;
  private _data;
  private _context: KeyValueMap;
  private readonly _selectedGridItem;
  private configParserService: ConfigParserService;
  private eventDispatcher: EventDispatcherService;
  private formBuilderService: FormBuilderService;
  private valueService: FormBuilderValueService;
  private factory: FormBuilderControlsFactory;

  private formBuilderForm: CWFormControl;
  private eventListeners = {};

  static factory(config: FormBuilderConfig, data, options = {}, context = {}): CWFormBuilder {
    const builder = new CWFormBuilder();
    builder.config = config;
    builder.options = options;
    builder.context = context;
    builder.data = data;

    return builder;
  }

  constructor() {
    super();

    // Create a new shadow dom root.
    // The mode describes, if the node can be accessed from the outside.
    this._root = this;

    if (this.options && this.options.useShadowDom) {
      this.attachShadow({ mode: 'open' });
      this._root = this.shadowRoot;
    }

    // Fill the shadow dom with the template by a deep clone.
    this._root.appendChild(formBuilderStyles.content.cloneNode(true));
    this._root.appendChild(formBuilderTemplate.content.cloneNode(true));

    this._options = this._defaultOptions;

    this._formBuilderEl = this._root.querySelector('#formBuilder');
    this.configParserService = new ConfigParserService();
    this.eventDispatcher = new EventDispatcherService();
    this.valueService = new FormBuilderValueService();
    this.factory = new FormBuilderControlsFactory(this.eventDispatcher, this.valueService);

    this.formBuilderService = new FormBuilderService(this.factory);

    this.onFormControlValueChange = this.onFormControlValueChange.bind(this);
    this.onFormControlStateChanged = this.onFormControlStateChanged.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);

    this.attachEventListeners();
  }

  set config(opts: FormBuilderConfig) {
    this._config = Object.assign({}, opts);
  }

  get config(): FormBuilderConfig {
    return this._config;
  }

  set context(ctx: KeyValueMap) {
    this._context = Object.assign({}, ctx);
    this.valueService.setContext(this._context);
  }

  get context(): KeyValueMap {
    return this._context;
  }

  set options(opts: FormBuilderOptions) {
    this._options = Object.assign(this._defaultOptions, opts);

    this._options = opts;
  }

  get options(): FormBuilderOptions {
    return this._options;
  }

  set data(obj) {
    if (typeof obj === 'string') {
      Logger.getInstance().error('FormBuilder got invalid option:', obj);
      return;
    } else if (typeof obj !== 'object' || obj === null) {
      Logger.getInstance().error('FormBuilder must get an object in order to initialize the grid.');
      return;
    }
    this._data = obj;

    if (!this._config) {
      Logger.getInstance().error('Can not render form without config, please set config first!');
      return;
    }

    this.valueService.setState(this._data);

    if (this._isReady) {
      this.destroy();
      this.attachEventListeners();
    }

    this.render();
  }

  get data(): any {
    return this._data;
  }

  get selectedGridItem(): any {
    return this._selectedGridItem;
  }

  connectedCallback(): void {
    Logger.getInstance().log('Form builder initialized');
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  /**
   * Forces the control to invalidate its client area and immediately redraw itself and any child controls.
   */
  render(): void {
    if (this._options && this._options.controls) {
      this.factory.registerControls(this._options.controls);
    }

    this.valueService.setDataSources(this._config.data_sources);
    this.formBuilderForm = this.formBuilderService.build(this._config, this._options);
    this._formBuilderEl.innerHTML = '';
    this._formBuilderEl.appendChild(this.formBuilderForm.render());

    this.formBuilderForm.setValue(this._data);
    if (!this._isReady) {
      this._isReady = true;
      this.valueService.isFormReady = true;
    }
  }

  refresh() {
    if (!this._isReady) {
      return;
    }
    this.formBuilderForm.setValue(this.valueService.getState());
  }

  getValues(): any {
    return this.valueService.getState();
  }

  setControlValue(controlName, value): void {
    this.valueService.isFormReady = false;
    this.formBuilderForm.setValue(value, controlName);
    this.valueService.isFormReady = true;
  }

  setControlAttribute(controlId, attributeName, value): void {
    //safe guard
    // attributeName = attributeName.replace('ctx.custom_functions.', '');
    // this.formBuilderForm.setControlAttribute(controlId, attributeName, value);
  }

  setDisabled(isDisabled: boolean): void {
    this._root.querySelectorAll('.form-control').forEach((ctrl) => {
      isDisabled ? ctrl.setAttribute('disabled', isDisabled) : ctrl.removeAttribute('disabled');
    });
  }

  setReadOnly(isDisabled: boolean): void {
    this._root.querySelectorAll('.form-control').forEach((ctrl) => {
      isDisabled ? ctrl.setAttribute('readonly', isDisabled) : ctrl.removeAttribute('readonly');
    });
  }

  setStyles(styles: string): void {
    const style = document.createElement('style');
    style.textContent = styles;
    this._root.append(style);
  }

  isValid(highlightInvalidValues = false): boolean {
    const hasInvalidClass = this._root.querySelectorAll('.form-control.invalid:not(.hidden):not([disabled]):not([readonly])').length > 0;
    const hasInvalidAttribute =
      this._root.querySelectorAll('.form-control[invalid]:not(.hidden):not([disabled]):not([readonly])').length > 0;
    const hasEmptyRequiredFields =
      this._root.querySelectorAll('.form-control[required]:not([has-value]):not(.hidden):not([disabled]):not([readonly])').length > 0;

    if (highlightInvalidValues) {
      this._root.querySelectorAll('.form-control').forEach((ctrl) => {
        if (typeof ctrl.validate !== 'undefined') {
          ctrl.validate();
        }
      });
    }

    return !(hasInvalidClass || hasInvalidAttribute || hasEmptyRequiredFields);
  }

  destroy(): void {
    for (const key in this.eventListeners) {
      this.eventListeners[key].unsubscribe();
    }
    this.eventDispatcher.reset();
    this.formBuilderForm.destroy();
  }

  private attachEventListeners() {
    this.eventListeners['onValueChanged'] = this.eventDispatcher.register(FormBuilderFormControlEvents.onValueChanged, this.onValueChanged);
    this.eventListeners['onFormControlStateChanged'] = this.eventDispatcher.register(
      FormBuilderFormControlEvents.onFormControlStateChanged,
      this.onFormControlStateChanged,
    );
  }

  private onValueChanged(data): void {
    if (!this._isReady) {
      return;
    }

    // Logger.getInstance().log(data);
    this.dispatchEvent(new CustomEvent('valueChanged', { detail: data }));
  }

  private onFormControlValueChange(e: any): void {
    // Logger.getInstance().log(e);
    // if (this.options.onFormControlValueChange) {
    //   this.options.onFormControlValueChange(e);
    // }
  }
  private onFormControlStateChanged(data): void {
    if (!this._isReady) {
      return;
    }
    // Logger.getInstance().log(data);

    // if (this.options.onFormControlStateChanged) {
    //   this.options.onFormControlStateChanged(e);
    // }
    this.dispatchEvent(new CustomEvent('stateChanged', { detail: data }));
    this.updateFormStyles();
  }

  private updateFormStyles(): void {
    setTimeout(() => {
      const formLayout = this._formBuilderEl.querySelector('cw-form-layout') as any;
      if (formLayout) {
        formLayout.updateStyles();
      }
    });
  }
}
