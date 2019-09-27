import React, { Component, Fragment } from "react";
import { Row, Card, CardBody } from "reactstrap";
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";
import Sortable from "react-sortablejs";
import IntlMessages from "Util/IntlMessages";

export default class SortableUi extends Component {
  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <BreadcrumbContainer
              heading={<IntlMessages id="menu.sortable" />}
              match={this.props.match}
            />
            <Separator className="mb-5" />
          </Colxx>
        </Row>

        <Row>
          <Colxx xxs="12">
            <h5 className="mb-4">
              <IntlMessages id="sortable.columns" />
            </h5>

            <Sortable className="row icon-cards-row mb-2">
              <Colxx xxs="6" sm="4" md="3" className="mb-4">
                <Card>
                  <CardBody className="text-center">
                    <i className="iconsminds-clock" />
                    <p className="card-text font-weight-semibold mb-0">
                      کارهای در حال انجام
                    </p>
                    <p className="lead text-center">14</p>
                  </CardBody>
                </Card>
              </Colxx>

              <Colxx xxs="6" sm="4" md="3" className="mb-4">
                <Card>
                  <CardBody className="text-center">
                    <i className="iconsminds-basket-coins" />
                    <p className="card-text font-weight-semibold mb-0">
                      کارهای انجام شده
                    </p>
                    <p className="lead text-center">32</p>
                  </CardBody>
                </Card>
              </Colxx>
              <Colxx xxs="6" sm="4" md="3" className="mb-4">
                <Card>
                  <CardBody className="text-center">
                    <i className="iconsminds-arrow-refresh" />
                    <p className="card-text font-weight-semibold mb-0">
                      درخواست بازپرداخت
                    </p>
                    <p className="lead text-center">74</p>
                  </CardBody>
                </Card>
              </Colxx>
              <Colxx xxs="6" sm="4" md="3" className="mb-4">
                <Card>
                  <CardBody className="text-center">
                    <i className="iconsminds-mail-read" />
                    <p className="card-text font-weight-semibold mb-0">
                      نظر جدید
                    </p>
                    <p className="lead text-center">25</p>
                  </CardBody>
                </Card>
              </Colxx>
            </Sortable>
          </Colxx>
        </Row>

        <Row>
          <Colxx xxs="12">
            <h5 className="mb-4">
              <IntlMessages id="sortable.basic" />
            </h5>

            <Card className="mb-4">
              <CardBody>
                <Sortable tag="ul" className="list-unstyled">
                  <li>
                    <p>1. کیک</p>
                  </li>
                  <li>
                    <p>2. کیک میوه ای</p>
                  </li>
                  <li>
                    <p>3. کاپ کیک</p>
                  </li>
                  <li>
                    <p>4. کیک سرد</p>
                  </li>
                </Sortable>
              </CardBody>
            </Card>
          </Colxx>
        </Row>

        <Row>
          <Colxx xxs="12">
            <h5 className="mb-4">
              <IntlMessages id="sortable.handles" />
            </h5>
            <Card className="mb-4">
              <CardBody>
                <Sortable
                  tag="ul"
                  className="list-unstyled"
                  options={{
                    handle: ".handle"
                  }}
                >
                  <li>
                    <p>
                      <span className="badge badge-pill badge-secondary handle mr-1">
                        <i className="simple-icon-cursor-move" />
                      </span>
                      <span>کیک </span>
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="badge badge-pill badge-secondary handle mr-1">
                      <i className="simple-icon-cursor-move" />
                      </span>
                      کاپ کیک
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="badge badge-pill badge-secondary handle mr-1">
                      <i className="simple-icon-cursor-move" />
                      </span>
                      کیک شکلاتی
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="badge badge-pill badge-secondary handle mr-1">
                      <i className="simple-icon-cursor-move" />
                      </span>
                      کیک سرد
                    </p>
                  </li>
                </Sortable>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
