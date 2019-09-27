import React, { Component, Fragment } from "react";
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";
import IntlMessages from "Util/IntlMessages";
import { Row, Card, CardBody, CardTitle } from "reactstrap";
import { iconsmind, simplelineicons } from "Data/icons";

class IconGroup extends Component {
  render() {
    const {iconSet,setIndex} = this.props;
    return (
      <div className="mb-5">
        <h6 className="mb-4">{iconSet.title}</h6>
          {iconSet.icons.map((icon, index) => {
              return (
                <div className="glyph" key={setIndex + index}>
                  <div className={"glyph-icon " + icon} />
                  <div className="class-name">{icon}</div>
                </div>
              )
            })}
            <div className="clearfix"></div>
      </div>
    )
  }
}

export default class IconsUi extends Component {
  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <BreadcrumbContainer
              heading={<IntlMessages id="menu.icons" />}
              match={this.props.match}
            />
            <Separator className="mb-5" />
          </Colxx>
        </Row>

        <Row>
          <Colxx xxs="12">
            <Card className="mb-4">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="icons.simplelineicons" /> (
                  {simplelineicons.length} icons)
                </CardTitle>
                <div className="simple-line-icons">
                  {simplelineicons.map((icon, index) => {
                    return (
                      <div className="glyph" key={index}>
                        <div className={"glyph-icon " + icon} />
                        <div className="class-name">{icon}</div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            <Card className="mb-4">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="icons.iconsmind" />
                </CardTitle>
                <div className="mind-icons">
                  {iconsmind.map((iconSet, setIndex) => {
                    return (
                      <IconGroup iconSet={iconSet} setIndex={setIndex} key={setIndex}/>
                    )
                  })}
                </div>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
