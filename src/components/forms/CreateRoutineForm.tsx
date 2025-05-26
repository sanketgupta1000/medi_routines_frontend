import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, Controller, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../store/hooks";
import routineService from "../../services/routineService";
import usePredefinedMedicines from "../../hooks/usePredefinedMedicines";
import { handleErrorsAfterLogin } from "../../utils/errors/handlers";
import InputBox from "../input/InputBox";
import SelectInput from "../input/SelectInput";
import Checkbox from "../input/Checkbox";
import InputError from "../input/InputError";
import Button from "../input/Button";
import type { DayOfWeek, TimeOfDay, MedicineType, CreateRoutineRequest } from "../../services/routineService";

type CreateRoutineData = CreateRoutineRequest;

function CreateRoutineForm() {
    const token = useAppSelector(state => state.user.token);
    const navigate = useNavigate();
    const checkboxRef = useRef<HTMLInputElement>(null);
    
    // Use the custom hook to get predefined medicines
    const [predefinedLoading, predefinedMedicines, predefinedError] = usePredefinedMedicines(token);
    
    // Handle predefined medicine errors
    useEffect(() => {
        if ((!predefinedLoading) && predefinedError)
        {
            console.log(predefinedError);
            handleErrorsAfterLogin(predefinedError, navigate);
        }
    }, [predefinedLoading]);
    
    // Get user-defined medicines from Redux store
    const userDefinedMedicines = useAppSelector(state => state.userDefinedMedicines.userDefinedMedicines);

    // React Hook Form setup
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<CreateRoutineData>({
        defaultValues: {
            name: "",
            medicines: [
                {
                    medicineType: "UserDefinedMedicine",
                    medicineId: "",
                    schedule: [
                        {
                            day: "Monday",
                            times: []
                        }
                    ]
                }
            ]
        }
    });

    // submit loading state
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    // Field arrays for dynamic medicine and schedule entries
    const { fields: medicineFields, append: appendMedicine, remove: removeMedicine } = useFieldArray({
        control,
        name: "medicines"
    });

    // Form submission handler
    const onSubmit: SubmitHandler<CreateRoutineData> = useCallback((data) => {
        setSubmitLoading(true);
        routineService.createRoutine({
            token: token!,
            name: data.name,
            medicines: data.medicines
        })
        .then(() => {
            navigate("/routines");
        })
        .catch(error => {
            handleErrorsAfterLogin(error, navigate);
        })
        .finally(() => {
            setSubmitLoading(false);
        });
    }, [token, navigate]);

    // Create nested field arrays for schedules
    const medicineScheduleArrays = medicineFields.map((field, index) => 
        useFieldArray({
            control,
            name: `medicines.${index}.schedule`
        })
    );

    // Watch medicine types to show appropriate medicine options
    const medicineTypes = watch("medicines").map(m => m.medicineType);

    // Simple arrays for the options
    const days: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const times: TimeOfDay[] = ["Morning", "Afternoon", "Evening", "Night"];
    const medicineTypeList: MedicineType[] = ["PredefinedMedicine", "UserDefinedMedicine"];    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Routine name field */}
            <InputBox
                type="text"
                label="Routine Name"
                placeholder="Enter routine name"
                {...register("name", { required: true })}
            />
            {errors.name && <InputError>Please enter a routine name</InputError>}

            {/* Medicines section */}
            <div className="space-y-6">
                <h3 className="text-xl font-medium">Medicines</h3>
                
                {/* Loading state for predefined medicines */}
                {predefinedLoading && <p className="text-gray-600 py-2">Loading medicines...</p>}
                
                {!predefinedLoading && medicineFields.map((field, medicineIndex) => (
                    <div key={field.id} className="p-4 border rounded-lg bg-white mb-6">
                        <h4 className="font-medium text-lg mb-4">Medicine {medicineIndex + 1}</h4>
                        
                        {/* Medicine type selection */}
                        <SelectInput
                            label="Medicine Type"
                            options={medicineTypeList.map(type => ({ 
                                value: type, 
                                label: type === "PredefinedMedicine" ? "Predefined Medicine" : "User Defined Medicine" 
                            }))}
                            {...register(`medicines.${medicineIndex}.medicineType` as const, { required: true })}
                        />
                        
                        {/* Medicine selection based on type */}
                        <SelectInput
                            label="Medicine"
                            options={
                                medicineTypes[medicineIndex] === "PredefinedMedicine"
                                    ? predefinedMedicines.map(med => ({ value: med.id, label: med.name }))
                                    : userDefinedMedicines.map(med => ({ value: med.id, label: med.name }))
                            }
                            {...register(`medicines.${medicineIndex}.medicineId`, { required: true })}
                        />
                        {errors.medicines?.[medicineIndex]?.medicineId && 
                            <InputError>Please select a medicine</InputError>
                        }
                          {/* Schedule section */}
                        <div className="mt-4">
                            <h5 className="font-medium mb-3">Schedule</h5>
                            
                            {medicineScheduleArrays[medicineIndex].fields.map((scheduleField, scheduleIndex) => (
                                <div key={scheduleField.id} className="border-t pt-4 mb-4">
                                    <h6 className="text-sm font-medium mb-2">Schedule {scheduleIndex + 1}</h6>
                                    
                                    {/* Day selection */}
                                    <SelectInput
                                        label="Day"
                                        options={days.map(day => ({ value: day, label: day }))}
                                        {...register(`medicines.${medicineIndex}.schedule.${scheduleIndex}.day`, { required: true })}
                                    />
                                    
                                    {/* Time selection (checkboxes) */}
                                    <div className="mb-4">
                                        <p className="block mb-1 text-sm font-medium text-gray-700">Times</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {times.map(time => (
                                                <div key={time}>
                                                    <Controller
                                                        name={`medicines.${medicineIndex}.schedule.${scheduleIndex}.times`}
                                                        control={control}
                                                        rules={{ required: true, validate: times => times.length > 0 }}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                ref={checkboxRef}
                                                                label={time}
                                                                onChange={e => {
                                                                    const checked = e.target.checked;
                                                                    const currentTimes = field.value || [];
                                                                    
                                                                    if (checked && !currentTimes.includes(time)) {
                                                                        field.onChange([...currentTimes, time]);
                                                                    } else if (!checked && currentTimes.includes(time)) {
                                                                        field.onChange(currentTimes.filter(t => t !== time));
                                                                    }
                                                                }}
                                                                checked={(field.value || []).includes(time)}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {errors.medicines?.[medicineIndex]?.schedule?.[scheduleIndex]?.times && 
                                            <InputError>Please select at least one time</InputError>
                                        }
                                    </div>
                                      {/* Remove schedule button */}
                                    {medicineScheduleArrays[medicineIndex].fields.length > 1 && (
                                        <Button
                                            type="button"
                                            onClick={() => medicineScheduleArrays[medicineIndex].remove(scheduleIndex)}
                                            className="mt-2 bg-red-500 hover:bg-red-600"
                                        >
                                            Remove Schedule
                                        </Button>
                                    )}
                                </div>
                            ))}
                            
                            {/* Add schedule button */}
                            <Button
                                type="button"
                                onClick={() => medicineScheduleArrays[medicineIndex].append({ day: "Monday", times: [] })}
                                className="mt-2 bg-gray-600 hover:bg-gray-700"
                            >
                                Add Schedule
                            </Button>
                        </div>
                        
                        {/* Remove medicine button */}
                        {medicineFields.length > 1 && (
                            <Button
                                type="button"
                                onClick={() => removeMedicine(medicineIndex)}
                                className="mt-4 bg-red-500 hover:bg-red-600"
                            >
                                Remove Medicine
                            </Button>
                        )}
                    </div>
                ))}
                
                {/* Add medicine button */}
                <Button
                    type="button"
                    onClick={() => appendMedicine({
                        medicineType: "UserDefinedMedicine",
                        medicineId: "",
                        schedule: [{ day: "Monday", times: [] }]
                    })}
                    className="mt-2 bg-gray-600 hover:bg-gray-700"
                >
                    Add Medicine
                </Button>
            </div>
            
            {/* Submit button */}
            <Button 
                type="submit"
                loading={submitLoading}
                className="mt-6 w-full sm:w-auto"
            >
                {submitLoading ? "Creating..." : "Create Routine"}
            </Button>
        </form>
    );
}

export default CreateRoutineForm;