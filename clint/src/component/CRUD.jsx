import React, { useState, useEffect } from "react"; 
import { getAll, getPatientById, createPatient, updatePatient, deletePatient } from "../api/patients.js";

const Crud = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [newPatientData, setNewPatientData] = useState({
        surNamee: '',
        namee: '',
        patronymic: '',
        dateOfBirth: '',
        gender: '',
        contactInfo: '',
        addresse: ''
    });
    const [editingPatientId, setEditingPatientId] = useState(null);
    const [formVisible, setFormVisible] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const data = await getAll();
            setPatients(data);
            setFilteredPatients(data); // Initialize filtered patients
        } catch (error) {
            console.error("Ошибка получения данных", error);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Filter patients based on the search term
        const filtered = patients.filter(patient => 
            patient.namee.toLowerCase().includes(value.toLowerCase()) ||
            patient.surNamee.toLowerCase().includes(value.toLowerCase()) ||
            patient.patientId.toString() === value // Check if ID matches
        );

        setFilteredPatients(filtered);
    };

    const fetchPatientById = async (id) => {
        try {
            const patientData = await getPatientById(id);
            setNewPatientData({
                surNamee: patientData.surNamee || '',
                namee: patientData.namee || '',
                patronymic: patientData.patronymic || '',
                dateOfBirth: patientData.dateOfBirth ? patientData.dateOfBirth.split('T')[0] : '',
                gender: patientData.gender || '',
                contactInfo: patientData.contactInfo || '',
                addresse: patientData.addresse || ''
            });
            setEditingPatientId(id);
            setFormVisible(true); // Show form for editing
        } catch (error) {
            console.error("Ошибка получения данных пациента", error);
            alert("Ошибка получения данных пациента.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPatientData({
            ...newPatientData,
            [name]: value
        });
    };

    const savePatient = async () => {
        try {
            // Validate required fields before saving
            if (!newPatientData.surNamee || !newPatientData.namee) {
                alert("Фамилия и Имя обязательны для заполнения");
                return; // Prevent submission if validation fails
            }

            if (editingPatientId) {
                await updatePatient(editingPatientId, newPatientData);
            } else {
                await createPatient(newPatientData);
            }
            
            fetchPatients(); // Refresh patient list after saving
            resetForm(); // Reset form after saving
        } catch (error) {
            console.error("Ошибка сохранения данных пациента", error.message);
            alert("Ошибка сохранения данных пациента. Проверьте введенные данные.");
        }
    };

    const resetForm = () => {
        setNewPatientData({
            surNamee: '',
            namee: '',
            patronymic: '',
            dateOfBirth: '',
            gender: '',
            contactInfo: '',
            addresse: ''
        });
        setEditingPatientId(null); // Reset editing ID
        setFormVisible(false); // Hide form after saving
    };

    const Delete = async (id) => {
        try {
            await deletePatient(id);
            fetchPatients(); // Refresh list after deletion
        } catch (error) {
            console.error("Ошибка удаления пациента", error.message);
            alert("Ошибка удаления пациента.");
        }
    };

    return (
      <div>
          <h2>{editingPatientId ? "Редактировать Пациента" : "Добавить Пациента"}</h2>

          {/* Search Input */}
          <input 
              type="text" 
              placeholder="Поиск по имени или ID" 
              value={searchTerm} 
              onChange={handleSearchChange} 
          />

          {/* Add Patient Button */}
          <button onClick={() => { resetForm(); setFormVisible(true); }}>
              Добавить Пациента
          </button>

          {/* Form for Adding/Editing Patient */}
          {formVisible && (
              <div>
                  <input 
                      type="text" 
                      name="surNamee" 
                      placeholder="Фамилия" 
                      value={newPatientData.surNamee} 
                      onChange={handleInputChange} 
                  />
                  <input 
                      type="text" 
                      name="namee" 
                      placeholder="Имя" 
                      value={newPatientData.namee} 
                      onChange={handleInputChange} 
                  />
                  <input 
                      type="text" 
                      name="patronymic" 
                      placeholder="Отчество" 
                      value={newPatientData.patronymic} 
                      onChange={handleInputChange} 
                  />
                  <input 
                      type="date" 
                      name="dateOfBirth" 
                      value={newPatientData.dateOfBirth} 
                      onChange={handleInputChange} 
                  />
                  <select
                      name="gender"
                      value={newPatientData.gender}
                      onChange={handleInputChange}
                  >
                      <option value="">Пол</option>
                      <option value="M">Мужской</option>
                      <option value="F">Женский</option>
                  </select>
                  <input 
                      type="text" 
                      name="contactInfo" 
                      placeholder="Контактная информация" 
                      value={newPatientData.contactInfo} 
                      onChange={handleInputChange} 
                  />
                  <input 
                      type="text" 
                      name="addresse" 
                      placeholder="Адрес" 
                      value={newPatientData.addresse} 
                      onChange={handleInputChange} 
                  />

                  <button onClick={savePatient}>
                    {editingPatientId ? "Сохранить Изменения" : "Добавить Пациента"}
                  </button>
              </div>
          )}

          <table>
              <tbody>
                  <tr>
                      <th>№</th>
                      <th>Фамилия</th>
                      <th>Имя</th>
                      <th>Отчество</th>
                      <th>Дата рождения</th>
                      <th>Пол</th>
                      <th>Контактная информация</th>
                      <th>Адрес</th>
                      <th>Действия</th>
                  </tr>
                  {filteredPatients.map((item, index) => (
                    <tr key={item.patientId}>
                        <td>{index + 1}</td>
                        <td>{item.surNamee}</td>
                        <td>{item.namee}</td>
                        <td>{item.patronymic}</td>
                        <td>{new Date(item.dateOfBirth).toLocaleDateString()}</td>
                        <td>{item.gender}</td>
                        <td>{item.contactInfo}</td>
                        <td>{item.addresse}</td>
                        <td>
                            <button onClick={() => fetchPatientById(item.patientId)}>Изменить</button>
                            <button onClick={() => Delete(item.patientId)}>Удалить</button>
                        </td>
                    </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );
}

export default Crud;
