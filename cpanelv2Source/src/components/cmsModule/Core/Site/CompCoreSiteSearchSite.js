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

    this.state = {

      selectSite: "سایت انتخاب کنید",
      searchSite: [] //
    };



  }
  componentDidMount() {
    var errorExption=this.props.getCoreSiteActGetAll(this.state);
    console.log("errorExption");
    //payload
    console.log(errorExption);
  

  }
  
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