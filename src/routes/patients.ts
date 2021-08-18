import express from "express";
import patientService from "../services/patientService";
//import { Entry } from "../types";
import { toNewPatientEntry, toNewEntry } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send(patientService.getNonSensitiveEntries());
});

router.get("/:id", (req, res) => {
    const patient = patientService.findById(req.params.id);

    if (patient) {
        res.send(patient);
    } else {
        res.sendStatus(404);
    }
});

router.post("/", (req, res) => {
    try {
        const newPatientEntry = toNewPatientEntry(req.body);

        const addedEntry = patientService.addPatient(newPatientEntry);
        res.json(addedEntry);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.post('/:id/entries', (req, res) => {
    try {
        const patientId  = req.params.id;
        const newEntry = toNewEntry(req.body);
        const addedEntry = patientService.addEntry(patientId, newEntry);
        res.json(addedEntry);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

export default router;