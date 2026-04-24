/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReviewRequest } from '../models/ReviewRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReviewService {
    /**
     * @param projectId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiProjectsReviews(
        projectId: string,
        requestBody?: ReviewRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/projects/{projectId}/reviews',
            path: {
                'projectId': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param projectId
     * @returns any OK
     * @throws ApiError
     */
    public static getApiProjectsReviews(
        projectId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/projects/{projectId}/reviews',
            path: {
                'projectId': projectId,
            },
        });
    }
}
