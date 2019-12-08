import React, {  Component} from 'react';
import ReactDOM from 'react-dom';
import { injectIntl} from 'react-intl';
import {  connect} from "react-redux";

import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Input,
  Button
} from "reactstrap";
import axios from 'axios';
import {
  cmsServerConfig
} from 'Constants/defaultValues';
import {
  getCoreUserActSelectCurrentSite,
  getCoreSiteActGetAll,
  getCoreSiteActFastGetAll
} from "Redux/actions";
class CompCoreSiteSearchSite extends Component {
  constructor(props) {
    super();

    // this.toggle = this.toggle.bind(this);
    // this.changeThemeColor = this.changeThemeColor.bind(this);
    // this.addEvents = this.addEvents.bind(this);
    // this.removeEvents = this.removeEvents.bind(this);
    // this.handleDocumentClick = this.handleDocumentClick.bind(this);
    // this.getContainer = this.getContainer.bind(this);

    // this.state = {
    // 	isOpen: false,
    // 	selectedColor:localStorage.getItem('themeColor')
    // };
    this.state = {

      selectSite: "سایت انتخاب کنید",
      searchSite: [] //
    };



  }
  componentDidMount() {
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('userGlobaltoken')
    };
    const postData = {

    };

    axios.post(cmsServerConfig.mainPath + `/api/CoreSite/Getall`, postData, {
        headers: headers
      })
      .then(
        response => {
          var array = response.data.ListItems;
          this.setState({
            searchSite: array
          });

        }
      )
      .catch(
        error => {
          var array = [];
          this.setState({
            searchSite: array
          });

        }

      );

  }
  // getContainer() {
  // 	return ReactDOM.findDOMNode(this);
  // }

  // toggle(e) {
  // 	e.preventDefault();
  // 	const isOpen = this.state.isOpen;
  // 	if (!isOpen) {
  // 		this.addEvents();
  // 	} else {
  // 		this.removeEvents();
  // 	}
  // 	this.setState({
  // 		isOpen: !isOpen
  // 	})
  // }
  // changeThemeColor(e, color) {
  // 	e.preventDefault();
  // 	localStorage.setItem('themeColor', color)
  // 	this.toggle(e);
  // 	setTimeout(()=>{
  // 		window.location.reload();
  // 	},500)
  // }

  // componentWillMount() {
  // 	this.removeEvents();
  // }


  // addEvents() {
  // 	['click', 'touchstart'].forEach(event =>
  // 		document.addEventListener(event, this.handleDocumentClick, true)
  // 	);
  // }
  // removeEvents() {
  // 	['click', 'touchstart'].forEach(event =>
  // 		document.removeEventListener(event, this.handleDocumentClick, true)
  // 	);
  // }

  // handleDocumentClick(e) {
  // 	const container = this.getContainer();
  // 	if ((container.contains(e.target) || container === e.target)) {
  // 		return;
  // 	}
  // 	this.toggle(e);
  // }
  handleChangeSite = siteId => {
    alert("siteId:"+siteId);
    this.props.getCoreUserActSelectCurrentSite(siteId);
    console.log(this.props.searchSite);
  };
  render() {
    const selectedColor = this.state.selectedColor
    return ( 
    <div className = "d-inline-block" >
      <UncontrolledDropdown className = "mr-2" >
      <DropdownToggle caret color = "light"
      size = "sm"
      className = "language-button" >
      <span className = "name" > {
        this.state.selectSite
      } </span> 
      </DropdownToggle> 
      <DropdownMenu className = "mt-3"
      right > {
        this.state.searchSite.map((l) => {
          return ( 
            <DropdownItem onClick = {
              () => this.handleChangeSite(l.Id)
            }
            key = {
              l.Id
            } > {
              l.Title
            }
            </DropdownItem>
          )
        })
      } 
      </DropdownMenu> 
      </UncontrolledDropdown> 
      </div>
    );
  }
}
const mapStateToProps = ({  authUser,  settings}) => {
  const {    user  } = authUser;
  const {    locale  } = settings;
  return {    user,    locale  };
};
export default injectIntl(connect(
    mapStateToProps,
    {getCoreUserActSelectCurrentSite,getCoreSiteActGetAll,getCoreSiteActFastGetAll }
  )(CompCoreSiteSearchSite));

// export default connect(mapStateToProps, {})(CompCoreSiteSearchSite);