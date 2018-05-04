import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "ramda";
import {
  createFormInitialState,
  createEmptyInitialState,
  formEvtHandler
} from "./formUtil";

const hiForm = passedIn => WrapCmp => {
  let propFields = passedIn.fields;
  let { validate, initData, mapStateToFormData } = passedIn;

  @connect(mapStateToFormData)
  class Wrapper extends Component {
    constructor(props, context) {
      super(props, context);

      this.state = createEmptyInitialState(propFields, validate);
      let tempInitData = props.initData || {};
      if (mapStateToFormData) {
        tempInitData = {};
        for (let f of propFields) {
          tempInitData[f] = this.props[f];
        }
        console.log(tempInitData);
      }
      if (tempInitData) {
        console.log("get tempinitdata", tempInitData);
        createFormInitialState(propFields, validate, tempInitData).then(form =>
          this.setState(form)
        );
      }

      let setState = this.setState.bind(this);
      this.resetForm = this.resetForm.bind(this);
      this.preSubmit = this.preSubmit.bind(this);
      this.setValues = this.setValues.bind(this);

      this.getHandler = formEvtHandler(setState, validate);
    }

    setValues(values) {
      createFormInitialState(propFields, validate, values).then(form =>
        this.setState(form)
      );
    }

    preSubmit() {
      let { state } = this;
      state.hasSubmitted = true;
      this.setState(state);
    }

    resetForm() {
      if (initData) {
        createFormInitialState(propFields, validate, initData).then(form =>
          this.setState(form)
        );
      } else {
        this.setState(createEmptyInitialState(propFields, validate));
      }
    }

    render() {
      let { state } = this;
      let getHandler = this.getHandler.bind(this);

      let { fields, stats, errors, hasSubmitted } = this.state;
      let { resetForm, preSubmit } = this;
      let pass = { fields, errors, hasSubmitted, resetForm, preSubmit };

      pass.isFormValid = isEmpty(errors);

      for (let f of propFields) {
        let handlers = getHandler(f, state);
        pass[f] = {
          value: fields[f],
          ...stats[f],
          ...getHandler(f, state),
          error: errors[f]
        };
      }

      return (
        <WrapCmp {...this.props} {...pass} initData={this.props.initData} />
      );
    }
  }

  return Wrapper;
};

export default hiForm;
