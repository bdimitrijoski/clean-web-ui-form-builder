/* eslint-disable @typescript-eslint/ban-types */
import { Attributes, ControlMetadata, ControlType, FormBuilderAttributeRule, FormBuilderConfigItemComposite, FormEvent } from './types';

export interface FormBuilderConfig {
  form: FormBuilderConfigItemComposite;
  data_sources: any[];
  custom_functions: {
    [functionName: string]: Function;
  };
}

export interface IFormControl {
  /**
   * Method called from init to attach event listeners like click, change..etc.
   */
  attachEventListeners(): void;

  /**
   * A callback method that is called only once during init.
   * Return the DOM element of your component, this is what the property grid puts into the DOM.
   * Creates the native element based on props.
   */
  createNatveElement(): void;

  /**
   * A callback method that performs custom clean-up, invoked immediately
   * before a component instance is destroyed.
   */
  destroy(): void;

  /**
   * Returns Component Attributes
   */
  getAttributes(): Attributes;

  /**
   * Returns Component Id
   */
  getId(): string;

  /**
   * Returns component name
   */
  getName(): string;

  /**
   * Returns the Native Element
   */
  getNativeElement(): HTMLElement;

  /**
   * Returns Native Element type. For ex: input, select...etc.
   */
  getNativeElementType(): string;

  /** Returns Control type. Ex: FORM_CONTROL, FORM_CONTROL_COMPOSITE..etc. */
  getControlType(): ControlType;

  /**
   * Returns component label (title).
   */
  getLabel(): string;
  /**
   * Returns component label (title).
   */
  getDescription(): string;

  /**
   * Returns component options
   */
  getMedataData(): ControlMetadata;

  /**
   * Returns component options
   */
  getRules(): FormBuilderAttributeRule[];

  /**
   * Returns Component Value
   */
  getValue(): any;

  /**
   * A callback method that is invoked only once when the component is instantiated.
   */
  init(): void;

  /**
   * A callback method that is called before destory to remove all attached event listeners.
   */
  removeEventListeners(): void;

  /**
   * A callback function that is called when the native element should be rendered on UI.
   * Could be called multiple times to reflect component state.
   */
  render(): HTMLElement;

  /**
   * A callback function that is called to set the component value
   * @param value
   */
  setValue(value: any): void;

  /**
   * Optional on Value change event handler, that will be used by hooks and handlers.
   */
  onValueChange?: <T>(event: FormEvent<T>) => void;
}

export interface ControlsMap {
  [controlName: string]: IFormControl;
}

export interface FormBuilderOptions {
  /** Set custom controls that will be used for rendering */
  controls?: ControlsMap;
}
