import React from "react";
import { Row, Card, CardBody, Badge } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import { Colxx } from "Components/CustomBootstrap";
import ReactSiemaCarousel from "Components/ReactSiema/ReactSiemaCarousel";

export default class SectionTeam extends React.Component {

    render() {
        return (
            <Row>
                <Colxx xxs={{ size: "12"}} lg={{ size: 4 }} className="mb-4">
                    <h1><IntlMessages id="lp.team.title" /></h1>
                    <p>
                        <IntlMessages id="lp.team.detail-1"/><br/><br/>
                        <IntlMessages id="lp.team.detail-2"/>
                    </p>
                </Colxx>
                <Colxx xxs={{size:12}} lg={{size:7}} className="pl-0 pr-0 team-carousel float-center">
                    <ReactSiemaCarousel
                        perPage={{
                            0: 1,
                            576: 2,
                            1440: 3
                        }}
                        loop={false}
                        rtl={true}>
                        <div className="pr-3 pl-3 d-flex">
                            <Card>
                                <div className="position-relative">
                                    <img className="card-img-top" src="/assets/img/landing-page/team-1.jpg" alt="Card cap" />
                                    <Badge color="secondary" pill className="position-absolute badge-top-right">رابط کاربری</Badge>
                                </div>
                                <CardBody>
                                    <h6 className="mb-4">منصوری</h6>
                                    <footer>
                                        <p className="text-muted text-small mb-0 font-weight-light">
                                            ارشد نرم افزار
                                        </p>
                                    </footer>
                                </CardBody>
                            </Card>
                        </div>

                        <div className="pr-3 pl-3 d-flex">
                            <Card>
                                <div className="position-relative">
                                    <img className="card-img-top" src="/assets/img/landing-page/team-3.jpg" alt="Card cap" />
                                    <Badge color="secondary" pill className="position-absolute badge-top-right">رابط کاربری</Badge>
                                </div>
                                <CardBody>
                                    <h6 className="mb-4">فرهادی</h6>
                                    <footer>
                                        <p className="text-muted text-small mb-0 font-weight-light">
                                            توسعه دهنده ری اکت
                                        </p>
                                    </footer>
                                </CardBody>
                            </Card>
                        </div>

                        <div className="pr-3 pl-3 d-flex">
                            <Card>
                                <div className="position-relative">
                                    <img className="card-img-top" src="/assets/img/landing-page/team-2.jpg" alt="Card cap" />
                                    <Badge color="primary" pill className="position-absolute badge-top-right">برنامه نویس سرور</Badge>
                                </div>
                                <CardBody>
                                    <h6 className="mb-4">طباطبایی</h6>
                                    <footer>
                                        <p className="text-muted text-small mb-0 font-weight-light">
                                            ارشد توسعه نرم افزار
                                        </p>
                                    </footer>
                                </CardBody>
                            </Card>
                        </div>

                        <div className="pr-3 pl-3 d-flex">
                            <Card>
                                <div className="position-relative">
                                    <img className="card-img-top" src="/assets/img/landing-page/team-4.jpg" alt="Card cap" />
                                    <Badge color="primary" pill className="position-absolute badge-top-right">برنامه نویس سرور</Badge>
                                </div>
                                <CardBody>
                                    <h6 className="mb-4">احمدی راد</h6>
                                    <footer>
                                        <p className="text-muted text-small mb-0 font-weight-light">
                                            ارشد تحلیل و بررسی
                                        </p>
                                    </footer>
                                </CardBody>
                            </Card>
                        </div>

                        <div className="pr-3 pl-3 d-flex">
                            <Card>
                                <div className="position-relative">
                                    <img className="card-img-top" src="/assets/img/landing-page/team-5.jpg" alt="Card cap" />
                                    <Badge color="theme-3" pill className="position-absolute badge-top-right">طراحی</Badge>
                                </div>
                                <CardBody>
                                    <h6 className="mb-4">اکبری</h6>
                                    <footer>
                                        <p className="text-muted text-small mb-0 font-weight-light">
                                            کارگردان موشن گرافیک
                                        </p>
                                    </footer>
                                </CardBody>
                            </Card>
                        </div>
                    </ReactSiemaCarousel>
                </Colxx>
            </Row>
        );
    }
}

