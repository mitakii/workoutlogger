import z from "zod";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddExercise } from "../../hooks/react-query";
import { TranslationSchema } from "../../schemas/Exercise.schema";

const exerciseScheme = z.object({
  nameTag: z.string().min(4, "name tag to short"),
  mediaUrl: z.string(),
  translations: z
    .array(TranslationSchema)
    .min(1, "At least one translation is required"),
});

type ExerciseFormInput = z.infer<typeof exerciseScheme>;

export const AddExercisePage = () => {
  const { mutateAsync: addExercise } = useAddExercise();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<ExerciseFormInput>({
    resolver: zodResolver(exerciseScheme),
    defaultValues: {
      nameTag: "",
      mediaUrl: "",
      translations: [
        {
          language: "",
          description: "",
          name: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "translations",
  });

  const handleExercisePost = async (form: ExerciseFormInput) => {
    try {
      await addExercise(form);
      reset();
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        setError("root", { message: "Unexpected error occured" });
        return;
      }

      const nameTagError = e.response?.data?.errors?.["NameTag"];
      if (nameTagError) {
        setError("nameTag", { type: "server", message: nameTagError });
      } else {
        setError("root", { message: "Failed to add exercise" });
      }
    }
  };

  return (
    <div>
      {errors.root?.message}
      <form action="" onSubmit={handleSubmit(handleExercisePost)}>
        <input type="text" placeholder="name tag" {...register("nameTag")} />
        {errors.nameTag ? <p>{errors.nameTag.message}</p> : ""}

        <input type="text" {...register("mediaUrl")} />
        {errors.mediaUrl ? <p>{errors.mediaUrl.message}</p> : ""}
        <div>Translations</div>

        {fields.map((field, index) => (
          <div key={field.id}>
            <input
              type="text"
              placeholder="language"
              {...register(`translations.${index}.language`)}
            />
            {errors.translations?.[index]?.language ? (
              <p>{errors.translations[index].language.message}</p>
            ) : (
              ""
            )}
            <input
              type="text"
              placeholder="name"
              {...register(`translations.${index}.name`)}
            />
            {errors.translations?.[index]?.name ? (
              <p>{errors.translations[index].name.message}</p>
            ) : (
              ""
            )}
            <input
              type="text"
              placeholder="description"
              {...register(`translations.${index}.description`)}
            />
            {errors.translations?.[index]?.description ? (
              <p>{errors.translations[index].description.message}</p>
            ) : (
              ""
            )}
            <button type="button" onClick={() => remove(index)}></button>
          </div>
        ))}
        <br />
        <button
          type="button"
          onClick={() => append({ language: "", name: "", description: "" })}
        >
          {" "}
          add new translation
        </button>
        {errors.translations ? <p>{errors.translations.message}</p> : ""}
        <br />
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};
