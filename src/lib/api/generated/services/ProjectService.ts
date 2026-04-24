/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubmitProjectRequest } from '../models/SubmitProjectRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectService {
    /**
     * @param formData
     * @returns any OK
     * @throws ApiError
     */
    public static postApiProjectsParse(
        formData?: {
            file?: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/projects/parse',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiProjects(
        requestBody?: SubmitProjectRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/projects',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param page
     * @param pageSize
     * @param semesterId
     * @param status
     * @param search
     * @returns any OK
     * @throws ApiError
     */
    public static getApiProjects(
        page: number = 1,
        pageSize: number = 20,
        semesterId?: string,
        status?: string,
        search?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/projects',
            query: {
                'page': page,
                'pageSize': pageSize,
                'semesterId': semesterId,
                'status': status,
                'search': search,
            },
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static getApiProjects1(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/projects/{id}',
            path: {
                'id': id,
            },
        });
    }
}
