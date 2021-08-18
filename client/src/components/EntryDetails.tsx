import React from "react";
import { Entry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry } from "../types";
import { Icon } from 'semantic-ui-react';

const assertNever = (value: never): never => {
    throw new Error(
        `unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const Hospital: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
    return (
        <div>
            <h3>
                {entry.date} <Icon name="hospital" />
            </h3>
            <p>
                {entry.description}
            </p>
            <h4>Discharge</h4>
            <p>Date: {entry.discharge?.date}</p>
            <p>Criteria: {entry.discharge?.criteria}</p>
        </div>
    );
};

const OccupationalHealthcare: React.FC<{entry: OccupationalHealthcareEntry}>= ({entry}) => {
    return (
        <div>
            <h3>
                {entry.date} <Icon name="stethoscope" />
            </h3>
            <p>
                {entry.description}
            </p>
        </div>
    );
};

const HealthCheck: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
    return (
        <div>
            <h3>
                {entry.date} <Icon name="medkit" />
            </h3>
            <p>
                {entry.description}
            </p>
            {entry.healthCheckRating === 0 && (
                <Icon name="heart" color="green" />
            )}
            {entry.healthCheckRating === 1 && (
                <Icon name="heart" color="yellow" />
            )}
            {entry.healthCheckRating === 2 && (
                <Icon name="heart" color="orange" />
            )}
            {entry.healthCheckRating === 3 && (
                <Icon name="heart" color="red" />
            )}
        </div>
    );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
        case "Hospital":
            return <Hospital entry={entry} />;
        case "OccupationalHealthcare":
            return <OccupationalHealthcare entry={entry} />;
        case "HealthCheck":
            return <HealthCheck entry={entry} />;
        default:
            return assertNever(entry);
    }
};

export default EntryDetails;