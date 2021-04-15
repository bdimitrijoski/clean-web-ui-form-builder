import { ControlType, FormBuilderAttributeRule, FormBuilderFormControlEvents, FormBuilderRuleType, IFormControl } from '../models';
import { EventDispatcherService, FormBuilderValueService } from '../services';

/* eslint-disable */
export const formBuilderControlDecorator = (
  ctrl: IFormControl,
  eventDispatcher: EventDispatcherService,
  valueService: FormBuilderValueService,
  pgOptions?: unknown,
): IFormControl => {
  let onControlStateChangedListener;

  const proxyMethod = (method, callback) => {
    return new Proxy(method, {
      apply: (target, that, args) => {
        callback(target, that, args);
        return target.apply(that, args);
      },
    });
  };

  const hasRule = (ruleType, rules: FormBuilderAttributeRule[]): boolean => {
    return rules.findIndex((rule) => rule.rule_type === ruleType) !== -1;
  };

  const executeRule = (rule: FormBuilderAttributeRule, control: IFormControl, data?: any): void => {
    if (!control.getNativeElement()) {
      return;
    }

    const ctx = Object.assign(valueService.getContext(), {
      form: valueService.getState(),
    });

    const predicateVal = rule.rule_value(ctx);

    if (predicateVal && rule.rule_type === FormBuilderRuleType.VALUE_CHANGED && valueService.isFormReady) {
      if (data) {
        ctx.newValue = data;
        ctx.valueService = valueService;
      }
      rule.rule_command(ctx);
    } else if (rule.rule_type !== FormBuilderRuleType.VALUE_CHANGED) {
      rule.rule_command(control, predicateVal, ctx);
    }
  };

  const executeRuleByType = (ruleType: string, rules: FormBuilderAttributeRule[], control: IFormControl, data?: any): void => {
    const rule = rules.find((rule) => rule.rule_type === ruleType);
    executeRule(rule, control, data);
  };

  if (typeof ctrl.attachEventListeners === 'function') {
    ctrl.attachEventListeners = proxyMethod(ctrl.attachEventListeners, (target, ctrl, args) => {
      onControlStateChangedListener = eventDispatcher.register('onFormControlStateChanged', (event) => {
        if (event.name === ctrl.getName()) {
          return;
        }

        const rules = ctrl.getRules();
        for (const ruleName in rules) {
          if (!rules[ruleName]) {
            continue;
          }
          const rule = rules[ruleName];
          if (rule.rule_type === FormBuilderRuleType.VALUE_CHANGED) {
            continue;
          }

          executeRule(rule, ctrl);
        }
      });
    });
  }

  if (typeof ctrl.removeEventListeners === 'function') {
    ctrl.removeEventListeners = proxyMethod(ctrl.removeEventListeners, (target, ctrl, args) => {
      if (!ctrl.getNativeElement()) {
        return;
      }

      if (onControlStateChangedListener) {
        onControlStateChangedListener.unsubscribe();
      }
    });
  }

  if (typeof ctrl.onValueChange === 'function') {
    ctrl.onValueChange = proxyMethod(ctrl.onValueChange, (target, that, args) => {
      // if (pgOptions.onValueChange) {
      //   const event = args[0];
      //   const result = pgOptions.onValueChange(event);
      //   if (result === false || event.defaultPrevented) {
      //     return false;
      //   }
      // }
      // return target.apply(that, args);
    });
  }

  if (typeof ctrl.setValue === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ctrl.setValue = proxyMethod(ctrl.setValue, (target, ctrl, args) => {
      const name = ctrl.getName();
      const newValue = args[0];

      if (!valueService.isFormReady) {
        return;
      }

      if (newValue === ctrl.getValue()) {
        return;
      }

      if (ctrl.getControlType() !== ControlType.FORM_CONTROL && ctrl.getControlType() !== ControlType.CUSTOM_CONTROL) {
        return;
      }

      valueService.setValue(name, newValue);

      if (hasRule(FormBuilderRuleType.VALUE_CHANGED, ctrl.getRules())) {
        executeRuleByType(FormBuilderRuleType.VALUE_CHANGED, ctrl.getRules(), ctrl, newValue);
      }
      if (hasRule(FormBuilderRuleType.VALIDATION, ctrl.getRules())) {
        executeRuleByType(FormBuilderRuleType.VALIDATION, ctrl.getRules(), ctrl);
      }

      const data = {
        name: name,
        value: newValue,
      };
      eventDispatcher.send(FormBuilderFormControlEvents.onValueChanged, data);

      eventDispatcher.send(FormBuilderFormControlEvents.onFormControlStateChanged, data);
    });
  }

  return ctrl;
};
