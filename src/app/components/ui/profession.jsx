import React from "react";

import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getProfessionsLoadingStatus, getProfessions } from "../../store/professions";

const Profession = ({ id }) => {
    const isLoading = useSelector(getProfessionsLoadingStatus());
    const professions = useSelector(getProfessions());

    function getProfession(id) {
        return professions.find((p) => p._id === id);
    }
    console.log(getProfession(id));
    const prof = getProfession(id);
    if (!isLoading) {
        return <p>{prof.name}</p>;
    } else return "Loading...";
};
Profession.propTypes = {
    id: PropTypes.string
};
export default Profession;
