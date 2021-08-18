import patientData from "../../data/patients";
import { NonSensitivePatient, Patient, NewPatientEntry, Entry, newEntry} from "../types";
import { v4 as uuidv4 } from 'uuid';

const patients: Array<Patient> = patientData;

const getEntries = (): Patient[] => {
    return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id, name, dateOfBirth, gender, occupation
    }));
};

const findById = (id: string): Patient | undefined => {
    return patients.find(p => p.id === id);
}

const addPatient = (patient: NewPatientEntry): Patient => {
    const newPatientEntry: Patient = {
        id: uuidv4(),
        ...patient,
        entries: []
    };

    patients.push(newPatientEntry);
    return newPatientEntry;
}

const addEntry = (patientId: string, newEntry: newEntry): Entry => {
    const id = uuidv4();
    const entryWithID = { ...newEntry, id };
    patients.forEach((patient) => {
    if (patient.id === patientId) {
      patient.entries.push(entryWithID);
      return patient;
    }
    return patient;
  });

  return entryWithID;
};

export default {
    getEntries,
    getNonSensitiveEntries,
    findById,
    addPatient,
    addEntry
};