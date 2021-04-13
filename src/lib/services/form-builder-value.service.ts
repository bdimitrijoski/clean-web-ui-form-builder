import { KeyValueMap } from '../models';
/* eslint-disable */
/* eslint-disable no-prototype-builtins */
export class FormBuilderValueService {
  private state = {};
  private context = {};
  private dataSources = [];
  isFormReady = false;

  constructor() {
    this.state = {};
  }

  // eslint-disable-next-line
  setContext(ctx): void {
    this.context = ctx;
  }

  getContext(): KeyValueMap {
    return this.context;
  }

  clearContext(): void {
    this.context = {};
  }

  // eslint-disable-next-line
  setDataSources(dataSources): void {
    this.dataSources = dataSources;
  }

  getDataSources(): any[] {
    return this.dataSources;
  }

  clearDataSources(): void {
    this.dataSources = [];
  }

  setState(state): void {
    this.state = Object.assign(this.state, state);
  }

  getState(): any {
    return this.state;
  }

  getValue(property): any {
    if (!property || !this.state.hasOwnProperty(property)) {
      throw Error(`Property named ${property} does not exist!`);
    }

    return this.state[property];
  }

  setValue(property, newValue): void {
    if (!property || !this.state.hasOwnProperty(property)) {
      console.warn(`Property named ${property} does not exist!`);
      return;
    }

    if (this.state[property] != newValue) {
      this.state[property] = newValue;
    }
  }

  clearState(): void {
    this.state = {};
  }
}
