import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField, DiagnosisSelection } from "../AddPatientModal/FormField";
import {newEntry} from "../types";
import { useStateValue } from '../state';

interface Props {
  onSubmit: (values: newEntry) => void;
  onCancel: () => void;
}

export const HealthCheckEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnosisList }] = useStateValue();
  return (
    <Formik
    initialValues={{
        description: "",
        specialist: "",
        date: "",
        healthCheckRating: 0,
    }}
    onSubmit={onSubmit}
    validate={values => {
      const requiredError = "Field is required";
      const errors: { [field: string]: string } = {};
      if (!values.description) {
          errors.description = requiredError;
        }
      if (!values.specialist) {
          errors.specialist = requiredError;
        }
      if (!values.date) {
          errors.date = requiredError;
        }
      return errors;
    }}
  >
    {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
      return (
        <Form className="form ui">
          <Field label="Description" name="description" component={TextField}/>
          <Field label="Specialist" name="specialist" component={TextField}/>
          <Field label="Date" name="date" component={TextField} />
          <DiagnosisSelection
            setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} diagnoses={Object.values(diagnosisList)} />
          <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
        </Form>
      );
    }}
  </Formik>
  );
};

export default HealthCheckEntryForm;