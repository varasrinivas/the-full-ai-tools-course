Build module $ARGUMENTS from its approved plan.
1. Re-read the approved plan in this session; if none exists, stop and ask to run /plan-module first.
2. Add exactly one object to the MODS array in 10x-toolkit.html following the module template in BLUEPRINT.md. Set lastVerified to today for verified claims; needsVerification:true otherwise.
3. Mount the visual via its VISUALS.md factory id. Create the factory only if the plan approved a new id.
4. Keep the diff scoped: MODS entry + (optionally) one new visual factory. No shell refactors.
5. Open questions go in PROGRESS.md, not in code comments.
