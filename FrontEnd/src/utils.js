export const getDomainName = (url) => {
    // Remove protocol (http, https, etc.) and "www."
    let domain = url.replace(/(^\w+:|^)\/\//, '').replace(/^www\./, '');
    // Extract the main domain and suffix
    domain = domain.split('/')[0];
    return domain;
};