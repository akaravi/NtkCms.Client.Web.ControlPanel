import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";
import IntlMessages from "Util/IntlMessages";
import {
  Row
} from "reactstrap";

import AvailityBasic from "Components/FormValidations/AvailityBasic";
import AvailityCustom from "Components/FormValidations/AvailityCustom";
import AvailityDefaultValues from "Components/FormValidations/AvailityDefaultValues";
import FormikBasicFieldLevel from "Components/FormValidations/FormikBasicFieldLevel";
import FormikBasicFormLevel from "Components/FormValidations/FormikBasicFormLevel";
import FormikValidationSchema from "Components/FormValidations/FormikValidationSchema";
import FormikCustomComponents from "Components/FormValidations/FormikCustomComponents";
import FormikCustomWithTopLabels from "Components/FormValidations/FormikCustomWithTopLabels";

import TooltipLocations from "Components/FormValidations/TooltipLocations";


class FormValidations extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { messages } = this.props.intl;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <BreadcrumbContainer
              heading={<IntlMessages id="menu.form-validations" />}
              match={this.props.match}
            />
            <Separator className="mb-5" />
          </Colxx>
        </Row>

        <Row>
          <Colxx xs="12" md="6" className="mb-3">
            <h5 className="mb-5">
              <IntlMessages id="forms.validation-formik" />
            </h5>
            <FormikBasicFieldLevel />
            <FormikBasicFormLevel />
            <FormikValidationSchema />
            <FormikCustomComponents/>
            <FormikCustomWithTopLabels/>

          </Colxx>

          <Colxx xs="12" md="6" className="mb-3">
            <h5 className="mb-5">
              <IntlMessages id="forms.validation-availity" />
            </h5>
            <AvailityBasic />
            <AvailityCustom />
            <AvailityDefaultValues />
          </Colxx>
        </Row>

        <Row>
          <Colxx xs="12">
          <h5 className="mb-5">
              موقعیت تولتیپ
            </h5>
            <TooltipLocations/>
          </Colxx>

        </Row>

      </Fragment>
    );
  }
}
export default injectIntl(FormValidations)