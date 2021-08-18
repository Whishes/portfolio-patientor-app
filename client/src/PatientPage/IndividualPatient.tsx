import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useParams } from 'react-router-dom';
import { useStateValue, updatePatient, setDiagnosisList, addEntry } from '../state';
import { Gender, Patient, Entry, Diagnosis, newEntry } from '../types';
import { apiBaseUrl } from '../constants';

import { Icon, SemanticICONS, Button } from "semantic-ui-react";
import EntryDetails from '../components/EntryDetails';
import HealthCheckEntryForm from "./HealthCheckEntryForm";
import HospitalEntryForm from './HospitalEntryForm';
import OccupationalEntryForm from './OccupationEntryForm';

const IndividualPatient = () => {
    const [modalOpen, setModalOpen] = React.useState<boolean | true>();
    const [entryType, setEntryType] = React.useState<string | "HealthCheckEntry">();
    const [error, setError] = React.useState<string | undefined>();
    const { id } = useParams<{ id: string }>();
    const [{ patients, diagnosisList }, dispatch] = useStateValue();
    const [patient, setPatient] = useState<Patient | undefined>();

    const onSubmit = async (values: newEntry) => {
        try {
            const { data: newEntryDetails } = await axios.post<Entry>(`${apiBaseUrl}/patients/:id/entries`, values);
            dispatch(addEntry(id, newEntryDetails));
            patient && patient.entries.push(newEntryDetails);
            setModalOpen(false);
        } catch (error) {
            console.error(error.response.data);
            setError(error.response.data.error);
        }
    };

    const onCancel = (): void => {
        setModalOpen(false);
    };

    useEffect(() => {
        const getPatient = async () => {
            try {
                const { data: patient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
                setPatient(patient);
                dispatch(updatePatient(patient));
            } catch (error) {
                console.log(error);
            }
        };

        const getDiagnosisList = async () => {
            try {
                const { data: diagnosisList } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/dianoses`);
                dispatch(setDiagnosisList(diagnosisList));
            } catch (error) {
                console.log(error);
            }
        };

        if (patients[id] && patients[id].ssn) {
            setPatient(patients[id]);
        } else {
            void getPatient();
        }

        if (Object.values(diagnosisList).length === 0) {
            void getDiagnosisList();
        }
    }, [id, dispatch, patients]);

    if (!patient || !diagnosisList) {
        return <div>Loading...</div>;
    }

    const genderIcon = (gender: Gender): SemanticICONS => {
        switch (gender) {
            case "male":
                return "mars";
            case "female":
                return "venus";
            default:
                return "transgender alternate";
        }
    };

    return (
        <div>
            {error && (
                <div style={{ padding: '10px', border: '2px solid red' }}>{error}</div>
            )}
            {patient && (
                <>
                    <h1>
                        {patient.name}
                        <Icon name={genderIcon(patient.gender)} />
                    </h1>
                    <p>ssn: {patient.ssn}</p>
                    <p>occupation: {patient.occupation}</p>
                    {patient.entries.length > 0 && (
                        <div>
                            <h1>Entries</h1>
                            {patient.entries.map((entry: Entry) => {
                                return (
                                    <div key={id}>
                                        <EntryDetails entry={entry} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <Button onClick={() => {
                        modalOpen ? setModalOpen(false) : setModalOpen(true);
                    }}>Add Entry </Button>
                        <select onChange={(e) => setEntryType(e.target.value)}>
                            <option value="HealthCheckEntry">HealthCheckEntry</option>
                            <option value="HospitalEntry">HospitalEntry</option>
                            <option value="OccupationalHealthcareEntry">
                            OccupationalHealthcareEntry
                            </option>
                        </select>
                        {modalOpen && entryType === 'HealthCheckEntry' && (
                            <HealthCheckEntryForm onSubmit={onSubmit} onCancel={onCancel} />
                        )}
                        {modalOpen && entryType === 'HospitalEntry' && (
                            <HospitalEntryForm onSubmit={onSubmit} onCancel={onCancel} />
                        )}
                        {modalOpen && entryType === 'OccupationalHealthcareEntry' && (
                            <OccupationalEntryForm onSubmit={onSubmit} onCancel={onCancel} />
                    )}
                </>    
            )}
        </div>
    );
};

export default IndividualPatient;
