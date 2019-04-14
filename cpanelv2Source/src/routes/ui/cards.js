import React, { Component, Fragment } from "react";
import {
  Row, Card, CardHeader, CardBody, CardTitle, CardSubtitle, CardImg, CardImgOverlay, CardText, Badge, Button, TabContent, TabPane, Nav, NavItem, NavLink as NavLinkRs, FormGroup,
  Label,
  CustomInput
} from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from 'classnames';


import IntlMessages from "Util/IntlMessages";
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";
import ThumbnailLetters from "Components/ThumbnailLetters";
import ThumbnailImage from "Components/ThumbnailImage";

export default class CardsUi extends Component {
  constructor(props) {
    super(props);

    this.toggleFirstTab = this.toggleFirstTab.bind(this);
    this.toggleSecondTab = this.toggleSecondTab.bind(this);
    this.state = {
      activeFirstTab: '1',
      activeSecondTab: '1'
    };
  }

  toggleFirstTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeFirstTab: tab,
      });
    }
  }
  toggleSecondTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeSecondTab: tab,
      });
    }
  }
  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <BreadcrumbContainer
              heading={<IntlMessages id="menu.cards" />}
              match={this.props.match}
            />
            <Separator className="mb-5" />
          </Colxx>
        </Row>

        <Row>

          <Colxx xxs="12" >
            <CardTitle className="mb-4"><IntlMessages id="cards.icon-card" /></CardTitle>

            <Row className="icon-cards-row mb-2">
              <Colxx xxs="6" sm="4" md="3" lg="2">
                <Card className="mb-4">
                  <CardBody className="text-center">
                    <i className="iconsmind-Alarm" />
                    <p className="card-text font-weight-semibold mb-0"><IntlMessages id="dashboards.pending-orders" /></p>
                    <p className="lead text-center">14</p>
                  </CardBody>
                </Card>
              </Colxx>

              <Colxx xxs="6" sm="4" md="3" lg="2">
                <Card className="mb-4">
                  <CardBody className="text-center">
                    <i className="iconsmind-Basket-Coins" />
                    <p className="card-text font-weight-semibold mb-0"><IntlMessages id="dashboards.completed-orders" /></p>
                    <p className="lead text-center">32</p>
                  </CardBody>
                </Card>
              </Colxx>
              <Colxx xxs="6" sm="4" md="3" lg="2">
                <Card className="mb-4">
                  <CardBody className="text-center">
                    <i className="iconsmind-Arrow-Refresh" />
                    <p className="card-text font-weight-semibold mb-0"><IntlMessages id="dashboards.refund-requests" /></p>
                    <p className="lead text-center">74</p>
                  </CardBody>
                </Card>
              </Colxx>
              <Colxx xxs="6" sm="4" md="3" lg="2">
                <Card className="mb-4">
                  <CardBody className="text-center">
                    <i className="iconsmind-Mail-Read" />
                    <p className="card-text font-weight-semibold mb-0"><IntlMessages id="dashboards.new-comments" /></p>
                    <p className="lead text-center">25</p>
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
            <Row>
              <Colxx xxs="12">
                <CardTitle className="mb-4"><IntlMessages id="cards.image-card" /></CardTitle>
                <Row>
                  <Colxx xxs="12" xs="6" lg="4">
                    <Card className="mb-4">
                      <div className="position-relative">
                        <CardImg top src="/assets/img/card-thumb-1.jpg" alt="Card image cap" />
                        <Badge color="primary" pill className="position-absolute badge-top-right">جدید</Badge>
                        <Badge color="secondary" pill className="position-absolute badge-top-left-2">فرآوری شده</Badge>
                      </div>
                      <CardBody>
                        <CardSubtitle className="mb-4">کیک نسکافه ای خانگی با تزئین ماکارون</CardSubtitle>
                        <CardText className="text-muted text-small mb-0 font-weight-light">13 اردیبهشت 1397</CardText>
                      </CardBody>
                    </Card>
                  </Colxx>
                  <Colxx xxs="12" xs="6" lg="4">
                    <Card className="mb-4">
                      <CardBody>
                        <CardSubtitle className="mb-4">کیک نسکافه ای خانگی با تزئین ماکارون</CardSubtitle>
                        <CardText className="text-muted text-small mb-0 font-weight-light">13 اردیبهشت 1397</CardText>
                      </CardBody>
                      <div className="position-relative">
                        <CardImg bottom src="/assets/img/card-thumb-1.jpg" alt="Card image cap" />
                        <Badge color="primary" pill className="position-absolute badge-top-right">جدید</Badge>
                        <Badge color="secondary" pill className="position-absolute badge-top-left-2">فرآوری شده</Badge>
                      </div>
                    </Card>
                  </Colxx>
                </Row>
              </Colxx>
            </Row>
            <Row>
              <Colxx xxs="12">
                <CardTitle className="mb-4"><IntlMessages id="cards.image-overlay-card" /></CardTitle>
                <Row>
                  <Colxx xxs="12" xs="6" lg="3">
                    <Card inverse className="mb-4">
                      <CardImg src="/assets/img/card-thumb-1.jpg" alt="Card image cap" />
                      <CardImgOverlay>
                        <CardTitle>کیک میوه ای</CardTitle>
                        <CardText>این یک کارت گسترده تر با متن زیر است که به عنوان یک منبع طبیعی برای محتوای اضافی به کار می رود.</CardText>
                      </CardImgOverlay>
                    </Card>
                  </Colxx>
                </Row>
              </Colxx>
            </Row>
            <Row>
              <Colxx xxs="12">
                <CardTitle className="mb-4"><IntlMessages id="cards.image-card-list" /></CardTitle>
                <Row>
                  <Colxx xxs="12">
                    <Card className="d-flex flex-row mb-3">
                      <NavLink to="/app/ui/cards" className="d-flex">
                        <img alt="Thumbnail" src="/assets/img/chocolate-cake-thumb.jpg" className="list-thumbnail responsive border-0" />
                      </NavLink>
                      <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                        <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                          <NavLink to="/app/ui/cards" className="w-40 w-sm-100">
                            <p className="list-item-heading mb-1 truncate">کیک شکلاتی</p>
                          </NavLink>
                          <p className="mb-1 text-muted text-small w-15 w-sm-100">کیک ها</p>
                          <p className="mb-1 text-muted text-small w-15 w-sm-100">13 اردیبهشت 1397</p>
                          <div className="w-15 w-sm-100">
                            <Badge color="primary" pill >فرآوری شده</Badge>
                          </div>
                        </div>
                        <div className="custom-control custom-checkbox pr-1 align-self-center pl-4">
                        <FormGroup>
                            <CustomInput
                              type="checkbox"
                              id="check1"
                              label=""
                            />
                          </FormGroup>
                        </div>
                      </div>
                    </Card>
                  </Colxx>
                  <Colxx xxs="12">
                    <Card className="d-flex flex-row mb-3">
                      <NavLink to="/app/ui/cards" className="d-flex">
                        <img alt="Thumbnail" src="/assets/img/cheesecake-thumb.jpg" className="list-thumbnail responsive border-0" />
                      </NavLink>
                      <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                        <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                          <NavLink to="/app/ui/cards" className="w-40 w-sm-100">
                            <p className="list-item-heading mb-1 truncate">چیزکیک</p>
                          </NavLink>
                          <p className="mb-1 text-muted text-small w-15 w-sm-100">کاپ کیک ها</p>
                          <p className="mb-1 text-muted text-small w-15 w-sm-100">13 اردیبهشت 1397</p>
                          <div className="w-15 w-sm-100">
                            <Badge color="secondary" pill >درحال پردازش</Badge>
                          </div>
                        </div>
                        <div className="custom-control custom-checkbox pr-1 align-self-center pl-4">
                          <FormGroup>
                            <CustomInput
                              type="checkbox"
                              id="check2"
                              label=""
                            />
                          </FormGroup>
                        </div>

                      </div>
                    </Card>
                  </Colxx>
                </Row>
              </Colxx>
            </Row>
            <Row>
              <Colxx xxs="12">
                <CardTitle className="mb-4"><IntlMessages id="cards.tab-card" /></CardTitle>
                <Row>
                  <Colxx xxs="12" xs="6" lg="3" >
                    <Card className="mb-4">
                      <CardHeader>
                        <Nav tabs className="card-header-tabs ">
                          <NavItem>
                            <NavLink
                              className={classnames({ active: this.state.activeFirstTab === '1', "nav-link": true })}
                              onClick={() => { this.toggleFirstTab('1'); }} to="#"
                            >تب 1</NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: this.state.activeFirstTab === '2', "nav-link": true })}
                              onClick={() => { this.toggleFirstTab('2'); }} to="#"
                            >تب 2</NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: this.state.activeFirstTab === '3', "nav-link": true })}
                              onClick={() => { this.toggleFirstTab('3'); }} to="#"
                            >تب 3</NavLink>
                          </NavItem>
                        </Nav>
                      </CardHeader>

                      <TabContent activeTab={this.state.activeFirstTab}>
                        <TabPane tabId="1">
                          <Row>
                            <Colxx sm="12">
                              <CardBody>
                                <CardTitle className="mb-4">کیک نسکافه ای خانگی با تزئین ماکارون</CardTitle>
                                <Button outline size="sm" color="primary">ویرایش</Button>
                              </CardBody>
                            </Colxx>
                          </Row>
                        </TabPane>
                        <TabPane tabId="2">
                          <Row>
                            <Colxx sm="12">
                              <CardBody>
                                <CardTitle className="mb-4">کیک عروسی تزئین شده با ماکارون و گل رز</CardTitle>
                                <Button outline size="sm" color="primary">ویرایش</Button>
                              </CardBody>
                            </Colxx>
                          </Row>
                        </TabPane>
                        <TabPane tabId="3">
                          <Row>
                            <Colxx sm="12">
                              <CardBody>
                                <CardTitle className="mb-4">چیزکیک با شکلات و خامه عسل</CardTitle>
                                <Button outline size="sm" color="primary">ویرایش</Button>
                              </CardBody>
                            </Colxx>
                          </Row>
                        </TabPane>
                      </TabContent>
                    </Card>
                  </Colxx>


                  <Colxx xxs="12" xs="6" lg="3">
                    <Card className="mb-4">
                      <CardHeader className="pl-0 pr-0">
                        <Nav tabs className=" card-header-tabs  ml-0 mr-0">
                          <NavItem className="w-50 text-center">
                            <NavLink
                              className={classnames({ active: this.state.activeSecondTab === '1', "nav-link": true })}
                              onClick={() => { this.toggleSecondTab('1'); }} to="#"
                            >تب 1</NavLink>
                          </NavItem>
                          <NavItem className="w-50 text-center">
                            <NavLink
                              className={classnames({ active: this.state.activeSecondTab === '2', "nav-link": true })}
                              onClick={() => { this.toggleSecondTab('2'); }} to="#"
                            >تب 2</NavLink>
                          </NavItem>
                        </Nav>
                      </CardHeader>

                      <TabContent activeTab={this.state.activeSecondTab}>
                        <TabPane tabId="1">
                          <Row>
                            <Colxx sm="12">
                              <CardBody>
                                <CardTitle className="mb-4">کیک نسکافه ای خانگی با تزئین ماکارون</CardTitle>
                                <Button outline size="sm" color="primary">ویرایش</Button>
                              </CardBody>
                            </Colxx>
                          </Row>
                        </TabPane>
                        <TabPane tabId="2">
                          <Row>
                            <Colxx sm="12">
                              <CardBody>
                                <CardTitle className="mb-4">کیک عروسی تزئین شده با ماکارون و گل رز</CardTitle>
                                <Button outline size="sm" color="primary">ویرایش</Button>
                              </CardBody>
                            </Colxx>
                          </Row>
                        </TabPane>
                        <TabPane tabId="3">
                          <Row>
                            <Colxx sm="12">
                              <CardBody>
                                <CardTitle className="mb-4">چیزکیک با شکلات و خامه عسل</CardTitle>
                                <Button outline size="sm" color="primary">ویرایش</Button>
                              </CardBody>
                            </Colxx>
                          </Row>
                        </TabPane>
                      </TabContent>
                    </Card>
                  </Colxx>
                </Row>
              </Colxx>




            </Row>
            <Row>
              <Colxx xxs="12">
                <CardTitle className="mb-4"><IntlMessages id="cards.user-card" /></CardTitle>
                <Row>
                  <Colxx md="6" sm="6" lg="4" xxs="12">
                    <Card className="mb-4">
                      <CardBody>
                        <div className="text-center">
                          <CardImg top src="/assets/img/profile-pic-l.jpg" alt="Card image cap" className="img-thumbnail border-0 rounded-circle mb-4 list-thumbnail" />
                          <NavLink to="/app/ui/cards">
                            <CardSubtitle className="mb-1">فاطمه کاظمی زاده</CardSubtitle>
                          </NavLink>
                          <CardText className="text-muted text-small mb-4">برنامه نویس وبسایت</CardText>
                          <Button outline size="sm" color="primary">ویرایش</Button>
                        </div>
                      </CardBody>
                    </Card>
                  </Colxx>

                  <Colxx md="6" sm="6" lg="4" xxs="12">
                    <Card className="d-flex flex-row mb-4">
                      <NavLink to="/app/ui/cards" className="d-flex">
                        <ThumbnailImage rounded src="/assets/img/profile-pic-l.jpg" alt="Card image cap" className="m-4" />
                      </NavLink>
                      <div className=" d-flex flex-grow-1 min-width-zero">
                        <CardBody className=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                          <div className="min-width-zero">
                            <NavLink to="/app/ui/cards">
                              <CardSubtitle className="truncate mb-1">فاطمه کاظمی زاده</CardSubtitle>
                            </NavLink>
                            <CardText className="text-muted text-small mb-2">برنامه نویس وبسایت</CardText>
                            <Button outline size="xs" color="primary">ویرایش</Button>
                          </div>
                        </CardBody>
                      </div>
                    </Card>

                    <Card className="d-flex flex-row mb-4">
                      <NavLink to="/app/ui/cards" className="d-flex">
                        <ThumbnailLetters rounded text="فاطمه کاظمی زاده" className="m-4" />
                      </NavLink>
                      <div className=" d-flex flex-grow-1 min-width-zero">
                        <CardBody className=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                          <div className="min-width-zero">
                            <NavLink to="/app/ui/cards">
                              <CardSubtitle className="truncate mb-1">فاطمه کاظمی زاده</CardSubtitle>
                            </NavLink>
                            <CardText className="text-muted text-small mb-2">برنامه نویس وبسایت</CardText>
                            <Button outline size="xs" color="primary">ویرایش</Button>
                          </div>
                        </CardBody>
                      </div>
                    </Card>
                  </Colxx>


                  <Colxx md="6" sm="6" lg="4" xxs="12">
                    <Card className="d-flex flex-row mb-4">
                      <NavLink to="/app/ui/cards" className="d-flex">
                        <ThumbnailImage rounded small src="/assets/img/profile-pic-l.jpg" alt="profile" className="m-4" />
                      </NavLink>
                      <div className=" d-flex flex-grow-1 min-width-zero">
                        <CardBody className=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                          <div className="min-width-zero">
                            <NavLink to="/app/ui/cards">
                              <CardSubtitle className="truncate mb-1">فاطمه کاظمی زاده</CardSubtitle>
                            </NavLink>
                            <CardText className="text-muted text-small mb-2">برنامه نویس وبسایت</CardText>
                          </div>
                        </CardBody>
                      </div>
                    </Card>

                    <Card className="d-flex flex-row mb-4">
                      <NavLink to="/app/ui/cards" className="d-flex">
                        <ThumbnailLetters rounded small text="فاطمه کاظمی زاده" className="m-4"  />
                      </NavLink>
                      <div className=" d-flex flex-grow-1 min-width-zero">
                        <CardBody className=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                          <div className="min-width-zero">
                            <NavLink to="/app/ui/cards">
                              <CardSubtitle className="truncate mb-1">فاطمه کاظمی زاده</CardSubtitle>
                            </NavLink>
                            <CardText className="text-muted text-small mb-2">برنامه نویس وبسایت</CardText>
                          </div>
                        </CardBody>
                      </div>
                    </Card>
                  </Colxx>

                </Row>
              </Colxx>
            </Row>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
