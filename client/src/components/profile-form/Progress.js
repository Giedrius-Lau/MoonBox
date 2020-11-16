import React from "react";
import PropTypes from "prop-types";
import { ProgressBar } from 'react-bootstrap';


const Progress = ({ precentage }) => {
    return <div><ProgressBar now={precentage} /></div>;
};

Progress.propTypes = {
    precentage: PropTypes.number.isRequired,
};

export default Progress;
