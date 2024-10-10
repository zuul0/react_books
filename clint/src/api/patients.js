import { $host } from './index.js';

export const getAll = async () => {
    try {
        const response = await $host.get('api/Hom/getPatients');
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return [];
    }
};

export const getPatientById = async (id) => {
    try {
        const response = await $host.get(`api/Hom/getPatient/${id}`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении пациента:", error);
        throw error;
    }
};

export const createPatient = async (patientData) => {
    try {
        const response = await $host.post('api/Hom/postPatient', patientData);
        return response.data;
    } catch (error) {
        console.error("Ошибка при создании пациента:", error);
        throw error;
    }
};

export const updatePatient = async (id, patientData) => {
    try {
        const response = await $host.put(`api/Hom/updatePatient/${id}`, patientData);
        return response.data;
    } catch (error) {
        console.error("Ошибка при обновлении пациента:", error);
        throw error;
    }
};

export const deletePatient = async (id) => {
    try {
        const response = await $host.delete(`api/Hom/deletePatient/${id}`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при удалении пациента:", error);
        throw error;
    }
};
