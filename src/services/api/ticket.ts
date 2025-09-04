import axios from 'axios';
import { API_BASE_URL, ACCOUNT, PRODUCER_QA } from './apiConfig';

export const getAllTickets = async (account: string = ACCOUNT) => {
    try {
        const url = `${API_BASE_URL}/ticket?api_key=${account}&limit=6000&states=delivered&include=false&simple=true`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('getAllTickets: ', error);
        throw error;
    }
};

export const getTicketByTicketId = async (ticketId: string) => {
    try {
        const url = `${API_BASE_URL}/ticket/${ticketId}?api_key=${ACCOUNT}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('getTicketByTicketId: ', error);
        throw error;
    }
};

export const getModelByModelId = async (modelId: string) => {
    try {
        const url = `${API_BASE_URL}/model/${modelId}?api_key=${ACCOUNT}&format=svg`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('getModelByModelId: ', error);
        throw error;
    }
};

export const getSourceBySourceId = async (sourceId: string) => {
    try {
        const url = `${API_BASE_URL}/source/${sourceId}?api_key=${ACCOUNT}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('getSourceBySourceId: ', error);
        throw error;
    }
};

export const getSourcekeyBySourceId = async (sourceId: string) => {
    try {
        const url = `${API_BASE_URL}/source/${sourceId}/sourcekey?api_key=${ACCOUNT}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('getImageBySourceId: ', error);
        throw error;
    }
};

export const updateTicket = async (iterationId: string) => {
    try {
        const url = `${API_BASE_URL}/iteration/event?api_key=${ACCOUNT}`;
        // qaing
        const request = {
            "iteration_id": iterationId,
            "Process_state": "qaing",
            "producer_id": PRODUCER_QA
        };
        // drawing
        // const request = {
        //     "iteration_id": iterationId,
        //     "Process_state": "drawing",
        //     "producer_id": PRODUCER_PR
        // };
        const response = await axios.post(url, request);
        return response;
    } catch (error) {
        console.error('updateTicket: ', error);
        throw error;
    }
};