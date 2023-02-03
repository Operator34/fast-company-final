import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { validator } from "../../../utils/validator";
// import api from "../../../api";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";
import { useQualities } from "../../../hooks/useQualities";
import { useProfessions } from "../../../hooks/useProfession";
import { useAuth } from "../../../hooks/useAuth";

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
    // const [professions, setProfession] = useState([]);
    // const [qualities, setQualities] = useState([]);
    const { currentUser, updateProfile } = useAuth();
    // console.log(currentUser);
    const { qualities, isLoading: qualitiesLoading } = useQualities();
    // console.log("qualities", qualities);
    const qualitiesList = qualities.map((q) => ({
        label: q.name,
        value: q._id
    }));
    // console.log(qualitiesList);
    const {
        professions,
        isLoading: professionsLoading
    } = useProfessions();
    const professionsList = professions.map((p) => ({
        label: p.name,
        value: p._id
    }));

    const [errors, setErrors] = useState({});

    // const getProfessionById = (id) => {
    //     for (const prof of professions) {
    //         if (prof.value === id) {
    //             return { _id: prof.value, name: prof.label };
    //         }
    //     }
    // };
    // const getQualities = (elements) => {
    //     const qualitiesArray = [];
    //     for (const elem of elements) {
    //         for (const quality in qualities) {
    //             if (elem.value === qualities[quality].value) {
    //                 qualitiesArray.push({
    //                     _id: qualities[quality].value,
    //                     name: qualities[quality].label,
    //                     color: qualities[quality].color
    //                 });
    //             }
    //         }
    //     }
    //     return qualitiesArray;
    // };

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

    // const handleSubmit = (e) => {
    //     console.log("Нажата кнопка");
    //     e.preventDefault();
    //     const isValid = validate();
    //     if (!isValid) return;
    //     const { profession, qualities } = data;
    //     api.users
    //         .update(userId, {
    //             ...data,
    //             profession: getProfessionById(profession),
    //             qualities: getQualities(qualities)
    //         })
    //         .then((data) => history.push(`/users/${data._id}`));
    //     console.log({
    //         ...data,
    //         profession: getProfessionById(profession),
    //         qualities: getQualities(qualities)
    //     });
    // };
    const getQualitiesId = (data) => {
        // console.log("data", data);

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

    // useEffect(() => {
    //     if (currentUser && !professionsLoading && !qualitiesLoading) {
    //         setIsLoading(false);
    //     }
    // }, [currentUser, professionsLoading, qualitiesLoading]);

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

console.log("data", data);
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
