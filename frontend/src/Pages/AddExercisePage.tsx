import React, { useState } from "react";
import z from "zod";
import { addExercise } from "../Services/ExerciseService";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";

type Props = {};
const exerciseScheme = z.object({
  nameTag: z.string().min(4, "name tag to short"),
  mediaUrl: z.string(),
  translations: z
    .array(
      z.object({
        language: z
          .string()
          .min(2, "Language is required")
          .max(4, "language too long"),
        description: z.string().min(1, "Description required").max(200),
        name: z.string().min(1, "Name required"),
      })
    )
    .min(1, "At least one translation is required"),
});

type ExerciseFormInput = z.infer<typeof exerciseScheme>;

export const AddExercisePage = (props: Props) => {
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
      await addExercise(form.nameTag, form.mediaUrl, form.translations);
      reset();
    } catch (e: any) {
      const apiError = e.response?.data;
      setError("nameTag", {
        type: "server",
        message: `${apiError.errors?.["NameTag"]}`,
      });
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
