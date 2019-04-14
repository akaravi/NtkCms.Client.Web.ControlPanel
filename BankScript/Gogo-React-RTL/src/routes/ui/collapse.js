import React, { Component, Fragment } from "react";
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";
import IntlMessages from "Util/IntlMessages";

import {
  Row,
  Card,
  CardBody,
  Button,
  Collapse,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
export default class CollapseUi extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };


    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.state = {
      accordion: [true, false, false]
    };
  }

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    this.setState({
      accordion: state
    });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <BreadcrumbContainer
              heading={<IntlMessages id="menu.collapse" />}
              match={this.props.match}
            />
            <Separator className="mb-5" />
          </Colxx>
        </Row>

        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="collapse.basic" />
                </CardTitle>
                <CardSubtitle>
                  <IntlMessages id="collapse.controlled" />
                </CardSubtitle>

                <Button
                  color="primary"
                  onClick={this.toggle}
                  className="mb-1"
                >
                  <IntlMessages id="collapse.toggle" />
                </Button>
                <Collapse isOpen={this.state.collapse}>
                  <div className="p-4 border mt-4">
                    <p className="mb-0">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.

                      </p>
                  </div>
                </Collapse>
              </CardBody>
            </Card>
          </Colxx>
        </Row>

        <Row>
          <Colxx xxs="12" className="mb-4">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="collapse.accordion" />
                </CardTitle>
                <Fragment>
                  <div className="border">
                    <Button
                      block
                      color="link"
                      className="text-left"
                      onClick={() => this.toggleAccordion(0)}
                      aria-expanded={this.state.accordion[0]}
                    >
                      آکاردیون گزینه اول
                    </Button>
                    <Collapse isOpen={this.state.accordion[0]}>
                      <div className="p-4">
                        1. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.

                    </div>
                    </Collapse>
                  </div>
                  <div className="border">
                    <Button
                      block
                      color="link"
                      className="text-left"
                      onClick={() => this.toggleAccordion(1)}
                      aria-expanded={this.state.accordion[1]}
                    >
                      آکاردیون گزینه دوم
                    </Button>
                    <Collapse isOpen={this.state.accordion[1]}>
                      <div className="p-4">
                        2. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.

                    </div>
                    </Collapse>
                  </div>
                  <div className="border">
                    <Button
                      block
                      color="link"
                      className="text-left"
                      onClick={() => this.toggleAccordion(2)}
                      aria-expanded={this.state.accordion[2]}
                    >
                      آکاردیون گزینه سوم
                    </Button>
                    <Collapse isOpen={this.state.accordion[2]}>
                      <div className="p-4">
                        3. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.

                    </div>
                    </Collapse>
                  </div>
                </Fragment>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
