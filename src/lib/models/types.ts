/* eslint-disable @typescript-eslint/ban-types */

export interface KeyValueMap {
  [key: string]: string | boolean | number | Date | any;
}

export interface Attributes {
  [attributeName: string]: string | number | boolean;
}

export interface ControlMetadata {
  [name: string]: string | number | boolean | string[];
}

export interface ControlEvents {
  [eventName: string]: any;
}

export interface Options {
  [attributeName: string]: string | number | boolean | string[];
}

export interface SortCallback {
  (properties: string[]): string[];
}

export type PrimitiveValue = string | number | boolean;

export interface DataObject {
  [property: string]: string | number | Date | boolean | any;
}

export enum ControlType {
  FORM = 'FORM',
  FORM_CONTROL = 'FORM_CONTROL',
  FORM_CONTROL_COMPOSITE = 'FORM_CONTROL_COMPOSITE',
  HTML_CONTROL = 'HTML_CONTROL',
  CUSTOM_CONTROL = 'CUSTOM_CONTROL',
}

export interface FormBuilderAttributeRule {
  name: string;
  context: string;
  rule_type: string;
  rule_value: Function;
  rule_command?: Function;
}

export interface FormBuilderConfigItem {
  property: string;
  label: string;
  type: string;
  value: any;
  value_type?: string;
  attributes: KeyValueMap;
  metadata: KeyValueMap;
  events: KeyValueMap;
  rules: FormBuilderAttributeRule[];
}

export interface FormBuilderConfigItemComposite extends FormBuilderConfigItem {
  children: FormBuilderConfigItem[] | FormBuilderConfigItemComposite[];
}

export interface EventListnerHandler {
  unsubscribe: () => any;
}

export interface FormEvent<T> extends Event {
  bubbles: boolean;
  currentTarget: EventTarget & T;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  nativeEvent: Event;
  preventDefault(): void;
  isDefaultPrevented(): boolean;
  stopPropagation(): void;
  isPropagationStopped(): boolean;
  persist(): void;
  target: EventTarget & T;
  type: string;
}

export interface EventHandler<E extends FormEvent<any>> {
  (event: E): void;
}

export type FormEventHandler<T> = EventHandler<FormEvent<T>>;

export enum FormBuilderFormControlEvents {
  onValueChanged = 'onValueChanged',
  onFormControlStateChanged = 'onFormControlStateChanged',
}

export enum FormBuilderRuleType {
  VALUE_CHANGED = 'VALUE_CHANGED',
  VISIBLE = 'VISIBLE',
  EDITABLE = 'EDITABLE',
  VALIDATION = 'VALIDATION',
}
