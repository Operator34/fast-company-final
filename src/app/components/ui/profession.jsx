import React from "react";

import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getProfessionsLoadingStatus, getProfessionsById } from "../../store/professions";

const Profession = ({ id }) => {
    const isLoading = useSelector(getProfessionsLoadingStatus());
    const prof = useSelector(getProfessionsById(id));
    if (!isLoading) {
        return <p>{prof.name}</p>;
    } else return "Loading...";
};
Profession.propTypes = {
    id: PropTypes.string
};
export default Profession;
