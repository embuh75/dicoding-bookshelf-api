export const successResponse = (data = null, message = "success") => ({
    status: "success",
    message,
    data,
});

export const failResponse = (message = "fail") => ({
    status: "fail",
    message,
});
