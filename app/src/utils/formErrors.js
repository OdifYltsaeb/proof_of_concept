const defaultMessages = {
    network: 'Bad response from server, try again later',
    invalidResponseCode: 'Bad response from server, try again later',
};

export const isArray = Array.isArray; // eslint-disable-line prefer-destructuring

export const isObject = (value) => !!value && !isArray(value) && typeof value === 'object';

export const isString = (value) => typeof value === 'string';

export const isStringArray = (value) =>
    isArray(value) && value.length > 0 && value.every((x) => isString(x));

export const isNumber = (value) => typeof value === 'number';

const errorResponseCodes = {
    validationError: [400],
    unAuthorizedError: [401],
    forbiddenError: [403],
    serverError: [500],
    other4xxErrors: [402, 405, 406, 407, 408, 409, 410],
    other5xxErrors: [501, 502, 503, 504, 505, 506, 507, 508, 510, 511],
};

const isValidationError = (response) =>
    errorResponseCodes.validationError.indexOf(response.status) > -1;

const isServerError = (response) =>
    response.message === 'Network Error' ||
    errorResponseCodes.serverError.indexOf(response.status) > -1 ||
    errorResponseCodes.other5xxErrors.indexOf(response.status) > -1;

const isOther4xxError = (response) =>
    errorResponseCodes.unAuthorizedError.indexOf(response.status) > -1 ||
    errorResponseCodes.other4xxErrors.indexOf(response.status) > -1;

const parseformErrors = (respData) => {
    let nonFieldErrors;
    const errors = 'errors' in respData ? { ...respData.errors } : { ...respData };

    if (Object.keys(errors).indexOf('non_field_errors') > -1) {
        nonFieldErrors = errors.non_field_errors;
        delete errors.non_field_errors;
    }

    if (Object.keys(errors).indexOf('detail') > -1 && nonFieldErrors === undefined) {
        nonFieldErrors = respData.detail;
        delete errors.detail;
    }
    const parsed = {};
    Object.keys(errors).forEach((key) => {
        const [value] = errors[key][0];
        parsed[key] = value;
    });

    return {
        nonFieldErrors,
        errors: parsed,
    };
};

/* check out these links for ideas
 * https://github.com/thorgate/tg-spa-utils/blob/d61fd05586265102bf85502a353e9258625b5fb2/packages/forms/src/formErrors.ts
 * https://github.com/thorgate/tg-resources/blob/465bbc774016f8fc8882cd1ef27aeb188d1c29c6/packages/core/src/ValidationError.ts#L265
 */

const formErrorsHandler = (errorResponse, formikBag) => {
    const { setStatus, setErrors } = formikBag;
    const { response } = errorResponse;

    if (isServerError(errorResponse)) {
        setStatus({
            message: defaultMessages.invalidResponseCode,
        });
    } else if (isValidationError(response)) {
        const { nonFieldErrors, errors } = parseformErrors(response.data);
        if (nonFieldErrors) {
            setStatus({
                message: nonFieldErrors.toString(),
                color: 'error',
            });
        }

        setErrors(errors);
    } else if (isOther4xxError(response)) {
        const { detail } = response.data;

        setStatus({
            message: `${detail}`,
        });
    } else {
        // Fallback to status error
        const { statusText } = errorResponse;
        setStatus({
            message: `${statusText}`,
        });
    }
};

export { formErrorsHandler };
