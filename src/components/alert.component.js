import React from 'react';

const Alert = props => {
  if(!props.message) {
    return null;
  }
  if (props.success) {
    return(
      <div className="alert alert-success">
        {props.message}
      </div>
    );
  } else {
    return(
      <div className="alert alert-warning">
        {props.message}
      </div>
    );
  }
}

export default Alert;