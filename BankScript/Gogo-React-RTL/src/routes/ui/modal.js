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
																		<Button
																				color="primary"
																				outline
																				onClick={this.toggle}
																		>
																				<IntlMessages id="modal.launch-demo-modal" />
																		</Button>
																		<Modal
																				isOpen={this.state.modal}
																				toggle={this.toggle}
																		>
																				<ModalHeader toggle={this.toggle}>
																						<IntlMessages id="modal.modal-title" />
																				</ModalHeader>
																				<ModalBody>
																						لورم ایپسوم متن ساختگی با تولید
																						سادگی نامفهوم از صنعت چاپ و با
																						استفاده از طراحان گرافیک است.
																						چاپگرها و متون بلکه روزنامه و مجله
																						در ستون و سطرآنچنان که لازم است و
																						برای شرایط فعلی تکنولوژی مورد نیاز و
																						کاربردهای متنوع با هدف بهبود
																						ابزارهای کاربردی می باشد. کتابهای
																						زیادی در شصت و سه درصد گذشته، حال و
																						آینده شناخت فراوان جامعه و متخصصان
																						را می طلبد تا با نرم افزارها شناخت
																						بیشتری را برای طراحان رایانه ای علی
																						الخصوص طراحان خلاقی و فرهنگ پیشرو در
																						زبان فارسی ایجاد کرد.
																				</ModalBody>
																				<ModalFooter>
																						<Button
																								color="primary"
																								onClick={this.toggle}
																						>
																								قبول می کنم
																						</Button>{" "}
																						<Button
																								color="secondary"
																								onClick={this.toggle}
																						>
																								صرف نظر
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
																		<Button
																				color="primary"
																				outline
																				onClick={this.toggleLong}
																		>
																				<IntlMessages id="modal.launch-demo-modal" />
																		</Button>
																		<Modal
																				isOpen={this.state.modalLong}
																				toggle={this.toggleLong}
																		>
																				<ModalHeader toggle={this.toggleLong}>
																						عنوان مودال در اینجا
																				</ModalHeader>
																				<ModalBody>
																						لورم ایپسوم متن ساختگی با تولید
																						سادگی نامفهوم از صنعت چاپ و با
																						استفاده از طراحان گرافیک است.
																						چاپگرها و متون بلکه روزنامه و مجله
																						در ستون و سطرآنچنان که لازم است و
																						برای شرایط فعلی تکنولوژی مورد نیاز و
																						کاربردهای متنوع با هدف بهبود
																						ابزارهای کاربردی می باشد. کتابهای
																						زیادی در شصت و سه درصد گذشته، حال و
																						آینده شناخت فراوان جامعه و متخصصان
																						را می طلبد تا با نرم افزارها شناخت
																						بیشتری را برای طراحان رایانه ای علی
																						الخصوص طراحان خلاقی و فرهنگ پیشرو در
																						زبان فارسی ایجاد کرد.
																						<br /> لورم ایپسوم متن ساختگی با
																						تولید سادگی نامفهوم از صنعت چاپ و با
																						استفاده از طراحان گرافیک است.
																						چاپگرها و متون بلکه روزنامه و مجله
																						در ستون و سطرآنچنان که لازم است و
																						برای شرایط فعلی تکنولوژی مورد نیاز و
																						کاربردهای متنوع با هدف بهبود
																						ابزارهای کاربردی می باشد. کتابهای
																						زیادی در شصت و سه درصد گذشته، حال و
																						آینده شناخت فراوان جامعه و متخصصان
																						را می طلبد تا با نرم افزارها شناخت
																						بیشتری را برای طراحان رایانه ای علی
																						الخصوص طراحان خلاقی و فرهنگ پیشرو در
																						زبان فارسی ایجاد کرد.
																						<br /> لورم ایپسوم متن ساختگی با
																						تولید سادگی نامفهوم از صنعت چاپ و با
																						استفاده از طراحان گرافیک است.
																						چاپگرها و متون بلکه روزنامه و مجله
																						در ستون و سطرآنچنان که لازم است و
																						برای شرایط فعلی تکنولوژی مورد نیاز و
																						کاربردهای متنوع با هدف بهبود
																						ابزارهای کاربردی می باشد. کتابهای
																						زیادی در شصت و سه درصد گذشته، حال و
																						آینده شناخت فراوان جامعه و متخصصان
																						را می طلبد تا با نرم افزارها شناخت
																						بیشتری را برای طراحان رایانه ای علی
																						الخصوص طراحان خلاقی و فرهنگ پیشرو در
																						زبان فارسی ایجاد کرد.
																						<br /> لورم ایپسوم متن ساختگی با
																						تولید سادگی نامفهوم از صنعت چاپ و با
																						استفاده از طراحان گرافیک است.
																						چاپگرها و متون بلکه روزنامه و مجله
																						در ستون و سطرآنچنان که لازم است و
																						برای شرایط فعلی تکنولوژی مورد نیاز و
																						کاربردهای متنوع با هدف بهبود
																						ابزارهای کاربردی می باشد. کتابهای
																						زیادی در شصت و سه درصد گذشته، حال و
																						آینده شناخت فراوان جامعه و متخصصان
																						را می طلبد تا با نرم افزارها شناخت
																						بیشتری را برای طراحان رایانه ای علی
																						الخصوص طراحان خلاقی و فرهنگ پیشرو در
																						زبان فارسی ایجاد کرد.
																						<br /> لورم ایپسوم متن ساختگی با
																						تولید سادگی نامفهوم از صنعت چاپ و با
																						استفاده از طراحان گرافیک است.
																						چاپگرها و متون بلکه روزنامه و مجله
																						در ستون و سطرآنچنان که لازم است و
																						برای شرایط فعلی تکنولوژی مورد نیاز و
																						کاربردهای متنوع با هدف بهبود
																						ابزارهای کاربردی می باشد. کتابهای
																						زیادی در شصت و سه درصد گذشته، حال و
																						آینده شناخت فراوان جامعه و متخصصان
																						را می طلبد تا با نرم افزارها شناخت
																						بیشتری را برای طراحان رایانه ای علی
																						الخصوص طراحان خلاقی و فرهنگ پیشرو در
																						زبان فارسی ایجاد کرد.
																						<br /> لورم ایپسوم متن ساختگی با
																						تولید سادگی نامفهوم از صنعت چاپ و با
																						استفاده از طراحان گرافیک است.
																						چاپگرها و متون بلکه روزنامه و مجله
																						در ستون و سطرآنچنان که لازم است و
																						برای شرایط فعلی تکنولوژی مورد نیاز و
																						کاربردهای متنوع با هدف بهبود
																						ابزارهای کاربردی می باشد. کتابهای
																						زیادی در شصت و سه درصد گذشته، حال و
																						آینده شناخت فراوان جامعه و متخصصان
																						را می طلبد تا با نرم افزارها شناخت
																						بیشتری را برای طراحان رایانه ای علی
																						الخصوص طراحان خلاقی و فرهنگ پیشرو در
																						زبان فارسی ایجاد کرد.
																						<br /> لورم ایپسوم متن ساختگی با
																						تولید سادگی نامفهوم از صنعت چاپ و با
																						استفاده از طراحان گرافیک است.
																						چاپگرها و متون بلکه روزنامه و مجله
																						در ستون و سطرآنچنان که لازم است و
																						برای شرایط فعلی تکنولوژی مورد نیاز و
																						کاربردهای متنوع با هدف بهبود
																						ابزارهای کاربردی می باشد. کتابهای
																						زیادی در شصت و سه درصد گذشته، حال و
																						آینده شناخت فراوان جامعه و متخصصان
																						را می طلبد تا با نرم افزارها شناخت
																						بیشتری را برای طراحان رایانه ای علی
																						الخصوص طراحان خلاقی و فرهنگ پیشرو در
																						زبان فارسی ایجاد کرد.
																						<br /> لورم ایپسوم متن ساختگی با
																						تولید سادگی نامفهوم از صنعت چاپ و با
																						استفاده از طراحان گرافیک است.
																						چاپگرها و متون بلکه روزنامه و مجله
																						در ستون و سطرآنچنان که لازم است و
																						برای شرایط فعلی تکنولوژی مورد نیاز و
																						کاربردهای متنوع با هدف بهبود
																						ابزارهای کاربردی می باشد. کتابهای
																						زیادی در شصت و سه درصد گذشته، حال و
																						آینده شناخت فراوان جامعه و متخصصان
																						را می طلبد تا با نرم افزارها شناخت
																						بیشتری را برای طراحان رایانه ای علی
																						الخصوص طراحان خلاقی و فرهنگ پیشرو در
																						زبان فارسی ایجاد کرد.
																						<br /> لورم ایپسوم متن ساختگی با
																						تولید سادگی نامفهوم از صنعت چاپ و با
																						استفاده از طراحان گرافیک است.
																						چاپگرها و متون بلکه روزنامه و مجله
																						در ستون و سطرآنچنان که لازم است و
																						برای شرایط فعلی تکنولوژی مورد نیاز و
																						کاربردهای متنوع با هدف بهبود
																						ابزارهای کاربردی می باشد. کتابهای
																						زیادی در شصت و سه درصد گذشته، حال و
																						آینده شناخت فراوان جامعه و متخصصان
																						را می طلبد تا با نرم افزارها شناخت
																						بیشتری را برای طراحان رایانه ای علی
																						الخصوص طراحان خلاقی و فرهنگ پیشرو در
																						زبان فارسی ایجاد کرد.
																						<br /> لورم ایپسوم متن ساختگی با
																						تولید سادگی نامفهوم از صنعت چاپ و با
																						استفاده از طراحان گرافیک است.
																						چاپگرها و متون بلکه روزنامه و مجله
																						در ستون و سطرآنچنان که لازم است و
																						برای شرایط فعلی تکنولوژی مورد نیاز و
																						کاربردهای متنوع با هدف بهبود
																						ابزارهای کاربردی می باشد. کتابهای
																						زیادی در شصت و سه درصد گذشته، حال و
																						آینده شناخت فراوان جامعه و متخصصان
																						را می طلبد تا با نرم افزارها شناخت
																						بیشتری را برای طراحان رایانه ای علی
																						الخصوص طراحان خلاقی و فرهنگ پیشرو در
																						زبان فارسی ایجاد کرد.
																						<br /> لورم ایپسوم متن ساختگی با
																						تولید سادگی نامفهوم از صنعت چاپ و با
																						استفاده از طراحان گرافیک است.
																						چاپگرها و متون بلکه روزنامه و مجله
																						در ستون و سطرآنچنان که لازم است و
																						برای شرایط فعلی تکنولوژی مورد نیاز و
																						کاربردهای متنوع با هدف بهبود
																						ابزارهای کاربردی می باشد. کتابهای
																						زیادی در شصت و سه درصد گذشته، حال و
																						آینده شناخت فراوان جامعه و متخصصان
																						را می طلبد تا با نرم افزارها شناخت
																						بیشتری را برای طراحان رایانه ای علی
																						الخصوص طراحان خلاقی و فرهنگ پیشرو در
																						زبان فارسی ایجاد کرد.
																				</ModalBody>
																				<ModalFooter>
																						<Button
																								color="primary"
																								onClick={this.toggleLong}
																						>
																								قبول می کنم
																						</Button>{" "}
																						<Button
																								color="secondary"
																								onClick={this.toggleLong}
																						>
																								صرف نظر
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
																						<option value="true">true</option>
																						<option value="false">false</option>
																						<option value="static">
																								"static"
																						</option>
																				</Input>
																		</FormGroup>

																		<Button
																				color="primary"
																				outline
																				onClick={this.toggleBack}
																		>
																				<IntlMessages id="modal.launch-demo-modal" />
																		</Button>
																		<Modal
																				isOpen={this.state.modalBack}
																				toggle={this.toggleBack}
																				backdrop={this.state.backdrop}
																		>
																				<ModalHeader toggle={this.toggleBack}>
																						عنوان مودال در اینجا
																				</ModalHeader>
																				<ModalBody>
																						لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.

																				</ModalBody>
																				<ModalFooter>
																						<Button
																								color="primary"
																								onClick={this.toggleBack}
																						>
																								قبول می کنم
																						</Button>{" "}
																						<Button
																								color="secondary"
																								onClick={this.toggleBack}
																						>
																								صرف نظر
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
																		<Button
																				color="primary"
																				outline
																				onClick={this.toggleRight}
																		>
																				<IntlMessages id="modal.launch-right-modal" />
																		</Button>
																		<Modal
																				isOpen={this.state.modalRight}
																				toggle={this.toggleRight}
																				wrapClassName="modal-right"
																		>
																				<ModalHeader toggle={this.toggleRight}>
																						عنوان مودال در اینجا
																				</ModalHeader>
																				<ModalBody>
																						لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.

																				</ModalBody>
																				<ModalFooter>
																						<Button
																								color="primary"
																								onClick={this.toggleRight}
																						>
																								قبول می کنم
																						</Button>{" "}
																						<Button
																								color="secondary"
																								onClick={this.toggleRight}
																						>
																								صرف نظر
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
																				<ModalHeader
																						toggle={this.toggleNestedContainer}
																				>
																						عنوان مودال در اینجا
																				</ModalHeader>
																				<ModalBody>
																						لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.

																						<br />
																						<div className="text-center m-2">
																								<Button
																										color="primary"
																										outline
																										onClick={this.toggleNested}
																								>
																										نمایش مودال های تو در تو
																								</Button>
																						</div>
																						<Modal
																								isOpen={this.state.nestedModal}
																								toggle={this.toggleNested}
																								onClosed={
																										this.state.closeAll
																												? this
																															.toggleNestedContainer
																												: undefined
																								}
																						>
																								<ModalHeader>
																										عنوان مودال تو در تو
																								</ModalHeader>
																								<ModalBody>
																										محتوای مودال در این قسمت
																								</ModalBody>
																								<ModalFooter>
																										<Button
																												color="primary"
																												onClick={
																														this.toggleNested
																												}
																										>
																												قبول
																										</Button>{" "}
																										<Button
																												color="secondary"
																												onClick={this.toggleAll}
																										>
																												قبول همه
																										</Button>
																								</ModalFooter>
																						</Modal>
																				</ModalBody>
																				<ModalFooter>
																						<Button
																								color="primary"
																								onClick={
																										this.toggleNestedContainer
																								}
																						>
																								قبول می کنم
																						</Button>{" "}
																						<Button
																								color="secondary"
																								onClick={
																										this.toggleNestedContainer
																								}
																						>
																								صرف نظر
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
																				className="ml-2 mb-2"
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
																						عنوان مودال در اینجا
																				</ModalHeader>
																				<ModalBody>---</ModalBody>
																		</Modal>

																		<Modal
																				isOpen={this.state.modalSmall}
																				size="sm"
																				toggle={this.toggleSmall}
																		>
																				<ModalHeader toggle={this.toggleSmall}>
																						عنوان مودال در اینجا
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
