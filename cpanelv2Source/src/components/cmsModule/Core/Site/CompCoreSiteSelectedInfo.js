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
class CompCoreSiteSelectedInfo extends Component {
  constructor(props) {
    super();
    this.state = {
      selectSite: "سایت انتخاب کنید",
      searchSite: [] //
    };
  }
  
  render() {
    const selectedColor = this.state.selectedColor
    return ( 
    <div className = "d-inline-block" >
  نام سایت     
       </div>
    );
  }
}
const mapStateToProps = ({  authUser,  settings}) => {
  const {    user  } = authUser;
  const {    locale  } = settings;
  return {    user,    locale  };
};

 export default connect(mapStateToProps, {})(CompCoreSiteSelectedInfo);