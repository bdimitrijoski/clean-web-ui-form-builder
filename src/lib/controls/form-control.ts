import { Attributes, ControlEvents, ControlMetadata, ControlType, FormBuilderAttributeRule, IFormControl } from '../models';

export interface FormControlParams {
  id: string;
  name: string;
  label: string;
  description: string;
  attributes: Attributes;
  metadata: ControlMetadata;
  events: ControlEvents;
  rules: FormBuilderAttributeRule[];
}

/**
 * The base Component class declares an interface for all concrete components,
 * both simple and complex.
 *
 */
export abstract class FormControl implements IFormControl {
  protected id: string;
  protected name: string;
  protected label: string;
  protected description: string;
  protected value: any;
  protected attributes: Attributes;
  protected metadata: ControlMetadata;
  protected events: ControlEvents;
  protected rules: FormBuilderAttributeRule[];
  protected nativeElement: HTMLElement;

  constructor(params: FormControlParams) {
    Object.assign(this, params);
    this.metadata = params.metadata || {};
    this.attributes = params.attributes || {};
    this.events = params.events || {};
    this.rules = params.rules || [];
  }

  /** Returns Control type. Ex: FORM_CONTROL, FORM_CONTROL_COMPOSITE..etc. */
  abstract getControlType(): ControlType;

  /**
   * Use to attach event listeners like click, change...etc.
   * It is called inside createNativeElement
   */
  abstract attachEventListeners(): void;

  /**
   * A callback method that is called before destory to remove all attached event listeners.
   */
  abstract removeEventListeners(): void;

  /**
   * Each concrete DOM element must provide its rendering implementation, but
   * we can safely assume that all of them are returning strings.
   */
  abstract render(): HTMLElement;

  /** Returns native element type. Ex: input, select */
  abstract getNativeElementType(): string;

  /**
   * Initialize component, creates native element, attach event listners
   */
  init(): void {
    if (this.nativeElement) {
      return;
    }
    this.createNatveElement();
    this.attachEventListeners();
  }

  /**
   * Cleanup form control and removes all event listeners
   */
  destroy(): void {
    if (!this.getNativeElement()) {
      return;
    }

    this.removeEventListeners();
    this.nativeElement = null;
  }

  /**
   * Creates native element and attach event listeners
   */
  createNatveElement(): void {
    if (this.nativeElement) {
      return;
    }

    this.nativeElement = document.createElement(this.getNativeElementType());

    this.nativeElement.id = this.id;
  }

  getAttributes(): Attributes {
    return this.attributes;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getNativeElement(): HTMLElement {
    if (!this.nativeElement) {
      throw Error('You can not use native element before is being initialized!');
    }

    return this.nativeElement;
  }

  getLabel(): string {
    return this.label;
  }

  getMedataData(): ControlMetadata {
    return this.metadata;
  }

  getRules(): FormBuilderAttributeRule[] {
    return this.rules;
  }

  getValue(): any {
    return this.value;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setValue(value: any): void {
    this.value = value;
  }
}
