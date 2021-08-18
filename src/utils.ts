import { NewPatientEntry, Gender, BaseEntry, newEntry, Diagnose, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry} from "./types";

const isString = (text: unknown): text is string => {
    return typeof text === "string" || text instanceof String;
};

const parseString = (label: string, data: unknown): string => {
    if (!data || !isString(data)) {
        throw new Error(`incorrect or missing string ${label}`);
    }
    return data;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const isGender = (param: any): param is Gender => {
    return Object.values(Gender).includes(param);
}

const parseGender = (gender: unknown): Gender => {
    if (!gender || !isGender(gender)) {
        throw new Error("incorrect or missing gender: " + gender)
    };
    return gender;
}

export const toNewPatientEntry = (object: any): NewPatientEntry => {
    return {
        name: parseString("name", object.name),
        dateOfBirth: parseDate(object.dateOfBirth),
        ssn: parseString("ssn", object.ssn),
        gender: parseGender(object.gender),
        occupation: parseString("occupation", object.occupation),
    };
};

const parseDiagnosis = (
  diagnosisCodes: any
): diagnosisCodes is Array<Diagnose['code']> => {
  return diagnosisCodes.every((diagnosisCode: any) => isString(diagnosisCode));
};


const isNewBaseEntry = (entry: any): entry is BaseEntry => {
  if (entry.diagnosisCodes) {
    if (!parseDiagnosis(entry.diagnosisCodes)) {
      throw new Error(`Incorrect Diagnosis Code ${entry.diagnosis}`);
    }
  }

  if (
    !entry ||
    !isString(entry.description) ||
    !isDate(entry.date) ||
    !isString(entry.specialist)
  ) {
    throw new Error('Incorrect description, date or specialist');
  }

  return entry;
};
const isHospitalEntry = (entry: any): entry is HospitalEntry => {
  if (
    entry.discharge &&
    Object.keys(entry.discharge).includes('date') &&
    Object.keys(entry.discharge).includes('criteria')
  ) {
    if (!isString(entry.discharge.criteria) || !isDate(entry.discharge.date)) {
      throw new Error('Incorrect discharge information');
    } else {
      return true;
    }
  }
  return false;
};

const isOccupationalHealthcareEntry = (
  entry: any
): entry is OccupationalHealthcareEntry => {
  if (entry.employerName) {
    if (entry.sickLeave) {
      if (
        Object.keys(entry.sickLeave).includes('startDate') &&
        Object.keys(entry.sickLeave).includes('endDate')
      ) {
        if (
          !isDate(entry.sickLeave.startDate) ||
          !isDate(entry.sickLeave.endDate)
        ) {
          throw new Error('Incorrect Date for Sick Leave');
        } else return true;
      }
    }
    return true;
  }
  return false;
};

const isHealthCheckEntry = (entry: any): entry is HealthCheckEntry => {
  if (
    entry.healthCheckRating === undefined &&
    !isString(entry.healthCheckRating)
  ) {
    return false;
  }
  return entry;
};



export const toNewEntry = (object: any): newEntry => {
  if (!isNewBaseEntry(object)) {
    throw new Error(`Not base entry ${object}`);
  }
  if (isHospitalEntry(object)) {
    return { ...object, type: 'Hospital' };
  } else if (isOccupationalHealthcareEntry(object)) {
    return { ...object, type: 'OccupationalHealthcare' };
  } else if (isHealthCheckEntry(object)) {
    return { ...object, type: 'HealthCheck' };
  } else {
    throw new Error(`Not an entry from the above types.`);
  }
};