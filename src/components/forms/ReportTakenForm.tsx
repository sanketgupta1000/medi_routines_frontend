
// to report one routine's some medicines taken

import { useForm, type SubmitHandler } from "react-hook-form";
import type { UpcomingRoutine } from "../../hooks/useUpcomingRoutines";
import type { CreateMultipleTakenRequest, Taken } from "../../services/takenService";
import { useAppSelector } from "../../store/hooks";
import { useCallback, useState } from "react";
import takenService from "../../services/takenService";
import { handleErrorsAfterLogin } from "../../utils/errors/handlers";
import { useNavigate } from "react-router";

interface ReportTakenFormProps extends UpcomingRoutine
{
    // function to mark the medicines as reported, so that the parent component can update the state
    onReportTaken: (routineId: string, date: string, day: string, time: string, takenMedicines: Taken[]) => void;
}

// form to report taken medicines of a routine
// will have checkboxes for each upcoming medicine in the routine
// and a submit button to report taken

interface ReportTakenData
{
    routineMedicines: string[]; // array of routine medicine ids that are taken
    // the routineId, routineName, localDate, localDay, localTime are not needed here
    // as they are already passed as props
}

function ReportTakenForm(
    {
        routineId,
        routineName,
        localDate,
        localDay,
        localTime,
        routineMedicines,
        onReportTaken,
    }: ReportTakenFormProps)
{

    // get the token from store
    const token = useAppSelector(store=>store.user.token);

    // react hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ReportTakenData>({
        defaultValues: {
            // by default, no medicines are selected
            routineMedicines: []
        }
    });

    // submit loading state
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    // navigate
    const navigate = useNavigate();

    // function to handle submit
    const onSubmit: SubmitHandler<ReportTakenData> = useCallback((data) =>
    {
        setSubmitLoading(true);

        // create the request data
        const requestData: CreateMultipleTakenRequest = {
            token: token!,
            routine: routineId,
            routineMedicines: data.routineMedicines,
            date: localDate,
            day: localDay,
            time: localTime
        };

        // here we will call the service to report taken medicines
        // using the data and token
        takenService.createMultipleTaken(requestData)
        .then((resp) => {
            
            // successfully reported taken medicines
            // call the onReportTaken function passed from parent
            onReportTaken(routineId, localDate, localDay, localTime, resp.taken);

        })
        .catch((err: Error) => {
            console.log(err);
            handleErrorsAfterLogin(err, navigate);
        })
        .finally(() => {
            setSubmitLoading(false);
        });
    }, [setSubmitLoading, navigate, token, routineId, onReportTaken]);

    return (

        // routine card
        <div>

            <p>{routineName}: {localDay}, {localTime}: {localDate}</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* display a checkbox for each routine medicine */}
                {/* at least one medicine must be selected */}
                {routineMedicines.map((medicine) => (
                    <div key={medicine.routineMedicineId}>
                        <label>
                            <input
                                type="checkbox"
                                value={medicine.routineMedicineId}
                                {...register("routineMedicines", {
                                    validate: {
                                        notEmpty: (value) => value.length > 0 || "Please select at least one medicine"
                                    }
                                })}
                            />
                            {medicine.routineMedicineName}
                        </label>
                    </div>
                ))}

                {errors.routineMedicines && (
                    <p className="error">Please select at least one medicine</p>
                )}

                {/* submit button */}

                <button type="submit" disabled={submitLoading}>
                    {submitLoading ? 'Reporting...' : 'Report Taken'}
                </button>
            </form>

        </div>

    );
}

export default ReportTakenForm;