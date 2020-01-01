import React, {  Component} from 'react';
import {  connect} from "react-redux";

class CompCoreSiteSelectedInfo extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   SiteSelectedInfo:{}
    // };
  }
  
  render() {
        return ( 
    <div className = "d-inline-block" >
  نام سایت     
       </div>
    );
  }
}
// const mapStateToProps = ({  SiteSelectedInfo,  settings}) => {
//   const {    SiteSelectedInfo  } = SiteSelectedInfo;
//   const {    locale  } = settings;
//   return {    user,    locale  };
// };

 export default connect()(CompCoreSiteSelectedInfo);