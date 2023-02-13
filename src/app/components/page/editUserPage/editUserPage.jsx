import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { validator } from "../../../utils/validator";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";

import { useAuth } from "../../../hooks/useAuth";
import { useSelector } from "react-redux";
import { getQualities, getQualitiesLoadingStatus } from "../../../store/qualities";
import { getProfessions, getProfessionsLoadingStatus } from "../../../store/professions";
import { getCurrentUserData } from "../../../store/users";

const EditUserPage = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({
        name: "",
        email: "",
        profession: "",
        sex: "male",
        qualities: []
    });

    const { updateProfile } = useAuth();
const currentUser = useSelector(getCurrentUserData());
    const qualities = useSelector(getQualities());
    const qualitiesLoading = useSelector(getQualitiesLoadingStatus());
    const qualitiesList = qualities.map((q) => ({
        label: q.name,
        value: q._id
    }));

    const professions = useSelector(getProfessions());
    const professionsLoading = useSelector(getProfessionsLoadingStatus());

    const professionsList = professions.map((p) => ({
        label: p.name,
        value: p._id
    }));

    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        console.log("Обновить пользователя ");
        console.log("data", data);
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        console.log("data handlesubmit", data);
        const newData = {
            ...data,
            qualities: data.qualities.map((q) => q.value)
        };
        console.log("newData", newData);

        try {
            await updateProfile(newData);
            history.push("/");
        } catch (error) {
            setErrors(error);
        }
    };

    const getQualitiesId = (data) => {
        return data.map((qid) =>
            qualitiesList.find((qual) => qid === qual.value)
        );
    };
    useEffect(() => {
        setIsLoading(true);
        if (currentUser && !professionsLoading && !qualitiesLoading) {
            setData((prevState) => ({
                ...prevState,
                ...currentUser,
                qualities: getQualitiesId(currentUser.qualities),
                profession: currentUser.profession
            }));
            setIsLoading(false);
        }
    }, [currentUser, professionsLoading, qualitiesLoading]);

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        name: {
            isRequired: {
                message: "Введите ваше имя"
            }
        }
    };
    useEffect(() => {
        validate();
    }, [data]);
    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;

    return (
        <div className="container mt-5">
            <BackHistoryButton />
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {!isLoading ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Выбери свою профессию"
                                defaultOption="Choose..."
                                options={professionsList}
                                name="profession"
                                onChange={handleChange}
                                value={data.profession}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            <MultiSelectField
                                defaultValue={data.qualities}
                                options={qualitiesList}
                                onChange={handleChange}
                                name="qualities"
                                label="Выберите ваши качества"
                            />
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Обновить
                            </button>
                        </form>
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;
