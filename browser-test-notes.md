# Browser Test Notes

## Dashboard Page
- Stats cards show: Total Attestations = 0, Flagged = 0, Auto-Patched = 0, Avg CQS = 93.3
- The total/flagged/patched are 0 because the tRPC query returns data but the stats query may be returning null
- CQS Radar renders correctly with 4 IMDA pillars
- Trace Flow pipeline renders correctly
- Active Guardrails sidebar renders correctly
- Loading spinner shows for attestation table

## Issue: Stats showing 0
- The attestation stats query may be returning null or the data isn't being parsed correctly
- Need to check the db.ts getAttestationStats function
