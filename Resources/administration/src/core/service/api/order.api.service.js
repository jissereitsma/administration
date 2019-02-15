import { deepCopyObject } from 'src/core/service/utils/object.utils';
import utils from 'src/core/service/util.service';
import ApiService from '../api.service';

/**
 * Gateway for the API end point "order"
 * @class
 * @extends ApiService
 */
class OrderApiService extends ApiService {
    constructor(httpClient, loginService, apiEndpoint = 'order') {
        super(httpClient, loginService, apiEndpoint);
        this.name = 'orderService';
    }

    recalculateOrder(orderId, versionId, additionalParams = {}, additionalHeaders = {}) {
        const route = `/_action/order/${orderId}/recalculate`;

        const headers = Object.assign(ApiService.getVersionHeader(versionId), this.getBasicHeaders(additionalHeaders));

        return this.httpClient
            .post(route, {}, {
                additionalParams,
                headers
            });
    }

    addProductToOrder(orderId, versionId, productId, quantity, additionalParams = {}, additionalHeaders = {}) {
        const route = `_action/order/${orderId}/product/${productId}`;

        const headers = Object.assign(ApiService.getVersionHeader(versionId), this.getBasicHeaders(additionalHeaders));

        return this.httpClient
            .post(route, { quantity: quantity }, {
                additionalParams,
                headers
            });
    }

    addCustomLineItemToOrder(orderId, versionId, item, additionalParams = {}, additionalHeaders = {}) {
        const route = `_action/order/${orderId}/lineItem`;

        const headers = Object.assign(ApiService.getVersionHeader(versionId), this.getBasicHeaders(additionalHeaders));

        const dummyPrice = deepCopyObject(item.priceDefinition);
        dummyPrice.taxRules = item.priceDefinition.taxRules.elements;

        return this.httpClient
            .post(route,
                JSON.stringify(
                    { label: item.label,
                        quantity: item.quantity,
                        // identifier: item.identifier,
                        type: item.type,
                        identifier: utils.createId(),
                        description: item.description,
                        priceDefinition: dummyPrice }
                ), {
                    additionalParams,
                    headers
                });
    }

    changeOrderAddress(orderAddressId, customerAddressId, additionalParams, additionalHeaders) {
        const route = `_action/order-address/${orderAddressId}/customer-address/${customerAddressId}`;

        const params = Object.assign({ }, additionalParams);
        const headers = this.getBasicHeaders(additionalHeaders);

        return this.httpClient
            .post(route, {}, {
                params,
                headers
            });
    }

    getState(orderId, versionId, additionalParams = {}, additionalHeaders = {}) {
        const route = `_action/order/${orderId}/state`;

        const headers = Object.assign(ApiService.getVersionHeader(versionId), this.getBasicHeaders(additionalHeaders));

        return this.httpClient
            .get(route, {
                additionalParams,
                headers
            });
    }

    transitionState(orderId, versionId, actionName, additionalParams = {}, additionalHeaders = {}) {
        const route = `_action/order/${orderId}/state/${actionName}`;

        const headers = Object.assign(ApiService.getVersionHeader(versionId), this.getBasicHeaders(additionalHeaders));

        return this.httpClient
            .post(route, {}, {
                additionalParams,
                headers
            });
    }
}

export default OrderApiService;
