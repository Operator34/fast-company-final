import httpService from "./http.service";
const commentEndpoint = "comment/";

const commentService = {
    createComment: async (payload) => {
        console.log(payload);
        const { data } = await httpService.put(
            commentEndpoint + payload._id,
            payload
        );
        return data;
    },
    getComments: async (pageId) => {
        const { data } = await httpService.get(commentEndpoint, {
            params: {
                orderBy: '"pageId"',
                equalTo: `"${pageId}"`
            }
        });
        return data;
    },
    removeComment: async (commentId) => {
        console.log("commentId", commentId);
        const { data } = await httpService.delete(commentEndpoint + commentId);
        console.log("data comments service", data);
        return data;
    }
};
export default commentService;
