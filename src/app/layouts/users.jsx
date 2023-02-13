import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EditUserPage from "../components/page/editUserPage";
import UserPage from "../components/page/userPage";
import UsersListPage from "../components/page/usersListPage";
import UserProvider from "../hooks/useUsers";
import { getDataStatus, loadUsersList } from "../store/users";
const Users = () => {
    const params = useParams();
    const { userId, edit } = params;
    const dataStatus = useSelector(getDataStatus());
    const dispatch = useDispatch();
    useEffect(() => {
        if (!dataStatus) dispatch(loadUsersList());
    }, []);
    if (!dataStatus) return "Loading...";
    return (
        <>
            <UserProvider>
                {userId ? (
                    edit ? (
                        <EditUserPage />
                    ) : (
                        <UserPage userId={userId} />
                    )
                ) : (
                    <UsersListPage />
                )}
            </UserProvider>
        </>
    );
};

export default Users;
