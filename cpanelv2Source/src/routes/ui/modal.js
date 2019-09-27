import React, { Component, Fragment } from "react";
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";
import IntlMessages from "Util/IntlMessages";
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  Label
} from "reactstrap";
export default class ModalUi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalRight: false,
      modalLarge: false,
      modalSmall: false,
      modalLong: false,
      modalBack: false,
      backdrop: true
    };

    this.toggle = this.toggle.bind(this);
    this.toggleLarge = this.toggleLarge.bind(this);
    this.toggleSmall = this.toggleSmall.bind(this);
    this.toggleLong = this.toggleLong.bind(this);
    this.toggleRight = this.toggleRight.bind(this);
    this.toggleBack = this.toggleBack.bind(this);
    this.changeBackdrop = this.changeBackdrop.bind(this);
    this.toggleNestedContainer = this.toggleNestedContainer.bind(this);
    this.toggleNested = this.toggleNested.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleRight() {
    this.setState({
      modalRight: !this.state.modalRight
    });
  }

  toggleLarge() {
    this.setState({
      modalLarge: !this.state.modalLarge
    });
  }

  toggleSmall() {
    this.setState({
      modalSmall: !this.state.modalSmall
    });
  }

  toggleLong() {
    this.setState({
      modalLong: !this.state.modalLong
    });
  }

  toggleBack() {
    this.setState({
      modalBack: !this.state.modalBack
    });
  }

  changeBackdrop(e) {
    let value = e.target.value;
    if (value !== "static") {
      value = JSON.parse(value);
    }
    this.setState({ backdrop: value });
  }

  toggleNestedContainer() {
    this.setState({
      modalNestedContainer: !this.state.modalNestedContainer
    });
  }

  toggleNested() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: false
    });
  }

  toggleAll() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: true
    });
  }

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <BreadcrumbContainer
              heading={<IntlMessages id="menu.modal" />}
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
                  <IntlMessages id="modal.basic" />
                </CardTitle>
                <div>
                  <Button color="primary" outline onClick={this.toggle}>
                    <IntlMessages id="modal.launch-demo-modal" />
                  </Button>
                  <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>
                      <IntlMessages id="modal.modal-title" />
                    </ModalHeader>
                    <ModalBody>
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={this.toggle}>
                        کاری انجام دهید
                      </Button>{" "}
                      <Button color="secondary" onClick={this.toggle}>
                        بستن
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </CardBody>
            </Card>

            <Card className="mb-4">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="modal.scrolling-long-content" />
                </CardTitle>
                <div>
                  <Button color="primary" outline onClick={this.toggleLong}>
                    <IntlMessages id="modal.launch-demo-modal" />
                  </Button>
                  <Modal isOpen={this.state.modalLong} toggle={this.toggleLong}>
                    <ModalHeader toggle={this.toggleLong}>
                      عنوان مودال
                    </ModalHeader>
                    <ModalBody>
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.

                      <br /> طراح گرافیک از این متن به عنوان عنصری از ترکیب بندی برای پر کردن صفحه و ارایه اولیه شکل ظاهری و کلی طرح سفارش گرفته شده استفاده می نماید، تا از نظر گرافیکی نشانگر چگونگی نوع و اندازه فونت و ظاهر متن باشد. معمولا طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و بی‌معنی استفاده می‌کنند تا صرفا به مشتری یا صاحب کار خود نشان دهند که صفحه طراحی یا صفحه بندی شده بعد از اینکه متن در آن قرار گیرد چگونه به نظر می‌رسد و قلم‌ها و اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است.
                      <br />لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
                      <br /> طراح گرافیک از این متن به عنوان عنصری از ترکیب بندی برای پر کردن صفحه و ارایه اولیه شکل ظاهری و کلی طرح سفارش گرفته شده استفاده می نماید، تا از نظر گرافیکی نشانگر چگونگی نوع و اندازه فونت و ظاهر متن باشد. معمولا طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و بی‌معنی استفاده می‌کنند تا صرفا به مشتری یا صاحب کار خود نشان دهند که صفحه طراحی یا صفحه بندی شده بعد از اینکه متن در آن قرار گیرد چگونه به نظر می‌رسد و قلم‌ها و اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است.
                      <br /> لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
                      <br /> طراح گرافیک از این متن به عنوان عنصری از ترکیب بندی برای پر کردن صفحه و ارایه اولیه شکل ظاهری و کلی طرح سفارش گرفته شده استفاده می نماید، تا از نظر گرافیکی نشانگر چگونگی نوع و اندازه فونت و ظاهر متن باشد. معمولا طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و بی‌معنی استفاده می‌کنند تا صرفا به مشتری یا صاحب کار خود نشان دهند که صفحه طراحی یا صفحه بندی شده بعد از اینکه متن در آن قرار گیرد چگونه به نظر می‌رسد و قلم‌ها و اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است.
                      <br /> لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
                      <br /> طراح گرافیک از این متن به عنوان عنصری از ترکیب بندی برای پر کردن صفحه و ارایه اولیه شکل ظاهری و کلی طرح سفارش گرفته شده استفاده می نماید، تا از نظر گرافیکی نشانگر چگونگی نوع و اندازه فونت و ظاهر متن باشد. معمولا طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و بی‌معنی استفاده می‌کنند تا صرفا به مشتری یا صاحب کار خود نشان دهند که صفحه طراحی یا صفحه بندی شده بعد از اینکه متن در آن قرار گیرد چگونه به نظر می‌رسد و قلم‌ها و اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است.
                      <br /> لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
                      <br /> طراح گرافیک از این متن به عنوان عنصری از ترکیب بندی برای پر کردن صفحه و ارایه اولیه شکل ظاهری و کلی طرح سفارش گرفته شده استفاده می نماید، تا از نظر گرافیکی نشانگر چگونگی نوع و اندازه فونت و ظاهر متن باشد. معمولا طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و بی‌معنی استفاده می‌کنند تا صرفا به مشتری یا صاحب کار خود نشان دهند که صفحه طراحی یا صفحه بندی شده بعد از اینکه متن در آن قرار گیرد چگونه به نظر می‌رسد و قلم‌ها و اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است.
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={this.toggleLong}>
                        کاری انجام دهید
                      </Button>{" "}
                      <Button color="secondary" onClick={this.toggleLong}>
                        بستن
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </CardBody>
            </Card>

            <Card className="mb-4">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="modal.backdrop" />
                </CardTitle>
                <div>
                  <FormGroup className="mr-2">
                    <Label for="backdrop">
                      <IntlMessages id="modal.backdrop-value" />
                    </Label>
                    <Input
                      type="select"
                      name="backdrop"
                      id="backdrop"
                      onChange={this.changeBackdrop}
                    >
                      <option value="true">درست</option>
                      <option value="false">نادرست</option>
                      <option value="static">"ثابت"</option>
                    </Input>
                  </FormGroup>

                  <Button color="primary" outline onClick={this.toggleBack}>
                    <IntlMessages id="modal.launch-demo-modal" />
                  </Button>
                  <Modal
                    isOpen={this.state.modalBack}
                    toggle={this.toggleBack}
                    backdrop={this.state.backdrop}
                  >
                    <ModalHeader toggle={this.toggleBack}>
                      عنوان مودال
                    </ModalHeader>
                    <ModalBody>
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={this.toggleBack}>
                        کاری انجام دهید
                      </Button>{" "}
                      <Button color="secondary" onClick={this.toggleBack}>
                        بستن
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </CardBody>
            </Card>

            <Card className="mb-4">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="modal.right-modal" />
                </CardTitle>
                <div>
                  <Button color="primary" outline onClick={this.toggleRight}>
                    <IntlMessages id="modal.launch-right-modal" />
                  </Button>
                  <Modal isOpen={this.state.modalRight} toggle={this.toggleRight} wrapClassName="modal-right">
                    <ModalHeader toggle={this.toggleRight}>عنوان مودال</ModalHeader>
                    <ModalBody>
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.

                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={this.toggleRight}>
                        کاری انجام دهید
                      </Button>{" "}
                      <Button color="secondary" onClick={this.toggleRight}>
                        بستن
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </CardBody>
            </Card>

            <Card className="mb-4">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="modal.nested-modal" />
                </CardTitle>
                <div>
                  <Button
                    color="primary"
                    outline
                    onClick={this.toggleNestedContainer}
                  >
                    <IntlMessages id="modal.launch-demo-modal" />
                  </Button>

                  <Modal
                    isOpen={this.state.modalNestedContainer}
                    toggle={this.toggleNestedContainer}
                    className={this.props.className}
                  >
                    <ModalHeader toggle={this.toggleNestedContainer}>
                      عنوان مودال
                    </ModalHeader>
                    <ModalBody>
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
                      <br />
                      <div className="text-center m-2">
                        <Button
                          color="primary"
                          outline
                          onClick={this.toggleNested}
                        >
                          نمایش مودال
                        </Button>
                      </div>
                      <Modal
                        isOpen={this.state.nestedModal}
                        toggle={this.toggleNested}
                        onClosed={
                          this.state.closeAll
                            ? this.toggleNestedContainer
                            : undefined
                        }
                      >
                        <ModalHeader>عنوان مودال</ModalHeader>
                        <ModalBody>موارد مودال</ModalBody>
                        <ModalFooter>
                          <Button color="primary" onClick={this.toggleNested}>
                            تمام شده
                          </Button>{" "}
                          <Button color="secondary" onClick={this.toggleAll}>
                            همه انجام شده
                          </Button>
                        </ModalFooter>
                      </Modal>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="primary"
                        onClick={this.toggleNestedContainer}
                      >
                        کاری انجام دهید
                      </Button>{" "}
                      <Button
                        color="secondary"
                        onClick={this.toggleNestedContainer}
                      >
                        بستن
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </CardBody>
            </Card>

            <Card className="mb-4">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="modal.size" />
                </CardTitle>
                <div>
                  <Button
                    className="mr-2 mb-2"
                    color="primary"
                    outline
                    onClick={this.toggleLarge}
                  >
                    <IntlMessages id="modal.launch-large-modal" />
                  </Button>

                  <Button
                    className="mb-2"
                    color="primary"
                    outline
                    onClick={this.toggleSmall}
                  >
                    <IntlMessages id="modal.launch-small-modal" />
                  </Button>

                  <Modal
                    isOpen={this.state.modalLarge}
                    size="lg"
                    toggle={this.toggleLarge}
                  >
                    <ModalHeader toggle={this.toggleLarge}>
                      عنوان مودال
                    </ModalHeader>
                    <ModalBody>---</ModalBody>
                  </Modal>

                  <Modal
                    isOpen={this.state.modalSmall}
                    size="sm"
                    toggle={this.toggleSmall}
                  >
                    <ModalHeader toggle={this.toggleSmall}>
                      عنوان مودال
                    </ModalHeader>
                    <ModalBody>---</ModalBody>
                  </Modal>
                </div>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
